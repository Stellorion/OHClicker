mod control;

pub use control::{begin_pick, begin_pick_for, complete_pick, toggle};

use crate::app_state::AppState;
use crate::clicker::display::DisplayInfo;
use crate::clicker::position::{RustPositionMode, RustSequencePoint};
use crate::clicker::service;
use serde::Serialize;
use std::sync::atomic::Ordering;
use tauri::{
    AppHandle, Emitter, Manager, PhysicalPosition, PhysicalSize, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder,
};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OverlayVisualState {
    visible: bool,
    picking: bool,
    pick_point_id: Option<String>,
    display_id: String,
    position_mode: RustPositionMode,
    target_x: i32,
    target_y: i32,
    jitter_px: u32,
    sequence_points: Vec<RustSequencePoint>,
    screen_width: u32,
    screen_height: u32,
    origin_x: i32,
    origin_y: i32,
    scale_factor: f64,
}

pub fn create_window(app: &AppHandle, state: &AppState) -> tauri::Result<()> {
    let display = service::selected_display(&state.clicker);
    let window = WebviewWindowBuilder::new(
        app,
        "position-overlay",
        WebviewUrl::App("index.html?position-overlay=1".into()),
    )
    .transparent(true)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .visible(false)
    .shadow(false)
    .no_redirection_bitmap(true)
    .build()?;
    place_on_display(&window, &display)?;
    window.set_ignore_cursor_events(true)?;
    publish(app, state);
    Ok(())
}

pub fn visual_state(state: &AppState) -> OverlayVisualState {
    let position = &state.clicker.position;
    let display = service::selected_display(&state.clicker);
    OverlayVisualState {
        visible: state.overlay_visible.load(Ordering::SeqCst),
        picking: state.pick_armed.load(Ordering::SeqCst),
        pick_point_id: state.pick_target.lock().unwrap().clone(),
        display_id: display.id.clone(),
        position_mode: *position.mode.lock().unwrap(),
        target_x: position.target_x.load(Ordering::SeqCst),
        target_y: position.target_y.load(Ordering::SeqCst),
        jitter_px: position.jitter_px.load(Ordering::SeqCst),
        sequence_points: position.sequence_points.lock().unwrap().clone(),
        screen_width: display.width,
        screen_height: display.height,
        origin_x: display.origin_x,
        origin_y: display.origin_y,
        scale_factor: display.scale_factor,
    }
}

fn place_on_display(window: &WebviewWindow, display: &DisplayInfo) -> tauri::Result<()> {
    let position = PhysicalPosition::new(display.origin_x, display.origin_y);
    let size = PhysicalSize::new(display.width, display.height);
    window.set_position(position)?;
    window.set_size(size)?;
    window.set_position(position)?;
    window.set_size(size)
}

pub fn move_to_selected_display(app: &AppHandle, state: &AppState) -> Result<(), String> {
    let window = app
        .get_webview_window("position-overlay")
        .ok_or_else(|| "Position overlay is unavailable".to_string())?;
    let display = service::selected_display(&state.clicker);
    place_on_display(&window, &display)
        .map_err(|error| format!("Unable to place overlay on selected display: {error}"))
}

pub fn publish(app: &AppHandle, state: &AppState) {
    if let Some(window) = app.get_webview_window("position-overlay") {
        let _ = window.emit("overlay-state", visual_state(state));
    }
}