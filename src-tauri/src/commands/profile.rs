use crate::app_state::AppState;
use crate::clicker::overlay;
use crate::clicker::profile::{ConfigProfile, ProfileError, ProfileErrorKind, parse_profile};
use crate::commands::hotkeys::apply_hotkeys;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, State};
use tauri_plugin_dialog::DialogExt;

const MAX_PROFILE_BYTES: u64 = 1024 * 1024;

/// Returns Ok(true) when a file was written, Ok(false) when the user cancelled.
#[tauri::command]
pub async fn export_profile(
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<bool, ProfileError> {
    let Some(file) = app
        .dialog()
        .file()
        .add_filter("Autoclicker Profile", &["json"])
        .set_file_name("autoclicker-profile.json")
        .blocking_save_file()
    else {
        return Ok(false);
    };

    let mut path = file.into_path().map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::Write,
            "The selected location can't be used.",
            vec![e.to_string()],
        )
    })?;
    if path.extension().is_none() {
        path.set_extension("json");
    }

    let json = serde_json::to_string_pretty(&state.to_profile()).map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::Write,
            "Couldn't serialize the profile.",
            vec![e.to_string()],
        )
    })?;

    std::fs::write(&path, json).map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::Write,
            "Couldn't write the profile file.",
            vec![format!("{}: {e}", path.display())],
        )
    })?;
    Ok(true)
}

/// Returns Ok(None) when the user cancelled. The file is fully validated before
/// anything is changed, so a bad file never leaves the app half-imported.
#[tauri::command]
pub async fn import_profile(
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<Option<ConfigProfile>, ProfileError> {
    // Changing e.g. the sequence while the engine is running is not safe.
    if state.clicker.is_running.load(Ordering::SeqCst) {
        return Err(ProfileError::new(
            ProfileErrorKind::Busy,
            "Stop the autoclicker before importing a profile.",
            vec![],
        ));
    }

    let Some(file) = app
        .dialog()
        .file()
        .add_filter("Autoclicker Profile", &["json"])
        .blocking_pick_file()
    else {
        return Ok(None);
    };

    let path = file.into_path().map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::Read,
            "The selected file can't be used.",
            vec![e.to_string()],
        )
    })?;

    let read_error = |e: std::io::Error| {
        ProfileError::new(
            ProfileErrorKind::Read,
            "Couldn't read the selected file.",
            vec![format!("{}: {e}", path.display())],
        )
    };

    let size = std::fs::metadata(&path).map_err(read_error)?.len();
    if size > MAX_PROFILE_BYTES {
        return Err(ProfileError::new(
            ProfileErrorKind::WrongFormat,
            "This file is too large to be an autoclicker profile.",
            vec![format!("{size} bytes (limit is {MAX_PROFILE_BYTES})")],
        ));
    }

    let bytes = std::fs::read(&path).map_err(read_error)?;
    let text = String::from_utf8(bytes).map_err(|_| {
        ProfileError::new(
            ProfileErrorKind::InvalidJson,
            "This file isn't a text file, so it can't be a JSON profile.",
            vec![],
        )
    })?;

    let profile = parse_profile(&text)?;

    // Hotkeys first: they can fail (e.g. key taken by another app) and are rolled
    // back by apply_hotkeys, in which case nothing has been imported yet.
    apply_hotkeys(
        &app,
        &state,
        &profile.start_stop_hotkey,
        &profile.pick_position_hotkey,
        &profile.toggle_overlay_hotkey,
    )
    .map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::Hotkey,
            "The profile's hotkeys couldn't be applied, so nothing was imported.",
            vec![e],
        )
    })?;

    state.apply_profile(profile.clone());

    // Refresh both overlay windows with the imported values.
    overlay::publish(&app, &state);
    overlay::publish_boundary_state(&app, &state);

    Ok(Some(profile))
}
