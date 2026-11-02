use crate::clicker::state::AutoClickerState;
use std::sync::atomic::AtomicBool;
use std::sync::Mutex;

pub struct AppState {
    pub clicker: AutoClickerState,
    pub overlay_visible: AtomicBool,
    pub pick_armed: AtomicBool,
    pub pick_target: Mutex<Option<String>>,
    pub start_stop_hotkey: Mutex<String>,
    pub pick_position_hotkey: Mutex<String>,
    pub toggle_overlay_hotkey: Mutex<String>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            clicker: AutoClickerState::new(),
            overlay_visible: AtomicBool::new(false),
            pick_armed: AtomicBool::new(false),
            pick_target: Mutex::new(None),
            start_stop_hotkey: Mutex::new("F6".to_string()),
            pick_position_hotkey: Mutex::new("F7".to_string()),
            toggle_overlay_hotkey: Mutex::new("F8".to_string()),
        }
    }
}