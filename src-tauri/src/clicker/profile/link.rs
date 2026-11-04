//! Link / unlink a profile file and load it automatically on startup.
//! The path is stored in `settings.json` (see app_settings.rs).
use super::{apply_profile_to_app, read_profile_file, ConfigProfile, LinkedProfile};
use super::{ProfileError, ProfileErrorKind};
use crate::app_settings;
use crate::app_state::AppState;
use std::path::{Path, PathBuf};
use tauri::AppHandle;

/// Reads + applies the file and describes the outcome for the UI.
fn load_linked(app: &AppHandle, state: &AppState, path: &Path) -> LinkedProfile {
    if !path.exists() {
        return LinkedProfile::missing(path);
    }
    let loaded = read_profile_file(path).and_then(|profile| {
        apply_profile_to_app(app, state, &profile)?;
        Ok(profile)
    });
    match loaded {
        Ok(profile) => LinkedProfile::loaded(path, profile),
        Err(error) => LinkedProfile::invalid(path, error),
    }
}

/// Called once from `lib.rs` setup: loads the remembered file, if any.
pub fn load_on_startup(app: &AppHandle, state: &AppState) {
    let Some(path) = app_settings::load(app).linked_profile_path else {
        return;
    };
    let linked = load_linked(app, state, Path::new(&path));
    *state.linked_profile.lock().unwrap() = linked;
}

/// Stores (or clears) the linked path on disk.
fn remember(app: &AppHandle, path: Option<String>) -> Result<(), ProfileError> {
    let mut settings = app_settings::load(app);
    settings.linked_profile_path = path;
    app_settings::save(app, &settings).map_err(|e| {
        let message = "Couldn't remember the linked file.";
        ProfileError::new(ProfileErrorKind::Write, message, vec![e])
    })
}

/// Validates + applies `path`, then remembers it for the next start.
pub fn link_profile_file(
    app: &AppHandle,
    state: &AppState,
    path: PathBuf,
) -> Result<ConfigProfile, ProfileError> {
    let profile = read_profile_file(&path)?;
    apply_profile_to_app(app, state, &profile)?;
    remember(app, Some(path.to_string_lossy().into_owned()))?;
    *state.linked_profile.lock().unwrap() = LinkedProfile::loaded(&path, profile.clone());
    Ok(profile)
}

/// Forgets the link (the file itself is not touched).
pub fn unlink_profile_file(app: &AppHandle, state: &AppState) -> Result<(), ProfileError> {
    remember(app, None)?;
    *state.linked_profile.lock().unwrap() = LinkedProfile::unlinked();
    Ok(())
}
