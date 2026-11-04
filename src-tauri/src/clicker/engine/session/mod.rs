//! State of one run (counters, timers) and its two entry points: `tick` and `stop`.
mod cycle;
mod lifecycle;
mod timing;

use crate::clicker::state::AutoClickerState;
use enigo::Enigo;
use std::time::Instant;
use tauri::AppHandle;

/// Everything the engine remembers between ticks of one run.
pub(super) struct ClickSession {
    pub(super) next_click: Instant,
    pub(super) has_delayed: bool,
    pub(super) hold_active: bool,
    pub(super) was_running: bool,
    pub(super) total_clicks: u64,
    pub(super) sampled_clicks: u64,
    pub(super) last_stats_update: Instant,
    pub(super) start_time: Option<Instant>,
    pub(super) sequence_index: usize,
}

/// Fresh session: nothing clicked yet.
impl Default for ClickSession {
    fn default() -> Self {
        let now = Instant::now();
        Self {
            next_click: now,
            has_delayed: false,
            hold_active: false,
            was_running: false,
            total_clicks: 0,
            sampled_clicks: 0,
            last_stats_update: now,
            start_time: None,
            sequence_index: 0,
        }
    }
}

impl ClickSession {
    /// One step while running (see cycle.rs).
    pub(super) fn tick(&mut self, app: &AppHandle, state: &AutoClickerState, enigo: &mut Enigo) {
        cycle::tick(self, app, state, enigo);
    }

    /// Cleanup after a run (see lifecycle.rs).
    pub(super) fn stop(&mut self, app: &AppHandle, state: &AutoClickerState, enigo: &mut Enigo) {
        lifecycle::stop(self, app, state, enigo);
    }
}
