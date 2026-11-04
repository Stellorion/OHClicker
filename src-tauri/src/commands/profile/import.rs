//! "Import": load a profile file once (does not remember it, see link.rs for that).
use super::pick_profile_path;
use crate::app_state::AppState;
use crate::clicker::profile::{apply_profile_to_app, ensure_stopped, read_profile_file};
use crate::clicker::profile::{ConfigProfile, ProfileError};
use tauri::{AppHandle, State};

/// Returns the applied profile, or Ok(None) when the user cancelled.
/// The file is fully validated before anything changes, so a bad file never
/// leaves the app half-imported.
#[tauri::command]
pub async fn import_profile(
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<Option<ConfigProfile>, ProfileError> {
    ensure_stopped(&state)?;
    let Some(path) = pick_profile_path(&app)? else {
        return Ok(None);
    };
    let profile = read_profile_file(&path)?;
    apply_profile_to_app(&app, &state, &profile)?;
    Ok(Some(profile))
}
