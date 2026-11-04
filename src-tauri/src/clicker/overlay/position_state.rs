//! Data for the position overlay. Frontend mirror: `PositionOverlayState` in
//! frontend-src/types/overlay-types.ts. Event: `overlay-state`.
use crate::app_state::AppState;
use crate::clicker::position::{PositionMode, SequencePoint};
use crate::clicker::service;
use serde::Serialize;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PositionOverlayState {
    visible: bool,
    picking: bool,
    pick_point_id: Option<String>,
    display_id: String,
    position_mode: PositionMode,
    target_x: i32,
    target_y: i32,
    jitter_px: u32,
    sequence_points: Vec<SequencePoint>,
    screen_width: u32,
    screen_height: u32,
    origin_x: i32,
    origin_y: i32,
    scale_factor: f64,
}

/// Collects everything the position overlay needs to draw.
pub fn position_overlay_state(state: &AppState) -> PositionOverlayState {
    let position = &state.clicker.position;
    let display = service::selected_display(&state.clicker);
    PositionOverlayState {
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

/// Pushes the latest state to the position overlay window.
pub fn publish(app: &AppHandle, state: &AppState) {
    if let Some(window) = app.get_webview_window("position-overlay") {
        let _ = window.emit("overlay-state", position_overlay_state(state));
    }
}
