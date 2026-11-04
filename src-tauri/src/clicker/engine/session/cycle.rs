//! One engine step: handle start/delay, check limits, then click or hold.
//!   boundaries.rs region check   bounds_guard.rs stop/pause when outside
//!   click.rs  click + hold       limits.rs  fixed count / max duration
//!   target.rs where to click
use super::{ClickSession, lifecycle};
use crate::clicker::engine::{actions, stats};
use crate::clicker::state::{AutoClickerState, ClickType};
use enigo::Enigo;
use std::sync::atomic::Ordering;
use std::thread;
use std::time::{Duration, Instant};
use tauri::AppHandle;

mod bounds_guard;
mod boundaries;
mod click;
mod limits;
mod target;

/// Runs once per loop iteration while the clicker is on.
pub(super) fn tick(
    session: &mut ClickSession,
    app: &AppHandle,
    state: &AutoClickerState,
    enigo: &mut Enigo,
) {
    if !session.was_running {
        session.total_clicks = 0;
        session.sampled_clicks = 0;
        session.last_stats_update = Instant::now();
        session.was_running = true;
        session.start_time = None;
        session.sequence_index = 0;
        stats::emit(app, 0, 0.0);
    }
    let delay = state.start_delay_ms.load(Ordering::Relaxed);
    if delay > 0 && !session.has_delayed {
        thread::sleep(Duration::from_millis(delay as u64));
        session.has_delayed = true;
        session.next_click = Instant::now();
        session.last_stats_update = Instant::now();
        session.start_time = Some(Instant::now());
    } else if delay == 0 && session.start_time.is_none() {
        session.start_time = Some(Instant::now());
    }

    if limits::reached(session, state) {
        state.is_running.store(false, Ordering::Relaxed);
        return;
    }

    let button = lifecycle::get_button(*state.mouse_button.lock().unwrap());
    if *state.click_type.lock().unwrap() == ClickType::Hold {
        click::hold(session, app, state, enigo, button);
        return;
    }
    if session.hold_active {
        actions::release(enigo, button);
        session.hold_active = false;
    }
    click::click_if_due(session, app, state, enigo, button);
}
