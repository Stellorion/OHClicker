use crate::clicker::state::AutoClickerState;
use std::sync::atomic::AtomicBool;
use std::sync::Mutex;

pub struct AppState {
    pub clicker: AutoClickerState,
    pub overlay_visible: AtomicBool,
    pub pick_armed: AtomicBool,
    pub pick_target: Mutex<Option<String>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            clicker: AutoClickerState::new(),
            overlay_visible: AtomicBool::new(false),
            pick_armed: AtomicBool::new(false),
            pick_target: Mutex::new(None),
        }
    }
}