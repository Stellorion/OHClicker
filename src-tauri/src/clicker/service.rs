use crate::app_state::AppState;
use crate::clicker::engine;
use crate::clicker::state::{AutoClickerState, RustClickType, RustMouseButton};
use crate::execution::ExclusiveTool;
use std::sync::atomic::Ordering;
use tauri::AppHandle;

pub fn start_engine(app_handle: AppHandle, state: AutoClickerState) {
    engine::start_click_loop(app_handle, state);
}

pub fn toggle(state: &AppState) -> Result<bool, String> {
    if state.clicker.is_running.load(Ordering::SeqCst) {
        let stopped = state.execution.stop(ExclusiveTool::AutoClicker, || {
            state.clicker.is_running.store(false, Ordering::SeqCst);
        });
        return stopped
            .then_some(false)
            .ok_or_else(|| "AutoClicker is not the active tool".to_string());
    }

    state
        .execution
        .start(ExclusiveTool::AutoClicker, || {
            state.clicker.is_running.store(true, Ordering::SeqCst);
        })
        .map(|()| true)
        .map_err(|active| format!("{active} is already running"))
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
