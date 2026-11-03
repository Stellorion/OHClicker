use crate::clicker::state::{AutoClickerState, RustRegionMode};
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
        RustRegionMode::Fullscreen => {
            let d = state.position.display.lock().unwrap();
            (d.origin_x, d.origin_y, d.width as i32, d.height as i32)
        }
        RustRegionMode::ActiveWindow => {
            let (x, y, w, h) = crate::commands::boundaries::foreground_window_rect()?;
            (x, y, w as i32, h as i32)
        }
        RustRegionMode::Custom => {
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

    Ok(mouse_x >= rx && mouse_y >= ry && mouse_x < rx + rw && mouse_y < ry + rh)
}
