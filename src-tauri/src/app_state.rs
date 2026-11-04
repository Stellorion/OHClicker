use crate::clicker::profile::ConfigProfile;
use crate::clicker::state::AutoClickerState;
use std::sync::Mutex;
use std::sync::atomic::{AtomicBool, Ordering};

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

    // 1. Export current state into a serializable profile
    pub fn to_profile(&self) -> ConfigProfile {
        let clicker = &self.clicker;
        let pos = &clicker.position;

        ConfigProfile {
            cps: clicker.cps.load(Ordering::SeqCst),
            interval_randomization_pct: clicker.interval_randomization_pct.load(Ordering::SeqCst),
            button_hold_ms: clicker.button_hold_ms.load(Ordering::SeqCst),
            start_delay_ms: clicker.start_delay_ms.load(Ordering::SeqCst),
            mouse_button: *clicker.mouse_button.lock().unwrap(),
            click_type: *clicker.click_type.lock().unwrap(),
            repeat_type: *clicker.repeat_type.lock().unwrap(),
            fixed_count_limit: clicker.fixed_count_limit.load(Ordering::SeqCst),
            max_duration_enabled: clicker.max_duration_enabled.load(Ordering::SeqCst),
            max_duration_sec: clicker.max_duration_sec.load(Ordering::SeqCst),
            boundaries_enabled: clicker.boundaries_enabled.load(Ordering::SeqCst),
            region_mode: *clicker.region_mode.lock().unwrap(),
            boundary_x: clicker.boundary_x.load(Ordering::SeqCst),
            boundary_y: clicker.boundary_y.load(Ordering::SeqCst),
            boundary_width: clicker.boundary_width.load(Ordering::SeqCst),
            boundary_height: clicker.boundary_height.load(Ordering::SeqCst),
            stop_when_cursor_leaves: clicker.stop_when_cursor_leaves.load(Ordering::SeqCst),
            // Position settings
            position_mode: *pos.mode.lock().unwrap(),
            coordinate_type: *pos.coordinate_type.lock().unwrap(),
            target_x: pos.target_x.load(Ordering::SeqCst),
            target_y: pos.target_y.load(Ordering::SeqCst),
            jitter_px: pos.jitter_px.load(Ordering::SeqCst),
            sequence_points: pos.sequence_points.lock().unwrap().clone(),
            // Hotkeys
            start_stop_hotkey: self.start_stop_hotkey.lock().unwrap().clone(),
            pick_position_hotkey: self.pick_position_hotkey.lock().unwrap().clone(),
            toggle_overlay_hotkey: self.toggle_overlay_hotkey.lock().unwrap().clone(),
        }
    }

    // 2. Apply an imported profile back into live state atomics/mutexes.
    //    Hotkeys are NOT touched here: they have to be re-registered with the OS,
    //    see `commands::hotkeys::apply_hotkeys`.
    pub fn apply_profile(&self, profile: ConfigProfile) {
        let clicker = &self.clicker;
        let pos = &clicker.position;

        clicker.cps.store(profile.cps, Ordering::SeqCst);
        clicker
            .interval_randomization_pct
            .store(profile.interval_randomization_pct, Ordering::SeqCst);
        clicker
            .button_hold_ms
            .store(profile.button_hold_ms, Ordering::SeqCst);
        clicker
            .start_delay_ms
            .store(profile.start_delay_ms, Ordering::SeqCst);

        *clicker.mouse_button.lock().unwrap() = profile.mouse_button;
        *clicker.click_type.lock().unwrap() = profile.click_type;
        *clicker.repeat_type.lock().unwrap() = profile.repeat_type;

        clicker
            .fixed_count_limit
            .store(profile.fixed_count_limit, Ordering::SeqCst);
        clicker
            .max_duration_enabled
            .store(profile.max_duration_enabled, Ordering::SeqCst);
        clicker
            .max_duration_sec
            .store(profile.max_duration_sec, Ordering::SeqCst);
        clicker
            .boundaries_enabled
            .store(profile.boundaries_enabled, Ordering::SeqCst);

        *clicker.region_mode.lock().unwrap() = profile.region_mode;

        clicker
            .boundary_x
            .store(profile.boundary_x, Ordering::SeqCst);
        clicker
            .boundary_y
            .store(profile.boundary_y, Ordering::SeqCst);
        clicker
            .boundary_width
            .store(profile.boundary_width, Ordering::SeqCst);
        clicker
            .boundary_height
            .store(profile.boundary_height, Ordering::SeqCst);
        clicker
            .stop_when_cursor_leaves
            .store(profile.stop_when_cursor_leaves, Ordering::SeqCst);

        // Apply position settings
        *pos.mode.lock().unwrap() = profile.position_mode;
        *pos.coordinate_type.lock().unwrap() = profile.coordinate_type;
        pos.target_x.store(profile.target_x, Ordering::SeqCst);
        pos.target_y.store(profile.target_y, Ordering::SeqCst);
        pos.jitter_px.store(profile.jitter_px, Ordering::SeqCst);
        *pos.sequence_points.lock().unwrap() = profile.sequence_points;
    }
}
