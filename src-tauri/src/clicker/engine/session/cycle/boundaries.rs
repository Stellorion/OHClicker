//! Region check used before every click (Boundaries section).
//! The overlay that DRAWS the same region is clicker/overlay/boundary_state.rs.
use crate::clicker::state::{AutoClickerState, RegionMode};
use enigo::{Enigo, Mouse};
use std::sync::atomic::Ordering;

/// Returns Ok(true) if clicking is allowed, Ok(false) if the cursor is outside
/// the configured region, Err only if the position/region could not be read.
pub(super) fn check_boundaries(
    state: &AutoClickerState,
    enigo: &mut Enigo,
) -> Result<bool, String> {
    if !state.boundaries_enabled.load(Ordering::SeqCst) {
        return Ok(true);
    }

    let (mouse_x, mouse_y) = enigo
        .location()
        .map_err(|e| format!("Failed to get mouse position: {}", e))?;

    // Copy the mode out so the mutex is not held during the Win32 calls below.
    let mode = *state.region_mode.lock().unwrap();

    // (left, top, width, height) in desktop coordinates
    let (rx, ry, rw, rh) = match mode {
        RegionMode::Fullscreen => {
            let d = state.position.display.lock().unwrap();
            (d.origin_x, d.origin_y, d.width as i32, d.height as i32)
        }
        RegionMode::ChooseWindow => match state.boundary_window.rect() {
            Some((x, y, w, h)) => (x, y, w as i32, h as i32),
            // Window closed or minimized: there is nothing to click in.
            None => return Ok(false),
        },
        RegionMode::Custom => {
            // The rectangle is entered relative to the selected display
            // (same space as the screen map), so shift it by the display origin.
            let d = state.position.display.lock().unwrap();
            (
                d.origin_x + state.boundary_x.load(Ordering::SeqCst),
                d.origin_y + state.boundary_y.load(Ordering::SeqCst),
                state.boundary_width.load(Ordering::SeqCst) as i32,
                state.boundary_height.load(Ordering::SeqCst) as i32,
            )
        }
    };

    let inside = mouse_x >= rx && mouse_y >= ry && mouse_x < rx + rw && mouse_y < ry + rh;
    if mode == RegionMode::ChooseWindow {
        // Also require that no other window covers the chosen one at the cursor.
        return Ok(inside && state.boundary_window.is_under(mouse_x, mouse_y));
    }
    Ok(inside)
}
