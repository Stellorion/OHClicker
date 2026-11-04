//! Low-level mouse button actions (enigo).
use enigo::{Button, Direction, Enigo, Mouse};
use std::thread;
use std::time::Duration;

/// Press, wait `hold_duration`, release.
pub(super) fn click_once(enigo: &mut Enigo, button: Button, hold_duration: Duration) {
    let _ = enigo.button(button, Direction::Press);
    if hold_duration > Duration::ZERO {
        thread::sleep(hold_duration);
    }
    let _ = enigo.button(button, Direction::Release);
}

/// Press and keep the button down (Hold mode).
pub(super) fn press(enigo: &mut Enigo, button: Button) {
    let _ = enigo.button(button, Direction::Press);
}

/// Release the button.
pub(super) fn release(enigo: &mut Enigo, button: Button) {
    let _ = enigo.button(button, Direction::Release);
}
