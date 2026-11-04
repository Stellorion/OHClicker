//! Tauri commands for the click settings (frontend: services/clickerService.ts).
//! Each one only forwards to `clicker::service` (clicking.rs).
use crate::app_state::AppState;
use crate::clicker::service;
use crate::clicker::state::{ClickType, MouseButton, RepeatType};

/// Start/stop. Returns the new running state.
#[tauri::command]
pub fn toggle_clicker(state: tauri::State<'_, AppState>) -> bool {
    service::toggle(&state)
}

/// Clicks per second.
#[tauri::command]
pub fn update_cps(state: tauri::State<'_, AppState>, cps: u32) {
    service::update_cps(&state.clicker, cps);
}

/// Random variance of the click interval, in %.
#[tauri::command]
pub fn update_interval_randomization_pct(state: tauri::State<'_, AppState>, pct: u32) {
    service::update_interval_randomization_pct(&state.clicker, pct);
}

/// How long each press is held, in ms.
#[tauri::command]
pub fn update_button_hold_ms(state: tauri::State<'_, AppState>, hold_ms: u32) {
    service::update_button_hold_ms(&state.clicker, hold_ms);
}

/// Countdown before the first click, in ms.
#[tauri::command]
pub fn update_start_delay_ms(state: tauri::State<'_, AppState>, delay_ms: u32) {
    service::update_start_delay_ms(&state.clicker, delay_ms);
}

/// Left / middle / right.
#[tauri::command]
pub fn update_mouse_button(state: tauri::State<'_, AppState>, button: MouseButton) {
    service::update_mouse_button(&state.clicker, button);
}

/// Single or hold.
#[tauri::command]
pub fn update_click_type(state: tauri::State<'_, AppState>, click_type: ClickType) {
    service::update_click_type(&state.clicker, click_type);
}

/// Until stopped or fixed count.
#[tauri::command]
pub fn update_repeat_type(state: tauri::State<'_, AppState>, repeat_type: RepeatType) {
    service::update_repeat_type(&state.clicker, repeat_type);
}

/// Number of clicks for fixed count mode.
#[tauri::command]
pub fn update_fixed_count_limit(state: tauri::State<'_, AppState>, limit: u32) {
    service::update_fixed_count_limit(&state.clicker, limit);
}

/// Turns the maximum duration on/off.
#[tauri::command]
pub fn update_max_duration_enabled(state: tauri::State<'_, AppState>, enabled: bool) {
    service::update_max_duration_enabled(&state.clicker, enabled);
}

/// Maximum run time in seconds.
#[tauri::command]
pub fn update_max_duration_sec(state: tauri::State<'_, AppState>, sec: u32) {
    service::update_max_duration_sec(&state.clicker, sec);
}
