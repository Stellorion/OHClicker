mod cycle;
mod lifecycle;
mod timing;

use crate::clicker::state::AutoClickerState;
use enigo::Enigo;
use std::time::Instant;
use tauri::AppHandle;

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
    pub(super) fn tick(&mut self, app: &AppHandle, state: &AutoClickerState, enigo: &mut Enigo) {
        cycle::tick(self, app, state, enigo);
    }

    pub(super) fn stop(&mut self, app: &AppHandle, state: &AutoClickerState, enigo: &mut Enigo) {
        lifecycle::stop(self, app, state, enigo);
    }
}
