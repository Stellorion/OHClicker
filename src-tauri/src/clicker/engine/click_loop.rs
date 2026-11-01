use super::session;
use crate::clicker::state::AutoClickerState;
use crate::execution::{ExclusiveTool, ExecutionCoordinator};
use enigo::{Enigo, Settings};
use std::sync::Arc;
use std::sync::atomic::Ordering;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

pub(super) fn run(app: AppHandle, state: AutoClickerState, execution: Arc<ExecutionCoordinator>) {
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
            let stopped = execution.stop(ExclusiveTool::AutoClicker, || {
                session.stop(&app, &state, &mut enigo);
            });
            if !stopped {
                session.stop(&app, &state, &mut enigo);
            } else {
                let _ = app.emit("clicker-state-changed", false);
            }
            thread::sleep(Duration::from_millis(20));
        }
    }
}
