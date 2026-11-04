use crate::app_state::AppState;
use crate::clicker::display::DisplayInfo;
use crate::clicker::overlay;
use crate::clicker::position::{
    RustCoordinateType, RustPositionMode, RustSequencePoint, ScreenSize,
};
use crate::clicker::service;
use tauri::{AppHandle, Manager, WebviewWindow};

#[tauri::command]
pub fn update_position_mode(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    mode: RustPositionMode,
) {
    service::update_position_mode(&state.clicker, mode);
    overlay::publish(&app, &state);
}

#[tauri::command]
pub fn update_coordinate_type(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    coordinate_type: RustCoordinateType,
) {
    service::update_coordinate_type(&state.clicker, coordinate_type);
    overlay::publish(&app, &state);
}

#[tauri::command]
pub fn update_target_position(app: AppHandle, state: tauri::State<'_, AppState>, x: i32, y: i32) {
    service::update_target_position(&state.clicker, x, y);
    overlay::publish(&app, &state);
}

#[tauri::command]
pub fn get_displays(window: WebviewWindow) -> Result<Vec<DisplayInfo>, String> {
    service::available_displays(&window)
}

#[tauri::command]
pub fn select_display(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    display_id: String,
) -> Result<(), String> {
    let main = app
        .get_webview_window("main")
        .ok_or_else(|| "Main window is unavailable".to_string())?;
    let display = service::available_displays(&main)?
        .into_iter()
        .find(|display| display.id == display_id)
        .ok_or_else(|| "Selected display is no longer connected".to_string())?;
    service::update_selected_display(&state.clicker, display);
    overlay::move_to_selected_display(&app, &state)?;
    overlay::update_boundary_window_position(&app, &state)?;
    overlay::publish(&app, &state);
    overlay::publish_boundary_state(&app, &state);
    Ok(())
}

#[tauri::command]
pub fn update_position_jitter(app: AppHandle, state: tauri::State<'_, AppState>, jitter_px: u32) {
    service::update_position_jitter(&state.clicker, jitter_px);
    overlay::publish(&app, &state);
}

#[tauri::command]
pub fn update_sequence_points(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    points: Vec<RustSequencePoint>,
) {
    service::update_sequence_points(&state.clicker, points);
    overlay::publish(&app, &state);
}

#[tauri::command]
pub fn begin_position_pick(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    point_id: Option<String>,
) -> Result<(), String> {
    overlay::begin_pick_for(&app, &state, point_id)
}

#[tauri::command]
pub fn complete_position_pick(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    x: i32,
    y: i32,
) -> Result<(), String> {
    overlay::complete_pick(&app, &state, x, y)
}

#[tauri::command]
pub fn toggle_position_overlay(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<bool, String> {
    overlay::toggle(&app, &state)
}

#[tauri::command]
pub fn get_position_overlay_state(
    state: tauri::State<'_, AppState>,
) -> overlay::OverlayVisualState {
    overlay::visual_state(&state)
}

#[tauri::command]
pub fn get_screen_size(state: tauri::State<'_, AppState>) -> ScreenSize {
    service::screen_size(&state.clicker)
}
