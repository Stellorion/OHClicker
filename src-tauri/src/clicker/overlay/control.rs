use super::publish;
use crate::app_state::AppState;
use crate::clicker::service;
use serde::Serialize;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct PickedPoint {
    x: i32,
    y: i32,
    point_id: Option<String>,
}

pub fn begin_pick(app: &AppHandle, state: &AppState) -> Result<(), String> {
    begin_pick_for(app, state, None)
}

pub fn begin_pick_for(
    app: &AppHandle,
    state: &AppState,
    point_id: Option<String>,
) -> Result<(), String> {
    let window = app
        .get_webview_window("position-overlay")
        .ok_or_else(|| "Position overlay is unavailable".to_string())?;
    *state.pick_target.lock().unwrap() = point_id.clone();
    state.pick_armed.store(true, Ordering::SeqCst);
    window
        .set_focusable(true)
        .and_then(|_| window.set_ignore_cursor_events(false))
        .and_then(|_| window.show())
        .and_then(|_| window.set_focus())
        .map_err(|error| format!("Unable to arm position picker: {error}"))?;
    let _ = app.emit("position-pick-armed", point_id);
    publish(app, state);
    Ok(())
}

pub fn toggle(app: &AppHandle, state: &AppState) -> Result<bool, String> {
    let visible = !state.overlay_visible.fetch_xor(true, Ordering::SeqCst);
    let window = app
        .get_webview_window("position-overlay")
        .ok_or_else(|| "Position overlay is unavailable".to_string())?;
    if visible {
        let ignore_events = !state.pick_armed.load(Ordering::SeqCst);
        window
            .set_ignore_cursor_events(ignore_events)
            .and_then(|_| window.show())
            .map_err(|error| format!("Unable to show position overlay: {error}"))?;
    } else {
        let cancelled = state.pick_armed.swap(false, Ordering::SeqCst);
        *state.pick_target.lock().unwrap() = None;
        window
            .set_ignore_cursor_events(true)
            .and_then(|_| window.hide())
            .map_err(|error| format!("Unable to hide position overlay: {error}"))?;
        if cancelled {
            let _ = app.emit("position-pick-cancelled", true);
        }
    }
    publish(app, state);
    Ok(visible)
}

pub fn complete_pick(app: &AppHandle, state: &AppState, x: i32, y: i32) -> Result<(), String> {
    if !state.pick_armed.swap(false, Ordering::SeqCst) {
        return Err("Position picker is not armed".to_string());
    }
    let point_id = state.pick_target.lock().unwrap().take();
    if point_id.is_none() {
        service::update_position_mode(&state.clicker, crate::clicker::position::RustPositionMode::Fixed);
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
        window.show().map_err(|error| format!("Unable to show overlay: {error}"))?;
    } else {
        window.hide().map_err(|error| format!("Unable to hide overlay: {error}"))?;
    }
    let picked = PickedPoint { x: local_x, y: local_y, point_id };
    let _ = app.emit("position-picked", picked);
    publish(app, state);
    Ok(())
}