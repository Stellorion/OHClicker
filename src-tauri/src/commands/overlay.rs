//! Tauri commands for the position overlay / picker (frontend: PositionOverlay.tsx,
//! hooks/usePickState.ts).
use crate::app_state::AppState;
use crate::clicker::overlay::{self, PositionOverlayState};
use tauri::{AppHandle, State};

/// Arms the picker; the next click on the overlay becomes the target.
#[tauri::command]
pub fn begin_position_pick(app: AppHandle, state: State<'_, AppState>, point_id: Option<String>) -> Result<(), String> {
    overlay::begin_pick_for(&app, &state, point_id)
}

/// Called by the overlay when the user clicked a position.
#[tauri::command]
pub fn complete_position_pick(app: AppHandle, state: State<'_, AppState>, x: i32, y: i32) -> Result<(), String> {
    overlay::complete_pick(&app, &state, x, y)
}

/// Shows/hides the overlay. Returns the new visibility.
#[tauri::command]
pub fn toggle_position_overlay(app: AppHandle, state: State<'_, AppState>) -> Result<bool, String> {
    overlay::toggle(&app, &state)
}

/// Current overlay data (the overlay also gets pushed updates).
#[tauri::command]
pub fn get_position_overlay_state(state: State<'_, AppState>) -> PositionOverlayState {
    overlay::position_overlay_state(&state)
}
