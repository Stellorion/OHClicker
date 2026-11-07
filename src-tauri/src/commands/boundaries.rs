//! Tauri commands for the Boundaries section (frontend: clickerService.ts and
//! components/autoclicker/ACBoundariesSection.tsx).
use crate::app_state::AppState;
use crate::clicker::os_windows::{self, WindowInfo};
use crate::clicker::overlay::{
    BoundaryOverlayState, boundary_overlay_state, publish_boundary_state,
};
use crate::clicker::service;
use crate::clicker::state::RegionMode;
use tauri::{AppHandle, State};

/// Turns the click region on/off.
#[tauri::command]
pub fn set_boundaries_enabled(app: AppHandle, state: State<'_, AppState>, enabled: bool) {
    service::set_boundaries_enabled(&state.clicker, enabled);
    publish_boundary_state(&app, &state);
}

/// Fullscreen / choose window / custom rectangle.
#[tauri::command]
pub fn set_region_mode(app: AppHandle, state: State<'_, AppState>, mode: RegionMode) {
    service::set_region_mode(&state.clicker, mode);
    publish_boundary_state(&app, &state);
}

/// Custom rectangle (relative to the selected display).
#[tauri::command]
pub fn update_boundary_rect(
    app: AppHandle,
    state: State<'_, AppState>,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) {
    service::update_boundary_rect(&state.clicker, x, y, width, height);
    publish_boundary_state(&app, &state);
}

/// Stop the clicker when the cursor leaves the region (instead of pausing).
#[tauri::command]
pub fn set_stop_when_cursor_leaves(app: AppHandle, state: State<'_, AppState>, enabled: bool) {
    service::set_stop_when_cursor_leaves(&state.clicker, enabled);
    publish_boundary_state(&app, &state);
}

/// Current rectangle the boundary overlay should draw.
#[tauri::command]
pub fn get_boundary_overlay_state(state: State<'_, AppState>) -> BoundaryOverlayState {
    boundary_overlay_state(&state)
}

/// Open windows the user can choose from (Boundaries -> "Choose window").
#[tauri::command]
pub fn list_windows() -> Vec<WindowInfo> {
    os_windows::list_windows()
}

/// Chooses the window the region follows. `id` is its handle from `list_windows`.
#[tauri::command]
pub fn set_boundary_window(app: AppHandle, state: State<'_, AppState>, id: i64, title: String) {
    service::set_boundary_window(&state.clicker, id, title);
    publish_boundary_state(&app, &state);
}
