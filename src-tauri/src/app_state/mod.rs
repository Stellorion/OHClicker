//! Global state shared by every Tauri command (`app.manage(AppState::new())`).
//! Settings <-> profile conversion lives in `profile_sync.rs`.
mod profile_sync;

use crate::clicker::profile::LinkedProfile;
use crate::clicker::state::AutoClickerState;
use std::sync::Mutex;
use std::sync::atomic::AtomicBool;

pub struct AppState {
    /// Click engine settings (cps, position, boundaries ...).
    pub clicker: AutoClickerState,
    /// Is the position overlay window shown?
    pub overlay_visible: AtomicBool,
    /// Is the "click to pick a position" mode armed?
    pub pick_armed: AtomicBool,
    /// Sequence point id being picked (None = the fixed target).
    pub pick_target: Mutex<Option<String>>,
    /// Currently registered global hotkeys (OS shortcut strings).
    pub start_stop_hotkey: Mutex<String>,
    pub pick_position_hotkey: Mutex<String>,
    pub toggle_overlay_hotkey: Mutex<String>,
    /// Profile file that is auto-loaded on start (see `clicker::profile::link`).
    pub linked_profile: Mutex<LinkedProfile>,
}

impl AppState {
    /// Default state used before any profile is loaded.
    pub fn new() -> Self {
        Self {
            clicker: AutoClickerState::new(),
            overlay_visible: AtomicBool::new(false),
            pick_armed: AtomicBool::new(false),
            pick_target: Mutex::new(None),
            start_stop_hotkey: Mutex::new("F6".to_string()),
            pick_position_hotkey: Mutex::new("F7".to_string()),
            toggle_overlay_hotkey: Mutex::new("F8".to_string()),
            linked_profile: Mutex::new(LinkedProfile::unlinked()),
        }
    }
}
