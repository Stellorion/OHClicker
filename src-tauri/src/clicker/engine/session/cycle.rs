use super::{ClickSession, lifecycle, timing};
use crate::clicker::engine::{actions, stats};
use crate::clicker::state::{AutoClickerState, RustClickType};
use enigo::{Button, Enigo};
use std::sync::atomic::Ordering;
use std::thread;
use std::time::{Duration, Instant};
use tauri::AppHandle;

mod limits;

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
    if *state.click_type.lock().unwrap() == RustClickType::Hold {
        hold(session, app, enigo, button);
        return;
    }
    if session.hold_active {
        actions::release(enigo, button);
        session.hold_active = false;
    }
    click_if_due(session, app, state, enigo, button);
}

fn hold(session: &mut ClickSession, app: &AppHandle, enigo: &mut Enigo, button: Button) {
    if !session.hold_active {
        actions::press(enigo, button);
        session.hold_active = true;
        session.total_clicks += 1;
        session.sampled_clicks += 1;
    }
    stats::emit_sampled(
        app,
        session.total_clicks,
        &mut session.sampled_clicks,
        &mut session.last_stats_update,
    );
    thread::sleep(Duration::from_millis(10));
}

fn click_if_due(
    session: &mut ClickSession,
    app: &AppHandle,
    state: &AutoClickerState,
    enigo: &mut Enigo,
    button: Button,
) {
    let target_cps = state.cps.load(Ordering::Relaxed).max(1) as f64;
    let randomization = state.interval_randomization_pct.load(Ordering::Relaxed) as f64;
    let interval = Duration::from_secs_f64(1.0 / timing::randomized_cps(target_cps, randomization));
    let now = Instant::now();
    if now < session.next_click {
        timing::wait_until(session.next_click);
        return;
    }
    let hold_ms = state.button_hold_ms.load(Ordering::Relaxed);
    actions::click_once(enigo, button, Duration::from_millis(hold_ms as u64));
    session.total_clicks += 1;
    session.sampled_clicks += 1;
    session.next_click = now + interval;
    stats::emit_sampled(
        app,
        session.total_clicks,
        &mut session.sampled_clicks,
        &mut session.last_stats_update,
    );
}
