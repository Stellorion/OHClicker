//! Main window helpers for the tray: show it again, and handle the close button.
use crate::app_state::AppState;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Manager, Window, WindowEvent};

/// Brings the main window back (also when it is hidden or minimized).
pub fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

/// Shows or hides the main window without taking focus. Used once at start-up
/// (hidden when the app was started by the OS at login and the tray option is on).
pub fn set_main_window_visible(app: &AppHandle, visible: bool) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = if visible { window.show() } else { window.hide() };
    }
}

/// Close button of the main window:
///   option on  -> hide to the tray, the app (and its hotkeys) keep running
///   option off -> quit completely
pub fn handle_window_event(window: &Window, event: &WindowEvent) {
    if window.label() != "main" {
        return;
    }
    if let WindowEvent::CloseRequested { api, .. } = event {
        let app = window.app_handle();
        if app.state::<AppState>().keep_in_tray.load(Ordering::SeqCst) {
            api.prevent_close();
            let _ = window.hide();
        } else {
            // Force exit so global hotkeys and background workers are released.
            app.exit(0);
        }
    }
}
