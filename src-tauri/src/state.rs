use std::sync::atomic::{AtomicBool, AtomicU32};
use std::sync::Arc;

pub struct AutoClickerState {
    pub is_running: Arc<AtomicBool>,
    pub cps: Arc<AtomicU32>,
    pub interval_randomization_pct: Arc<AtomicU32>,
    pub button_hold_ms: Arc<AtomicU32>,
    pub start_delay_ms: Arc<AtomicU32>,
}