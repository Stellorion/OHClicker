use super::session;
use crate::clicker::state::AutoClickerState;
use enigo::{Enigo, Settings};
use std::sync::atomic::Ordering;
use std::thread;
use std::time::Duration;
use tauri::AppHandle;

pub(super) fn run(app: AppHandle, state: AutoClickerState) {
    let mut enigo = match Enigo::new(&Settings::default()) {
        Ok(enigo) => enigo,
        Err(error) => {
            eprintln!("Failed to initialize Enigo: {:?}", error);
            return;
        }
    };
    let mut session = session::ClickSession::default();
    loop {
        if state.is_running.load(Ordering::Relaxed) {
            session.tick(&app, &state, &mut enigo);
        } else {
            session.stop(&app, &state, &mut enigo);
            thread::sleep(Duration::from_millis(20));
        }
    }
}
