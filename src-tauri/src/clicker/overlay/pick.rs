//! Finishing a pick: the user clicked a spot on the armed position overlay.
use super::publish;
use crate::app_state::AppState;
use crate::clicker::position::PositionMode;
use crate::clicker::service;
use serde::Serialize;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Emitter, Manager};

/// Payload of the `position-picked` event (frontend: hooks/ac/useBackendEvents.ts).
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct PickedPoint {
    x: i32,
    y: i32,
    point_id: Option<String>,
}

/// Stores the picked position (clamped to the display), hides the picker and
/// tells the frontend. Without a `point_id` the fixed target is updated.
pub fn complete_pick(app: &AppHandle, state: &AppState, x: i32, y: i32) -> Result<(), String> {
    if !state.pick_armed.swap(false, Ordering::SeqCst) {
        return Err("Position picker is not armed".to_string());
    }
    let point_id = state.pick_target.lock().unwrap().take();
    if point_id.is_none() {
        service::update_position_mode(
            &state.clicker,
            PositionMode::Fixed,
        );
    }
    let display = service::selected_display(&state.clicker);
    let local_x = x.clamp(0, display.width.saturating_sub(1) as i32);
    let local_y = y.clamp(0, display.height.saturating_sub(1) as i32);
    if point_id.is_none() {
        service::update_target_position(&state.clicker, local_x, local_y);
    }
    let window = app
        .get_webview_window("position-overlay")
        .ok_or_else(|| "Position overlay is unavailable".to_string())?;
    window
        .set_ignore_cursor_events(true)
        .map_err(|error| format!("Unable to finish position pick: {error}"))?;
    if state.overlay_visible.load(Ordering::SeqCst) {
        window
            .show()
            .map_err(|error| format!("Unable to show overlay: {error}"))?;
    } else {
        window
            .hide()
            .map_err(|error| format!("Unable to hide overlay: {error}"))?;
    }
    let picked = PickedPoint {
        x: local_x,
        y: local_y,
        point_id,
    };
    let _ = app.emit("position-picked", picked);
    publish(app, state);
    Ok(())
}
