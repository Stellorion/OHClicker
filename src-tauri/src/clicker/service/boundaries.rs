//! Click-region ("Boundaries") settings.
use crate::clicker::state::{AutoClickerState, RegionMode};
use std::sync::atomic::Ordering;

pub fn set_boundaries_enabled(state: &AutoClickerState, enabled: bool) {
    state.boundaries_enabled.store(enabled, Ordering::SeqCst);
}

pub fn set_region_mode(state: &AutoClickerState, mode: RegionMode) {
    *state.region_mode.lock().unwrap() = mode;
}

/// Custom rectangle, relative to the selected display.
pub fn update_boundary_rect(state: &AutoClickerState, x: i32, y: i32, width: u32, height: u32) {
    state.boundary_x.store(x, Ordering::SeqCst);
    state.boundary_y.store(y, Ordering::SeqCst);
    state.boundary_width.store(width, Ordering::SeqCst);
    state.boundary_height.store(height, Ordering::SeqCst);
}

pub fn set_stop_when_cursor_leaves(state: &AutoClickerState, enabled: bool) {
    state
        .stop_when_cursor_leaves
        .store(enabled, Ordering::SeqCst);
}

/// Remembers the window that "Choose window" follows.
pub fn set_boundary_window(state: &AutoClickerState, id: i64, title: String) {
    state.boundary_window.set(id, title);
}
