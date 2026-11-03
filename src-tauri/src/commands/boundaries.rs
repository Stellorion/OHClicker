use crate::app_state::AppState;
use crate::clicker::service;
use crate::clicker::state::RustRegionMode;
use tauri::{AppHandle, WebviewWindow};

#[tauri::command]
pub fn set_boundaries_enabled(_app: AppHandle, state: tauri::State<'_, AppState>, enabled: bool) {
    service::set_boundaries_enabled(&state.clicker, enabled);
}

#[tauri::command]
pub fn set_region_mode(_app: AppHandle, state: tauri::State<'_, AppState>, mode: RustRegionMode) {
    service::set_region_mode(&state.clicker, mode);
}

#[tauri::command]
pub fn update_boundary_rect(
    _app: AppHandle,
    state: tauri::State<AppState>,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) {
    service::update_boundary_rect(&state.clicker, x, y, width, height);
}

#[tauri::command]
pub fn set_stop_when_cursor_leaves(
    _app: AppHandle,
    state: tauri::State<'_, AppState>,
    enabled: bool,
) {
    service::set_stop_when_cursor_leaves(&state.clicker, enabled);
}

/// Bounds of the window that currently has focus (not this app's own window).
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
pub fn get_active_window_bounds(window: WebviewWindow) -> Result<(i32, i32, u32, u32), String> {
    let (x, y, w, h) = get_active_window_rect(&window)?;
    Ok((x, y, w, h))
}

fn get_active_window_rect(window: &WebviewWindow) -> Result<(i32, i32, u32, u32), String> {
    use windows::Win32::Foundation::{RECT};
    use windows::Win32::UI::WindowsAndMessaging::GetWindowRect;

    let hwnd = window.hwnd().map_err(|e| format!("Failed to get window handle: {}", e))?;
    
    let mut rect = unsafe { std::mem::zeroed::<RECT>() };
    if unsafe { GetWindowRect(hwnd, &mut rect) }.is_err() {
        return Err("Failed to retrieve window rectangle".to_string());
    }

    Ok((
        rect.left,
        rect.top,
        (rect.right - rect.left) as u32,
        (rect.bottom - rect.top) as u32,
    ))
}