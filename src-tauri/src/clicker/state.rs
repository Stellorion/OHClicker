//! Click engine settings shared between the UI commands and the click thread.
//! Frontend mirror of the enums: frontend-src/types/clicker-types.ts
use crate::clicker::boundary_window::BoundaryWindow;
use crate::clicker::position::PositionSettings;
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, AtomicI32, AtomicU32};
use std::sync::{Arc, Mutex};

/// Which mouse button is clicked.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum MouseButton {
    Left,
    Middle,
    Right,
}

/// Single click, or press-and-hold.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ClickType {
    Single,
    Hold,
}

/// Run until stopped, or stop after a fixed number of clicks.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RepeatType {
    UntilStopped,
    FixedCount,
}

/// Boundaries: whole display, a window the user chose, or a custom rectangle.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RegionMode {
    Fullscreen,
    /// Followed window; `active_window` is the old name (kept so old profiles load).
    #[serde(alias = "active_window")]
    ChooseWindow,
    Custom,
}

/// All live settings. Atomics/Mutexes so the UI thread and the click thread can share them.
#[derive(Clone)]
pub struct AutoClickerState {
    pub(crate) is_running: Arc<AtomicBool>,
    pub(crate) cps: Arc<AtomicU32>,
    pub(crate) interval_randomization_pct: Arc<AtomicU32>,
    pub(crate) button_hold_ms: Arc<AtomicU32>,
    pub(crate) start_delay_ms: Arc<AtomicU32>,
    pub(crate) mouse_button: Arc<Mutex<MouseButton>>,
    pub(crate) click_type: Arc<Mutex<ClickType>>,
    pub(crate) repeat_type: Arc<Mutex<RepeatType>>,
    pub(crate) fixed_count_limit: Arc<AtomicU32>,
    pub(crate) max_duration_enabled: Arc<AtomicBool>,
    pub(crate) max_duration_sec: Arc<AtomicU32>,
    pub(crate) position: PositionSettings,
    pub(crate) boundaries_enabled: Arc<AtomicBool>,
    pub(crate) region_mode: Arc<Mutex<RegionMode>>,
    pub(crate) boundary_window: BoundaryWindow,
    pub(crate) boundary_x: Arc<AtomicI32>,
    pub(crate) boundary_y: Arc<AtomicI32>,
    pub(crate) boundary_width: Arc<AtomicU32>,
    pub(crate) boundary_height: Arc<AtomicU32>,
    pub(crate) stop_when_cursor_leaves: Arc<AtomicBool>,
}

impl AutoClickerState {
    /// Default values (before any profile is loaded).
    pub fn new() -> Self {
        Self {
            is_running: Arc::new(AtomicBool::new(false)),
            cps: Arc::new(AtomicU32::new(10)),
            interval_randomization_pct: Arc::new(AtomicU32::new(0)),
            button_hold_ms: Arc::new(AtomicU32::new(12)),
            start_delay_ms: Arc::new(AtomicU32::new(3000)),
            mouse_button: Arc::new(Mutex::new(MouseButton::Left)),
            click_type: Arc::new(Mutex::new(ClickType::Single)),
            repeat_type: Arc::new(Mutex::new(RepeatType::UntilStopped)),
            fixed_count_limit: Arc::new(AtomicU32::new(500)),
            max_duration_enabled: Arc::new(AtomicBool::new(false)),
            max_duration_sec: Arc::new(AtomicU32::new(300)),
            position: PositionSettings::new(),
            boundaries_enabled: Arc::new(AtomicBool::new(false)),
            region_mode: Arc::new(Mutex::new(RegionMode::Fullscreen)),
            boundary_window: BoundaryWindow::new(),
            boundary_x: Arc::new(AtomicI32::new(320)),
            boundary_y: Arc::new(AtomicI32::new(180)),
            boundary_width: Arc::new(AtomicU32::new(1280)),
            boundary_height: Arc::new(AtomicU32::new(800)),
            stop_when_cursor_leaves: Arc::new(AtomicBool::new(true)),
        }
    }
}
