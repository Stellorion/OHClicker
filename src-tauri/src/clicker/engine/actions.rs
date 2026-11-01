use enigo::{Button, Direction, Enigo, Mouse};
use std::thread;
use std::time::Duration;

pub(super) fn click_once(enigo: &mut Enigo, button: Button, hold_duration: Duration) {
    let _ = enigo.button(button, Direction::Press);
    if hold_duration > Duration::ZERO {
        thread::sleep(hold_duration);
    }
    let _ = enigo.button(button, Direction::Release);
}

pub(super) fn press(enigo: &mut Enigo, button: Button) {
    let _ = enigo.button(button, Direction::Press);
}

pub(super) fn release(enigo: &mut Enigo, button: Button) {
    let _ = enigo.button(button, Direction::Release);
}
