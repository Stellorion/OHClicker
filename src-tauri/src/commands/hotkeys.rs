//! Tauri commands for changing a single hotkey (frontend: clickerService.update*Hotkey).
use crate::app_state::AppState;
use crate::clicker::hotkeys::apply_hotkeys;
use tauri::{AppHandle, State};

/// The three hotkeys currently registered (start/stop, pick, overlay).
fn current(state: &AppState) -> (String, String, String) {
    (
        state.start_stop_hotkey.lock().unwrap().clone(),
        state.pick_position_hotkey.lock().unwrap().clone(),
        state.toggle_overlay_hotkey.lock().unwrap().clone(),
    )
}

/// Changes the start/stop hotkey.
#[tauri::command]
pub fn update_start_stop_hotkey(app: AppHandle, state: State<'_, AppState>, hotkey: String) -> Result<(), String> {
    let (_, pick, overlay) = current(&state);
    apply_hotkeys(&app, &state, &hotkey, &pick, &overlay)
}

/// Changes the "pick position" hotkey.
#[tauri::command]
pub fn update_pick_position_hotkey(app: AppHandle, state: State<'_, AppState>, hotkey: String) -> Result<(), String> {
    let (start, _, overlay) = current(&state);
    apply_hotkeys(&app, &state, &start, &hotkey, &overlay)
}

/// Changes the "toggle overlay" hotkey.
#[tauri::command]
pub fn update_toggle_overlay_hotkey(app: AppHandle, state: State<'_, AppState>, hotkey: String) -> Result<(), String> {
    let (start, pick, _) = current(&state);
    apply_hotkeys(&app, &state, &start, &pick, &hotkey)
}
