use crate::clicker::position::PositionSettings;
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, AtomicI32, AtomicU32};
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum RustMouseButton {
    Left,
    Middle,
    Right,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum RustClickType {
    Single,
    Hold,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RustRepeatType {
    UntilStopped,
    FixedCount,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RustRegionMode {
    Fullscreen,
    ActiveWindow,
    Custom,
}

#[derive(Clone)]
pub struct AutoClickerState {
    pub(crate) is_running: Arc<AtomicBool>,
    pub(crate) cps: Arc<AtomicU32>,
    pub(crate) interval_randomization_pct: Arc<AtomicU32>,
    pub(crate) button_hold_ms: Arc<AtomicU32>,
    pub(crate) start_delay_ms: Arc<AtomicU32>,
    pub(crate) mouse_button: Arc<Mutex<RustMouseButton>>,
    pub(crate) click_type: Arc<Mutex<RustClickType>>,
    pub(crate) repeat_type: Arc<Mutex<RustRepeatType>>,
    pub(crate) fixed_count_limit: Arc<AtomicU32>,
    pub(crate) max_duration_enabled: Arc<AtomicBool>,
    pub(crate) max_duration_sec: Arc<AtomicU32>,
    pub(crate) position: PositionSettings,
    pub(crate) boundaries_enabled: Arc<AtomicBool>,
    pub(crate) region_mode: Arc<Mutex<RustRegionMode>>,
    pub(crate) boundary_x: Arc<AtomicI32>,
    pub(crate) boundary_y: Arc<AtomicI32>,
    pub(crate) boundary_width: Arc<AtomicU32>,
    pub(crate) boundary_height: Arc<AtomicU32>,
    pub(crate) stop_when_cursor_leaves: Arc<AtomicBool>,
}

impl AutoClickerState {
    pub fn new() -> Self {
        Self {
            is_running: Arc::new(AtomicBool::new(false)),
            cps: Arc::new(AtomicU32::new(10)),
            interval_randomization_pct: Arc::new(AtomicU32::new(0)),
            button_hold_ms: Arc::new(AtomicU32::new(12)),
            start_delay_ms: Arc::new(AtomicU32::new(3000)),
            mouse_button: Arc::new(Mutex::new(RustMouseButton::Left)),
            click_type: Arc::new(Mutex::new(RustClickType::Single)),
            repeat_type: Arc::new(Mutex::new(RustRepeatType::UntilStopped)),
            fixed_count_limit: Arc::new(AtomicU32::new(500)),
            max_duration_enabled: Arc::new(AtomicBool::new(false)),
            max_duration_sec: Arc::new(AtomicU32::new(300)),
            position: PositionSettings::new(),
            boundaries_enabled: Arc::new(AtomicBool::new(false)),
            region_mode: Arc::new(Mutex::new(RustRegionMode::Fullscreen)),
            boundary_x: Arc::new(AtomicI32::new(320)),
            boundary_y: Arc::new(AtomicI32::new(180)),
            boundary_width: Arc::new(AtomicU32::new(1280)),
            boundary_height: Arc::new(AtomicU32::new(800)),
            stop_when_cursor_leaves: Arc::new(AtomicBool::new(true)),
        }
    }
}
