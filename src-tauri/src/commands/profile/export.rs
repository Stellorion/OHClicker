//! "Export": save the current settings to a .json file.
use crate::app_state::AppState;
use crate::clicker::profile::{ProfileError, ProfileErrorKind};
use tauri::{AppHandle, State};
use tauri_plugin_dialog::DialogExt;

fn write_error(message: &str, detail: String) -> ProfileError {
    ProfileError::new(ProfileErrorKind::Write, message, vec![detail])
}

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

    let mut path = file
        .into_path()
        .map_err(|e| write_error("The selected location can't be used.", e.to_string()))?;
    if path.extension().is_none() {
        path.set_extension("json");
    }

    let json = serde_json::to_string_pretty(&state.to_profile())
        .map_err(|e| write_error("Couldn't serialize the profile.", e.to_string()))?;
    std::fs::write(&path, json).map_err(|e| {
        write_error(
            "Couldn't write the profile file.",
            format!("{}: {e}", path.display()),
        )
    })?;
    Ok(true)
}
