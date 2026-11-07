//! Keeps the boundary overlay directly above the chosen window (Choose window mode),
//! so windows that cover the chosen window also cover the overlay.
//! Runs on its own thread because the user can reorder windows at any time.
use crate::app_state::AppState;
use crate::clicker::os_windows;
use crate::clicker::state::RegionMode;
use std::sync::atomic::Ordering;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Manager, WebviewWindow};

/// Window handle of the overlay (Windows only).
#[cfg(target_os = "windows")]
fn overlay_handle(window: &WebviewWindow) -> Option<i64> {
    window.hwnd().ok().map(|hwnd| hwnd.0 as i64)
}

#[cfg(not(target_os = "windows"))]
fn overlay_handle(_window: &WebviewWindow) -> Option<i64> {
    None
}

/// One check: only does something while the overlay is shown in Choose window mode.
fn sync_once(app: &AppHandle) {
    let state = app.state::<AppState>();
    let clicker = &state.clicker;
    let active = clicker.boundaries_enabled.load(Ordering::SeqCst)
        && state.overlay_visible.load(Ordering::SeqCst)
        && *clicker.region_mode.lock().unwrap() == RegionMode::ChooseWindow;
    if !active {
        return;
    }
    let Some(chosen) = clicker.boundary_window.handle() else {
        return;
    };
    let Some(window) = app.get_webview_window("boundary-overlay") else {
        return;
    };
    if let Some(overlay) = overlay_handle(&window) {
        os_windows::place_directly_above(overlay, chosen);
    }
}

/// Starts the background check (every 50 ms). Called once from startup.rs.
pub fn spawn_z_order_sync(app: AppHandle) {
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(50));
        sync_once(&app);
    });
}