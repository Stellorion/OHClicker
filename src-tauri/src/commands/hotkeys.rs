//! Tauri commands for changing a single hotkey (frontend: clickerService.update*Hotkey).
use crate::app_state::AppState;
use crate::clicker::hotkeys::apply_hotkeys;
use tauri::{AppHandle, State};

/// The hotkeys currently registered (start/stop, toggle overlay).
fn current(state: &AppState) -> (String, String) {
    (
        state.start_stop_hotkey.lock().unwrap().clone(),
        state.toggle_overlay_hotkey.lock().unwrap().clone(),
    )
}

/// Changes the start/stop hotkey.
#[tauri::command]
pub fn update_start_stop_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    let (_, overlay) = current(&state);
    apply_hotkeys(&app, &state, &hotkey, &overlay)
}

/// Changes the "toggle overlay" hotkey.
#[tauri::command]
pub fn update_toggle_overlay_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    let (start, _) = current(&state);
    apply_hotkeys(&app, &state, &start, &hotkey)
}
