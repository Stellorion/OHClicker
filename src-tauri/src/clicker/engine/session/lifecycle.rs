//! Run start/stop helpers.
use super::ClickSession;
use crate::clicker::engine::{actions, stats};
use crate::clicker::state::{AutoClickerState, MouseButton};
use enigo::{Button, Enigo};
use std::time::Instant;
use tauri::AppHandle;

/// Releases a held button, emits final stats and resets the timers.
pub(super) fn stop(
    session: &mut ClickSession,
    app: &AppHandle,
    state: &AutoClickerState,
    enigo: &mut Enigo,
) {
    if session.hold_active {
        let button = get_button(*state.mouse_button.lock().unwrap());
        actions::release(enigo, button);
        session.hold_active = false;
    }
    if session.was_running {
        stats::emit(app, session.total_clicks, 0.0);
        session.was_running = false;
    }
    session.has_delayed = false;
    session.next_click = Instant::now();
}

/// Converts our `MouseButton` to enigo's `Button`.
pub(super) fn get_button(button: MouseButton) -> Button {
    match button {
        MouseButton::Left => Button::Left,
        MouseButton::Middle => Button::Middle,
        MouseButton::Right => Button::Right,
    }
}
