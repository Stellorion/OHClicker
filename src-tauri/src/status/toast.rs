//! "OHC ENABLED" / "OHC DISABLED" popup near the mouse cursor.
//! The page (frontend components/overlay/StatusToast.tsx) fades itself out; this file
//! decides where the window is, what it says, and hides it afterwards.
use super::windows::TOAST_LABEL;
use crate::app_state::AppState;
use crate::clicker::service;
use enigo::{Enigo, Mouse, Settings};
use std::sync::atomic::{AtomicU64, Ordering};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Manager, PhysicalPosition, WebviewWindow};

/// Counts toasts, so an older toast never hides a newer one.
static TOAST_COUNT: AtomicU64 = AtomicU64::new(0);

/// The page fades out after 1.8 s (see `ohc-toast` in index.css); hide just after.
const VISIBLE_FOR: Duration = Duration::from_millis(1900);

/// Mouse position in desktop pixels (None if it can't be read).
fn cursor_position() -> Option<(i32, i32)> {
    Enigo::new(&Settings::default()).ok()?.location().ok()
}

/// Puts the toast just below-right of the cursor (kept on screen when the cursor
/// is on the selected display).
fn place_near_cursor(window: &WebviewWindow, state: &AppState) {
    let Some((cx, cy)) = cursor_position() else {
        return;
    };
    let display = service::selected_display(&state.clicker);
    let offset = (18.0 * display.scale_factor) as i32;
    let (mut x, mut y) = (cx + offset, cy + offset);

    let right = display.origin_x + display.width as i32;
    let bottom = display.origin_y + display.height as i32;
    let on_display =
        cx >= display.origin_x && cx < right && cy >= display.origin_y && cy < bottom;
    if let (true, Ok(size)) = (on_display, window.outer_size()) {
        x = x.min(right - size.width as i32);
        y = y.min(bottom - size.height as i32);
    }
    let _ = window.set_position(PhysicalPosition::new(x, y));
}

/// Shows the popup: green "OHC ENABLED" when `enabled`, red "OHC DISABLED" otherwise.
/// Called by the start/stop hotkey (clicker/hotkeys/action.rs).
pub fn notify_toggled(app: &AppHandle, enabled: bool) {
    let Some(window) = app.get_webview_window(TOAST_LABEL) else {
        return;
    };
    place_near_cursor(&window, &app.state::<AppState>());
    // Text first, then show. The page restarts its fade animation on every call.
    let _ = window.eval(format!("window.__ohcToast && window.__ohcToast({enabled})"));
    let _ = window.show();

    let count = TOAST_COUNT.fetch_add(1, Ordering::SeqCst) + 1;
    let app = app.clone();
    thread::spawn(move || {
        thread::sleep(VISIBLE_FOR);
        if TOAST_COUNT.load(Ordering::SeqCst) != count {
            return; // a newer toast is showing, it hides itself
        }
        if let Some(window) = app.get_webview_window(TOAST_LABEL) {
            let _ = window.hide();
            let _ = window.eval("window.__ohcToast && window.__ohcToast(null)");
        }
    });
}
