//! Converts between the live engine state and a `ConfigProfile`.
//! Hotkeys are NOT applied here: they must be re-registered with the OS,
//! see `clicker::hotkeys::apply_hotkeys`.
use super::AppState;
use crate::clicker::profile::ConfigProfile;
use std::sync::atomic::Ordering::SeqCst;

impl AppState {
    /// Snapshot of the current settings, used by "Export".
    pub fn to_profile(&self) -> ConfigProfile {
        let c = &self.clicker;
        let p = &c.position;
        ConfigProfile {
            cps: c.cps.load(SeqCst),
            interval_randomization_pct: c.interval_randomization_pct.load(SeqCst),
            button_hold_ms: c.button_hold_ms.load(SeqCst),
            start_delay_ms: c.start_delay_ms.load(SeqCst),
            mouse_button: *c.mouse_button.lock().unwrap(),
            click_type: *c.click_type.lock().unwrap(),
            repeat_type: *c.repeat_type.lock().unwrap(),
            fixed_count_limit: c.fixed_count_limit.load(SeqCst),
            max_duration_enabled: c.max_duration_enabled.load(SeqCst),
            max_duration_sec: c.max_duration_sec.load(SeqCst),
            boundaries_enabled: c.boundaries_enabled.load(SeqCst),
            region_mode: *c.region_mode.lock().unwrap(),
            boundary_x: c.boundary_x.load(SeqCst),
            boundary_y: c.boundary_y.load(SeqCst),
            boundary_width: c.boundary_width.load(SeqCst),
            boundary_height: c.boundary_height.load(SeqCst),
            stop_when_cursor_leaves: c.stop_when_cursor_leaves.load(SeqCst),
            position_mode: *p.mode.lock().unwrap(),
            coordinate_type: *p.coordinate_type.lock().unwrap(),
            target_x: p.target_x.load(SeqCst),
            target_y: p.target_y.load(SeqCst),
            jitter_px: p.jitter_px.load(SeqCst),
            sequence_points: p.sequence_points.lock().unwrap().clone(),
            start_stop_hotkey: self.start_stop_hotkey.lock().unwrap().clone(),
            pick_position_hotkey: self.pick_position_hotkey.lock().unwrap().clone(),
            toggle_overlay_hotkey: self.toggle_overlay_hotkey.lock().unwrap().clone(),
        }
    }

    /// Writes an (already validated) profile into the live engine state.
    pub fn apply_profile(&self, profile: ConfigProfile) {
        let c = &self.clicker;
        let p = &c.position;
        c.cps.store(profile.cps, SeqCst);
        c.interval_randomization_pct.store(profile.interval_randomization_pct, SeqCst);
        c.button_hold_ms.store(profile.button_hold_ms, SeqCst);
        c.start_delay_ms.store(profile.start_delay_ms, SeqCst);
        *c.mouse_button.lock().unwrap() = profile.mouse_button;
        *c.click_type.lock().unwrap() = profile.click_type;
        *c.repeat_type.lock().unwrap() = profile.repeat_type;
        c.fixed_count_limit.store(profile.fixed_count_limit, SeqCst);
        c.max_duration_enabled.store(profile.max_duration_enabled, SeqCst);
        c.max_duration_sec.store(profile.max_duration_sec, SeqCst);
        c.boundaries_enabled.store(profile.boundaries_enabled, SeqCst);
        *c.region_mode.lock().unwrap() = profile.region_mode;
        c.boundary_x.store(profile.boundary_x, SeqCst);
        c.boundary_y.store(profile.boundary_y, SeqCst);
        c.boundary_width.store(profile.boundary_width, SeqCst);
        c.boundary_height.store(profile.boundary_height, SeqCst);
        c.stop_when_cursor_leaves.store(profile.stop_when_cursor_leaves, SeqCst);
        *p.mode.lock().unwrap() = profile.position_mode;
        *p.coordinate_type.lock().unwrap() = profile.coordinate_type;
        p.target_x.store(profile.target_x, SeqCst);
        p.target_y.store(profile.target_y, SeqCst);
        p.jitter_px.store(profile.jitter_px, SeqCst);
        *p.sequence_points.lock().unwrap() = profile.sequence_points;
    }
}
