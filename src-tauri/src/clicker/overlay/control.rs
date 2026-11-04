//! Showing/hiding the position overlay and arming the position picker.
use super::{publish, publish_boundary_state};
use crate::app_state::AppState;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Emitter, Manager};

/// Arms the picker for the fixed target (hotkey F7 by default).
pub fn begin_pick(app: &AppHandle, state: &AppState) -> Result<(), String> {
    begin_pick_for(app, state, None)
}

/// Arms the picker; `point_id` = sequence point to move (None = fixed target).
/// The overlay becomes clickable until a position is chosen.
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

/// Shows/hides the overlay (hotkey F8 by default). Returns the new visibility.
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
    publish_boundary_state(app, state);
    Ok(visible)
}
