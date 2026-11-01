mod actions;
mod click_loop;
mod session;
mod stats;

use crate::clicker::state::AutoClickerState;
use crate::execution::ExecutionCoordinator;
use std::sync::Arc;
use std::sync::OnceLock;
use std::thread;
use tauri::AppHandle;

static CLICK_LOOP_INITIALIZED: OnceLock<()> = OnceLock::new();

pub fn start_click_loop(
    app_handle: AppHandle,
    state: AutoClickerState,
    execution: Arc<ExecutionCoordinator>,
) {
    CLICK_LOOP_INITIALIZED.get_or_init(move || {
        thread::spawn(move || click_loop::run(app_handle, state, execution));
    });
}
