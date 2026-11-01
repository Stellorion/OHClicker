use super::ClickSession;
use crate::clicker::engine::{actions, stats};
use crate::clicker::state::{AutoClickerState, RustMouseButton};
use enigo::{Button, Enigo};
use std::time::Instant;
use tauri::AppHandle;

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

pub(super) fn get_button(button: RustMouseButton) -> Button {
    match button {
        RustMouseButton::Left => Button::Left,
        RustMouseButton::Middle => Button::Middle,
        RustMouseButton::Right => Button::Right,
    }
}
