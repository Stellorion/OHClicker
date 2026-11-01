use crate::state::AutoClickerState;
use std::sync::atomic::Ordering;

#[tauri::command]
pub fn toggle_clicker(state: tauri::State<'_, AutoClickerState>) -> bool {
    let current = state.is_running.load(Ordering::SeqCst);
    let next_state = !current;
    state.is_running.store(next_state, Ordering::SeqCst);
    next_state
}

#[tauri::command]
pub fn update_cps(state: tauri::State<'_, AutoClickerState>, cps: u32) {
    state.cps.store(cps, Ordering::SeqCst);
}

#[tauri::command]
pub fn update_interval_randomization_pct(state: tauri::State<'_, AutoClickerState>, pct: u32) {
    state
        .interval_randomization_pct
        .store(pct, Ordering::SeqCst);
}

#[tauri::command]
pub fn update_button_hold_ms(
    state: tauri::State<'_, AutoClickerState>,
    hold_ms: u32,
) {
    state.button_hold_ms.store(hold_ms, Ordering::SeqCst);
}

#[tauri::command]
pub fn update_start_delay_ms(
    state: tauri::State<'_, AutoClickerState>,
    delay_ms: u32,
) {
    state.start_delay_ms.store(delay_ms, Ordering::SeqCst);
}