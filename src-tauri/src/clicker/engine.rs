//! Background click thread: `start_click_loop` is called once at startup.
//!   click_loop.rs  endless loop   session/  per-run state and one click cycle
//!   actions.rs     mouse input    stats.rs  click statistics events
mod actions;
mod click_loop;
mod session;
mod stats;

use crate::clicker::state::AutoClickerState;
use std::sync::OnceLock;
use std::thread;
use tauri::AppHandle;

static CLICK_LOOP_INITIALIZED: OnceLock<()> = OnceLock::new();

/// Spawns the click thread (only the first call has an effect).
pub fn start_click_loop(app_handle: AppHandle, state: AutoClickerState) {
    CLICK_LOOP_INITIALIZED.get_or_init(move || {
        thread::spawn(move || click_loop::run(app_handle, state));
    });
}
