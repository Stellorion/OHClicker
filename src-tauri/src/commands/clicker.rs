use crate::app_state::AppState;
use crate::clicker::service;
use crate::clicker::state::{RustClickType, RustMouseButton, RustRepeatType};

#[tauri::command]
pub fn toggle_clicker(state: tauri::State<'_, AppState>) -> Result<bool, String> {
    service::toggle(&state)
}

#[tauri::command]
pub fn update_cps(state: tauri::State<'_, AppState>, cps: u32) {
    service::update_cps(&state.clicker, cps);
}

#[tauri::command]
pub fn update_interval_randomization_pct(state: tauri::State<'_, AppState>, pct: u32) {
    service::update_interval_randomization_pct(&state.clicker, pct);
}

#[tauri::command]
pub fn update_button_hold_ms(state: tauri::State<'_, AppState>, hold_ms: u32) {
    service::update_button_hold_ms(&state.clicker, hold_ms);
}

#[tauri::command]
pub fn update_start_delay_ms(state: tauri::State<'_, AppState>, delay_ms: u32) {
    service::update_start_delay_ms(&state.clicker, delay_ms);
}

#[tauri::command]
pub fn update_mouse_button(state: tauri::State<'_, AppState>, button: RustMouseButton) {
    service::update_mouse_button(&state.clicker, button);
}

#[tauri::command]
pub fn update_click_type(state: tauri::State<'_, AppState>, click_type: RustClickType) {
    service::update_click_type(&state.clicker, click_type);
}

#[tauri::command]
pub fn update_repeat_type(state: tauri::State<'_, AppState>, repeat_type: RustRepeatType) {
    service::update_repeat_type(&state.clicker, repeat_type);
}

#[tauri::command]
pub fn update_fixed_count_limit(state: tauri::State<'_, AppState>, limit: u32) {
    service::update_fixed_count_limit(&state.clicker, limit);
}

#[tauri::command]
pub fn update_max_duration_enabled(state: tauri::State<'_, AppState>, enabled: bool) {
    service::update_max_duration_enabled(&state.clicker, enabled);
}

#[tauri::command]
pub fn update_max_duration_sec(state: tauri::State<'_, AppState>, sec: u32) {
    service::update_max_duration_sec(&state.clicker, sec);
}
