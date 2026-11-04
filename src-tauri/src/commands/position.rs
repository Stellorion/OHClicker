//! Tauri commands for the click target (frontend: clickerService.ts + ACPositionSection).
use crate::app_state::AppState;
use crate::clicker::overlay;
use crate::clicker::position::{CoordinateType, PositionMode, SequencePoint};
use crate::clicker::service;
use tauri::{AppHandle, State};

/// Cursor / fixed point / sequence.
#[tauri::command]
pub fn update_position_mode(app: AppHandle, state: State<'_, AppState>, mode: PositionMode) {
    service::update_position_mode(&state.clicker, mode);
    overlay::publish(&app, &state);
}

/// Absolute (screen) or relative (to cursor) coordinates.
#[tauri::command]
pub fn update_coordinate_type(
    app: AppHandle,
    state: State<'_, AppState>,
    coordinate_type: CoordinateType,
) {
    service::update_coordinate_type(&state.clicker, coordinate_type);
    overlay::publish(&app, &state);
}

/// Fixed target position.
#[tauri::command]
pub fn update_target_position(app: AppHandle, state: State<'_, AppState>, x: i32, y: i32) {
    service::update_target_position(&state.clicker, x, y);
    overlay::publish(&app, &state);
}

/// Random pixel offset around each target.
#[tauri::command]
pub fn update_position_jitter(app: AppHandle, state: State<'_, AppState>, jitter_px: u32) {
    service::update_position_jitter(&state.clicker, jitter_px);
    overlay::publish(&app, &state);
}

/// Replaces the whole sequence list.
#[tauri::command]
pub fn update_sequence_points(
    app: AppHandle,
    state: State<'_, AppState>,
    points: Vec<SequencePoint>,
) {
    service::update_sequence_points(&state.clicker, points);
    overlay::publish(&app, &state);
}
