//! Linked profile: a file that is loaded automatically every time the app starts.
//! Frontend: services/clickerService.ts + components/autoclicker/options/ACLinkedProfileRow.tsx
use super::pick_profile_path;
use crate::app_state::AppState;
use crate::clicker::profile::{ConfigProfile, LinkedProfile, ProfileError, reveal_in_file_manager};
use crate::clicker::profile::{ensure_stopped, link_profile_file, unlink_profile_file};
use std::path::Path;
use tauri::{AppHandle, State};

/// Asks for a file, applies it and remembers it. Ok(None) = user cancelled.
#[tauri::command]
pub async fn link_profile(
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<Option<ConfigProfile>, ProfileError> {
    ensure_stopped(&state)?;
    let Some(path) = pick_profile_path(&app)? else {
        return Ok(None);
    };
    link_profile_file(&app, &state, path).map(Some)
}

/// Forgets the linked file (the file itself stays on disk).
#[tauri::command]
pub fn unlink_profile(state: State<'_, AppState>, app: AppHandle) -> Result<(), ProfileError> {
    unlink_profile_file(&app, &state)
}

/// Current link info; the frontend calls this once on startup.
#[tauri::command]
pub fn get_linked_profile(state: State<'_, AppState>) -> LinkedProfile {
    state.linked_profile.lock().unwrap().clone()
}

/// Opens the file manager with the linked file selected.
#[tauri::command]
pub fn reveal_linked_profile(state: State<'_, AppState>) -> Result<(), String> {
    let path = state.linked_profile.lock().unwrap().path.clone();
    let path = path.ok_or_else(|| "No profile is linked.".to_string())?;
    reveal_in_file_manager(Path::new(&path))
}
