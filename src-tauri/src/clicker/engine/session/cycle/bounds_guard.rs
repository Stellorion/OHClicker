//! Safety check run before every click: is the cursor inside the Boundaries region?
use super::super::ClickSession;
use crate::clicker::engine::actions;
use crate::clicker::state::AutoClickerState;
use enigo::{Button, Enigo};
use std::sync::atomic::Ordering;
use std::thread;
use std::time::Duration;
use tauri::AppHandle;

/// Returns true if it is OK to click. When the cursor is outside the region
/// this either stops the clicker or pauses until the cursor comes back.
pub(super) fn within_bounds(
    session: &mut ClickSession,
    _app: &AppHandle,
    state: &AutoClickerState,
    enigo: &mut Enigo,
    button: Button,
) -> bool {
    let inside = match super::boundaries::check_boundaries(state, enigo) {
        Ok(inside) => inside,
        Err(error) => {
            eprintln!("Boundary check failed: {error}");
            false
        }
    };
    if inside {
        return true;
    }
    if session.hold_active {
        actions::release(enigo, button);
        session.hold_active = false;
    }
    if state.stop_when_cursor_leaves.load(Ordering::SeqCst) {
        // click_loop sees is_running == false, runs stop() and emits the state event
        state.is_running.store(false, Ordering::SeqCst);
    } else {
        thread::sleep(Duration::from_millis(10));
    }
    false
}
