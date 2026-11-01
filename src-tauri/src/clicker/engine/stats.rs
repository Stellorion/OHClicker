use serde::Serialize;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ClickerStats {
    total_clicks: u64,
    current_cps: f64,
}

pub(super) fn emit_sampled(
    app_handle: &AppHandle,
    total_clicks: u64,
    sampled_clicks: &mut u64,
    last_update: &mut Instant,
) {
    let elapsed = last_update.elapsed();
    if elapsed >= Duration::from_millis(200) {
        let current_cps = *sampled_clicks as f64 / elapsed.as_secs_f64();
        emit(app_handle, total_clicks, current_cps);
        *sampled_clicks = 0;
        *last_update = Instant::now();
    }
}

pub(super) fn emit(app_handle: &AppHandle, total_clicks: u64, current_cps: f64) {
    let _ = app_handle.emit(
        "clicker-stats",
        ClickerStats {
            total_clicks,
            current_cps,
        },
    );
}
