//! Target position, jitter, sequence points and the selected display.
use crate::clicker::display::DisplayInfo;
use crate::clicker::position::{CoordinateType, PositionMode, ScreenSize, SequencePoint};
use crate::clicker::state::AutoClickerState;
use std::sync::atomic::Ordering;
use tauri::WebviewWindow;

pub fn update_position_mode(state: &AutoClickerState, value: PositionMode) {
    *state.position.mode.lock().unwrap() = value;
}

pub fn update_coordinate_type(state: &AutoClickerState, value: CoordinateType) {
    *state.position.coordinate_type.lock().unwrap() = value;
}

/// Fixed target, in coordinates relative to the selected display.
pub fn update_target_position(state: &AutoClickerState, x: i32, y: i32) {
    state.position.target_x.store(x, Ordering::SeqCst);
    state.position.target_y.store(y, Ordering::SeqCst);
}

pub fn update_position_jitter(state: &AutoClickerState, value: u32) {
    state.position.jitter_px.store(value, Ordering::SeqCst);
}

pub fn update_sequence_points(state: &AutoClickerState, points: Vec<SequencePoint>) {
    *state.position.sequence_points.lock().unwrap() = points;
}

/// Remembers which display the positions/boundaries are relative to.
pub fn update_selected_display(state: &AutoClickerState, display: DisplayInfo) {
    *state.position.display.lock().unwrap() = display;
}

pub fn selected_display(state: &AutoClickerState) -> DisplayInfo {
    state.position.display.lock().unwrap().clone()
}

/// Size of the selected display (never 0, so it is safe to divide by).
pub fn screen_size(state: &AutoClickerState) -> ScreenSize {
    let display = state.position.display.lock().unwrap();
    ScreenSize {
        width: display.width.max(1),
        height: display.height.max(1),
    }
}

/// All connected displays, primary first.
pub fn available_displays(window: &WebviewWindow) -> Result<Vec<DisplayInfo>, String> {
    let monitors = window
        .available_monitors()
        .map_err(|error| format!("Unable to enumerate displays: {error}"))?;
    let primary = window
        .primary_monitor()
        .map_err(|error| format!("Unable to identify primary display: {error}"))?;
    let primary_id = primary
        .as_ref()
        .map(|monitor| DisplayInfo::from_monitor(monitor, true).id);
    let mut displays: Vec<_> = monitors
        .iter()
        .map(|monitor| {
            let mut display = DisplayInfo::from_monitor(monitor, false);
            display.is_primary = primary_id.as_deref() == Some(display.id.as_str());
            display
        })
        .collect();
    displays.sort_by_key(|display| (!display.is_primary, display.origin_x, display.origin_y));
    Ok(displays)
}
