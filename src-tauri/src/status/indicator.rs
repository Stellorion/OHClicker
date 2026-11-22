//! Shows the "ACTIVE" indicator while the overlay is visible AND the clicker is running.
//! Runs on its own thread because the clicker can also stop by itself (limit reached,
//! cursor left the region), so there is no single place to hook into.
use super::windows::INDICATOR_LABEL;
use crate::app_state::AppState;
use std::sync::atomic::Ordering;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Manager};

/// Starts the background check (every 100 ms). Called once from startup.rs.
pub fn spawn_indicator_sync(app: AppHandle) {
    thread::spawn(move || {
        let mut shown = false;
        loop {
            thread::sleep(Duration::from_millis(100));
            let state = app.state::<AppState>();
            let wanted = state.overlay_visible.load(Ordering::SeqCst);
            if wanted == shown {
                continue;
            }
            if let Some(window) = app.get_webview_window(INDICATOR_LABEL) {
                let _ = if wanted { window.show() } else { window.hide() };
                shown = wanted;
            }
        }
    });
}
