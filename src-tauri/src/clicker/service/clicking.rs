//! Timing, button and limit settings of the click engine.
use crate::app_state::AppState;
use crate::clicker::engine;
use crate::clicker::state::{AutoClickerState, ClickType, MouseButton, RepeatType};
use std::sync::atomic::Ordering;
use tauri::AppHandle;

/// Spawns the background click loop (only once).
pub fn start_engine(app_handle: AppHandle, state: AutoClickerState) {
    engine::start_click_loop(app_handle, state);
}

/// Start/stop. Returns the NEW running state.
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

pub fn update_mouse_button(state: &AutoClickerState, value: MouseButton) {
    *state.mouse_button.lock().unwrap() = value;
}

pub fn update_click_type(state: &AutoClickerState, value: ClickType) {
    *state.click_type.lock().unwrap() = value;
}

pub fn update_repeat_type(state: &AutoClickerState, value: RepeatType) {
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
