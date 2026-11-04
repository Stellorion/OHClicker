//! Data for the boundary overlay. Frontend mirror: `BoundaryOverlayState` in
//! frontend-src/types/overlay-types.ts. Event: `boundary-state`.
use super::windows::place_on_display;
use crate::app_state::AppState;
use crate::clicker::service;
use crate::clicker::state::RegionMode;
use crate::clicker::window_rect::foreground_window_rect;
use serde::Serialize;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Emitter, Manager};

/// Rectangle is in physical pixels, relative to the top-left of the selected display
/// (the same space the boundary overlay window covers).
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BoundaryOverlayState {
    visible: bool,
    region_mode: RegionMode,
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    screen_width: u32,
    screen_height: u32,
}

/// Works out which rectangle to draw for the current region mode.
pub fn boundary_overlay_state(state: &AppState) -> BoundaryOverlayState {
    let clicker = &state.clicker;
    let display = service::selected_display(clicker);
    let mode = *clicker.region_mode.lock().unwrap();
    let enabled = clicker.boundaries_enabled.load(Ordering::SeqCst);

    let rect = match mode {
        RegionMode::Fullscreen => Some((0, 0, display.width as i32, display.height as i32)),
        RegionMode::Custom => Some((
            clicker.boundary_x.load(Ordering::SeqCst),
            clicker.boundary_y.load(Ordering::SeqCst),
            clicker.boundary_width.load(Ordering::SeqCst) as i32,
            clicker.boundary_height.load(Ordering::SeqCst) as i32,
        )),
        RegionMode::ActiveWindow => foreground_window_rect().ok().map(|(x, y, w, h)| {
            (
                x - display.origin_x,
                y - display.origin_y,
                w as i32,
                h as i32,
            )
        }),
    };
    let (x, y, width, height) = rect.unwrap_or((0, 0, 0, 0));

    BoundaryOverlayState {
        visible: state.overlay_visible.load(Ordering::SeqCst) && enabled,
        region_mode: mode,
        x,
        y,
        width,
        height,
        screen_width: display.width,
        screen_height: display.height,
    }
}

/// Moves the boundary overlay onto the currently selected display.
pub fn update_boundary_window_position(app: &AppHandle, state: &AppState) -> Result<(), String> {
    let window = app
        .get_webview_window("boundary-overlay")
        .ok_or_else(|| "Boundary overlay is unavailable".to_string())?;
    let display = service::selected_display(&state.clicker);
    place_on_display(&window, &display)
        .map_err(|error| format!("Unable to place boundary overlay on selected display: {error}"))
}

/// Shows/hides the boundary overlay and pushes new state to it.
pub fn publish_boundary_state(app: &AppHandle, state: &AppState) {
    if let Some(window) = app.get_webview_window("boundary-overlay") {
        let visual = boundary_overlay_state(state);
        let _ = if visual.visible {
            window.show()
        } else {
            window.hide()
        };
        let _ = window.emit("boundary-state", visual);
    }
}
