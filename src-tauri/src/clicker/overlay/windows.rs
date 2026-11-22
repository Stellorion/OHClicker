//! Creates the overlay windows and keeps them on the selected display.
use super::{publish, publish_boundary_state};
use crate::app_state::AppState;
use crate::clicker::display::DisplayInfo;
use crate::clicker::service;
use tauri::{
    AppHandle, Manager, PhysicalPosition, PhysicalSize, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder,
};

/// Builds one overlay: transparent, borderless, always on top, hidden at first.
/// `focusable = false` keeps the window from ever stealing keyboard focus.
pub(crate) fn build_overlay(
    app: &AppHandle,
    label: &str,
    url: &str,
    focusable: bool,
) -> tauri::Result<WebviewWindow> {
    WebviewWindowBuilder::new(app, label, WebviewUrl::App(url.into()))
        .focused(focusable)
        .focusable(focusable)
        .transparent(true)
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .visible(false)
        .shadow(false)
        .no_redirection_bitmap(true)
        .build()
}

/// Moves/resizes `window` so it exactly covers `display`.
/// (Done twice: Windows may re-scale after the first move on mixed-DPI setups.)
pub(super) fn place_on_display(window: &WebviewWindow, display: &DisplayInfo) -> tauri::Result<()> {
    let position = PhysicalPosition::new(display.origin_x, display.origin_y);
    let size = PhysicalSize::new(display.width, display.height);
    window.set_position(position)?;
    window.set_size(size)?;
    window.set_position(position)?;
    window.set_size(size)
}

/// Position overlay (label `position-overlay`). Becomes focusable only while picking.
pub fn create_window(app: &AppHandle, state: &AppState) -> tauri::Result<()> {
    let display = service::selected_display(&state.clicker);
    let url = "index.html?position-overlay=1";
    let window = build_overlay(app, "position-overlay", url, true)?;
    place_on_display(&window, &display)?;
    window.set_ignore_cursor_events(true)?;
    publish(app, state);
    Ok(())
}

/// Boundary overlay (label `boundary-overlay`). Never takes focus.
pub fn create_boundary_window(app: &AppHandle, state: &AppState) -> tauri::Result<()> {
    let display = service::selected_display(&state.clicker);
    let url = "index.html?boundary-overlay=1";
    let window = build_overlay(app, "boundary-overlay", url, false)?;
    place_on_display(&window, &display)?;
    window.set_ignore_cursor_events(true)?;
    publish_boundary_state(app, state);
    Ok(())
}

/// Moves the position overlay onto the currently selected display.
pub fn move_to_selected_display(app: &AppHandle, state: &AppState) -> Result<(), String> {
    let window = app
        .get_webview_window("position-overlay")
        .ok_or_else(|| "Position overlay is unavailable".to_string())?;
    let display = service::selected_display(&state.clicker);
    place_on_display(&window, &display)
        .map_err(|error| format!("Unable to place overlay on selected display: {error}"))
}
