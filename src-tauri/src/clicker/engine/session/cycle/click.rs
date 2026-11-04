//! Performing clicks (single clicks on a timer, or holding the button down).
use super::super::ClickSession;
use super::super::timing;
use super::bounds_guard::within_bounds;
use super::target;
use crate::clicker::engine::{actions, stats};
use crate::clicker::state::AutoClickerState;
use enigo::{Button, Enigo};
use std::sync::atomic::Ordering;
use std::thread;
use std::time::{Duration, Instant};
use tauri::AppHandle;

/// Hold mode: move to the target and keep the button pressed.
pub(super) fn hold(
    session: &mut ClickSession,
    app: &AppHandle,
    state: &AutoClickerState,
    enigo: &mut Enigo,
    button: Button,
) {
    if !within_bounds(session, app, state, enigo, button) {
        return;
    }
    if !session.hold_active {
        if let Some(target) = target::resolve(state, session) {
            target::move_to(enigo, target);
        } else {
            thread::sleep(Duration::from_millis(10));
            return;
        }
        actions::press(enigo, button);
        session.hold_active = true;
        session.total_clicks += 1;
        session.sampled_clicks += 1;
    }
    emit_stats(session, app);
    thread::sleep(Duration::from_millis(10));
}

/// Single mode: click when the interval has passed and the cursor is in the region.
pub(super) fn click_if_due(
    session: &mut ClickSession,
    app: &AppHandle,
    state: &AutoClickerState,
    enigo: &mut Enigo,
    button: Button,
) {
    let cps = state.cps.load(Ordering::Relaxed).max(1) as f64;
    let jitter = state.interval_randomization_pct.load(Ordering::Relaxed) as f64;
    let interval = Duration::from_secs_f64(1.0 / timing::randomized_cps(cps, jitter));
    let now = Instant::now();
    if now < session.next_click {
        timing::wait_until(session.next_click);
        return;
    }
    if !within_bounds(session, app, state, enigo, button) {
        return;
    }
    let Some(target) = target::resolve(state, session) else {
        thread::sleep(Duration::from_millis(10));
        return;
    };
    target::move_to(enigo, target);
    let hold = Duration::from_millis(state.button_hold_ms.load(Ordering::Relaxed) as u64);
    actions::click_once(enigo, button, hold);
    session.total_clicks += 1;
    session.sampled_clicks += 1;
    session.next_click = now + interval.max(target.dwell());
    emit_stats(session, app);
}

/// Sends sampled statistics to the UI.
fn emit_stats(session: &mut ClickSession, app: &AppHandle) {
    stats::emit_sampled(
        app,
        session.total_clicks,
        &mut session.sampled_clicks,
        &mut session.last_stats_update,
    );
}
