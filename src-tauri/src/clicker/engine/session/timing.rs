use std::sync::atomic::{AtomicU64, Ordering};
use std::thread;
use std::time::{Duration, Instant};

static COUNTER: AtomicU64 = AtomicU64::new(0);

pub(super) fn randomized_cps(target_cps: f64, randomization_pct: f64) -> f64 {
    if randomization_pct <= 0.0 {
        return target_cps;
    }
    let variance = target_cps * randomization_pct / 100.0;
    let range = (variance * 2.0 + 1.0) as u32;
    let count = COUNTER.fetch_add(1, Ordering::Relaxed);
    let offset = if range == 0 {
        0.0
    } else {
        (count % range as u64) as f64 - variance
    };
    (target_cps + offset).max(1.0)
}

pub(super) fn wait_until(next_click: Instant) {
    let remaining = next_click.saturating_duration_since(Instant::now());
    if remaining > Duration::from_millis(2) {
        thread::sleep(remaining - Duration::from_millis(1));
    }
    while Instant::now() < next_click {
        std::hint::spin_loop();
    }
}
