use crate::app_state::AppState;
use crate::clicker::display::DisplayInfo;
use crate::clicker::engine;
use crate::clicker::position::{
    RustCoordinateType, RustPositionMode, RustSequencePoint, ScreenSize,
};
use crate::clicker::state::{
    AutoClickerState, RustClickType, RustMouseButton, RustRegionMode, RustRepeatType,
};
use std::sync::atomic::Ordering;
use tauri::{AppHandle, WebviewWindow};

pub fn start_engine(app_handle: AppHandle, state: AutoClickerState) {
    engine::start_click_loop(app_handle, state);
}

pub fn toggle(state: &AppState) -> bool {
    !state.clicker.is_running.fetch_xor(true, Ordering::SeqCst)
}

pub fn update_cps(state: &AutoClickerState, value: u32) {
    state.cps.store(value, Ordering::SeqCst);
}

pub fn update_interval_randomization_pct(state: &AutoClickerState, value: u32) {
    state
        .interval_randomization_pct
        .store(value, Ordering::SeqCst);
}

pub fn update_button_hold_ms(state: &AutoClickerState, value: u32) {
    state.button_hold_ms.store(value, Ordering::SeqCst);
}

pub fn update_start_delay_ms(state: &AutoClickerState, value: u32) {
    state.start_delay_ms.store(value, Ordering::SeqCst);
}

pub fn update_mouse_button(state: &AutoClickerState, value: RustMouseButton) {
    *state.mouse_button.lock().unwrap() = value;
}

pub fn update_click_type(state: &AutoClickerState, value: RustClickType) {
    *state.click_type.lock().unwrap() = value;
}

pub fn update_position_mode(state: &AutoClickerState, value: RustPositionMode) {
    *state.position.mode.lock().unwrap() = value;
}

pub fn update_coordinate_type(state: &AutoClickerState, value: RustCoordinateType) {
    *state.position.coordinate_type.lock().unwrap() = value;
}

pub fn update_target_position(state: &AutoClickerState, x: i32, y: i32) {
    state.position.target_x.store(x, Ordering::SeqCst);
    state.position.target_y.store(y, Ordering::SeqCst);
}

pub fn update_selected_display(state: &AutoClickerState, display: DisplayInfo) {
    *state.position.display.lock().unwrap() = display;
}

pub fn selected_display(state: &AutoClickerState) -> DisplayInfo {
    state.position.display.lock().unwrap().clone()
}

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

pub fn update_position_jitter(state: &AutoClickerState, value: u32) {
    state.position.jitter_px.store(value, Ordering::SeqCst);
}

pub fn update_sequence_points(state: &AutoClickerState, points: Vec<RustSequencePoint>) {
    *state.position.sequence_points.lock().unwrap() = points;
}

pub fn screen_size(state: &AutoClickerState) -> ScreenSize {
    let display = state.position.display.lock().unwrap();
    ScreenSize {
        width: display.width.max(1),
        height: display.height.max(1),
    }
}

pub fn update_repeat_type(state: &AutoClickerState, value: RustRepeatType) {
    *state.repeat_type.lock().unwrap() = value;
}

pub fn update_fixed_count_limit(state: &AutoClickerState, value: u32) {
    state.fixed_count_limit.store(value, Ordering::SeqCst);
}

pub fn update_max_duration_enabled(state: &AutoClickerState, value: bool) {
    state.max_duration_enabled.store(value, Ordering::SeqCst);
}

pub fn update_max_duration_sec(state: &AutoClickerState, value: u32) {
    state.max_duration_sec.store(value, Ordering::SeqCst);
}

pub fn set_boundaries_enabled(state: &AutoClickerState, enabled: bool) {
    state.boundaries_enabled.store(enabled, Ordering::SeqCst);
}

pub fn set_region_mode(state: &AutoClickerState, mode: RustRegionMode) {
    *state.region_mode.lock().unwrap() = mode;
}

pub fn update_boundary_rect(state: &AutoClickerState, x: i32, y: i32, width: u32, height: u32) {
    state.boundary_x.store(x, Ordering::SeqCst);
    state.boundary_y.store(y, Ordering::SeqCst);
    state.boundary_width.store(width, Ordering::SeqCst);
    state.boundary_height.store(height, Ordering::SeqCst);
}

pub fn set_stop_when_cursor_leaves(state: &AutoClickerState, enabled: bool) {
    state
        .stop_when_cursor_leaves
        .store(enabled, Ordering::SeqCst);
}
