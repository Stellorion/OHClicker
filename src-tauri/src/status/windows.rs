//! Creates the two status windows (hidden at first) and places them.
use crate::app_state::AppState;
use crate::clicker::display::DisplayInfo;
use crate::clicker::overlay::build_overlay;
use crate::clicker::service;
use tauri::{AppHandle, LogicalSize, Manager, PhysicalPosition, WebviewWindow};

pub const INDICATOR_LABEL: &str = "status-indicator";
pub const TOAST_LABEL: &str = "status-toast";

// Logical size (width, height). Windows does not allow undecorated windows to get
// much narrower than this, so the page just fills the window.
const INDICATOR_SIZE: (f64, f64) = (140.0, 30.0);
const TOAST_SIZE: (f64, f64) = (190.0, 38.0);

/// Puts the indicator in the top-right corner of `display` (the user can drag it away).
fn place_in_corner(window: &WebviewWindow, display: &DisplayInfo) -> tauri::Result<()> {
    let scale = display.scale_factor;
    let margin = (16.0 * scale) as i32;
    let width = (INDICATOR_SIZE.0 * scale) as i32;
    let x = display.origin_x + display.width as i32 - width - margin;
    window.set_position(PhysicalPosition::new(x, display.origin_y + margin))
}

/// Creates both windows. Called once from startup.rs.
pub fn create_windows(app: &AppHandle, state: &AppState) -> tauri::Result<()> {
    let display = service::selected_display(&state.clicker);

    // Indicator: takes mouse input (unlike the overlays) so it can be dragged.
    let url = "index.html?status-indicator=1";
    let indicator = build_overlay(app, INDICATOR_LABEL, url, false)?;
    indicator.set_size(LogicalSize::new(INDICATOR_SIZE.0, INDICATOR_SIZE.1))?;
    place_in_corner(&indicator, &display)?;

    // Toast: click-through, it only shows a message.
    let toast = build_overlay(app, TOAST_LABEL, "index.html?status-toast=1", false)?;
    toast.set_size(LogicalSize::new(TOAST_SIZE.0, TOAST_SIZE.1))?;
    toast.set_ignore_cursor_events(true)
}

/// Moves the indicator to the corner of the newly selected display.
pub fn move_indicator_to_display(app: &AppHandle, state: &AppState) {
    if let Some(window) = app.get_webview_window(INDICATOR_LABEL) {
        let _ = place_in_corner(&window, &service::selected_display(&state.clicker));
    }
}
