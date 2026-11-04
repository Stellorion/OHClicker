//! Turns a configured position into real desktop pixels (adds jitter + display origin).
mod jitter;

use crate::clicker::display::DisplayInfo;
use enigo::Coordinate;
use jitter::random_jitter;

/// Adds jitter; absolute positions are converted from display-local to desktop pixels.
pub(super) fn apply(
    x: i32,
    y: i32,
    coordinate: Coordinate,
    jitter: i32,
    display: &DisplayInfo,
) -> (i32, i32) {
    let (offset_x, offset_y) = random_jitter(jitter);
    let x = x.saturating_add(offset_x);
    let y = y.saturating_add(offset_y);
    if coordinate == Coordinate::Abs {
        return local_to_desktop(x, y, display);
    }
    (x, y)
}

/// Display-local (0,0 = top-left of the selected display) -> desktop coordinates, clamped to the display.
fn local_to_desktop(x: i32, y: i32, display: &DisplayInfo) -> (i32, i32) {
    (
        display.origin_x + x.clamp(0, display.width.saturating_sub(1) as i32),
        display.origin_y + y.clamp(0, display.height.saturating_sub(1) as i32),
    )
}

#[cfg(test)]
mod tests {
    use super::local_to_desktop;
    use crate::clicker::display::DisplayInfo;

    #[test]
    fn converts_local_position_with_negative_monitor_origin() {
        let display = DisplayInfo {
            id: "left".into(),
            name: "Left monitor".into(),
            width: 1920,
            height: 1080,
            origin_x: -1920,
            origin_y: 0,
            scale_factor: 1.0,
            is_primary: false,
        };
        assert_eq!(local_to_desktop(100, 200, &display), (-1820, 200));
        assert_eq!(local_to_desktop(3000, 200, &display), (-1, 200));
    }
}
