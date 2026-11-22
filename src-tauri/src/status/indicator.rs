//! Shows the status indicator while the overlay is visible, and tells it whether the
//! clicker is running ("ACTIVE") or not ("IDLE").
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
        // The running state the page was told last (None = it must be told again).
        let mut last_sent: Option<bool> = None;
        loop {
            thread::sleep(Duration::from_millis(100));
            let state = app.state::<AppState>();
            let overlay = state.overlay_visible.load(Ordering::SeqCst);
            let running = state.clicker.is_running.load(Ordering::SeqCst);
            let Some(window) = app.get_webview_window(INDICATOR_LABEL) else {
                continue;
            };

            if overlay != shown {
                let _ = if overlay { window.show() } else { window.hide() };
                shown = overlay;
                last_sent = None; // a window that was hidden may have missed changes
            }
            if shown && last_sent != Some(running) {
                // Page: components/overlay/StatusIndicator.tsx
                let js = format!("window.__ohcIndicator && window.__ohcIndicator({running})");
                let _ = window.eval(js);
                last_sent = Some(running);
            }
        }
    });
}
