use crate::app_state::AppState;
use crate::clicker::overlay::{boundary_visual_state, publish_boundary_state};
use crate::clicker::service;
use crate::clicker::state::RustRegionMode;
use tauri::AppHandle;

#[tauri::command]
pub fn set_boundaries_enabled(app: AppHandle, state: tauri::State<'_, AppState>, enabled: bool) {
    service::set_boundaries_enabled(&state.clicker, enabled);
    publish_boundary_state(&app, &state);
}

#[tauri::command]
pub fn set_region_mode(app: AppHandle, state: tauri::State<'_, AppState>, mode: RustRegionMode) {
    service::set_region_mode(&state.clicker, mode);
    publish_boundary_state(&app, &state);
}

#[tauri::command]
pub fn update_boundary_rect(
    app: AppHandle,
    state: tauri::State<AppState>,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) {
    service::update_boundary_rect(&state.clicker, x, y, width, height);
    publish_boundary_state(&app, &state);
}

#[tauri::command]
pub fn set_stop_when_cursor_leaves(app: AppHandle, state: tauri::State<AppState>, enabled: bool) {
    service::set_stop_when_cursor_leaves(&state.clicker, enabled);
    publish_boundary_state(&app, &state);
}

pub(crate) fn foreground_window_rect() -> Result<(i32, i32, u32, u32), String> {
    use windows::Win32::Foundation::{HWND, RECT};
    use windows::Win32::UI::WindowsAndMessaging::{GetForegroundWindow, GetWindowRect};

    let hwnd = unsafe { GetForegroundWindow() };
    if hwnd == HWND::default() {
        return Err("No foreground window".to_string());
    }
    let mut rect = RECT::default();
    if unsafe { GetWindowRect(hwnd, &mut rect) }.is_err() {
        return Err("Failed to retrieve window rectangle".to_string());
    }
    Ok((
        rect.left,
        rect.top,
        (rect.right - rect.left).max(0) as u32,
        (rect.bottom - rect.top).max(0) as u32,
    ))
}

#[tauri::command]
pub fn get_boundary_overlay_state(
    state: tauri::State<'_, AppState>,
) -> crate::clicker::overlay::BoundaryVisualState {
    boundary_visual_state(&state)
}
