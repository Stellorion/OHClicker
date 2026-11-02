mod coordinates;

use super::super::ClickSession;
use crate::clicker::display::DisplayInfo;
use crate::clicker::position::{RustCoordinateType, RustPositionMode};
use crate::clicker::state::AutoClickerState;
use enigo::{Coordinate, Enigo, Mouse};
use std::sync::atomic::Ordering;
use std::time::Duration;

#[derive(Clone, Copy)]
pub(super) enum ClickTarget {
    Cursor,
    Move {
        x: i32,
        y: i32,
        coordinate: Coordinate,
        dwell: Duration,
    },
}

impl ClickTarget {
    pub(super) fn dwell(self) -> Duration {
        match self {
            Self::Cursor => Duration::ZERO,
            Self::Move { dwell, .. } => dwell,
        }
    }
}

pub(super) fn resolve(
    state: &AutoClickerState,
    session: &mut ClickSession,
) -> Option<ClickTarget> {
    let position = &state.position;
    let mode = *position.mode.lock().unwrap();
    let coordinate_type = *position.coordinate_type.lock().unwrap();
    let coordinate = match coordinate_type {
        RustCoordinateType::Absolute => Coordinate::Abs,
        RustCoordinateType::Relative => Coordinate::Rel,
    };
    let jitter = position.jitter_px.load(Ordering::Relaxed).min(1000) as i32;
    let display = position.display.lock().unwrap().clone();

    match mode {
        RustPositionMode::Cursor => Some(ClickTarget::Cursor),
        RustPositionMode::Fixed => {
            let x = position.target_x.load(Ordering::Relaxed);
            let y = position.target_y.load(Ordering::Relaxed);
            Some(target(x, y, coordinate, jitter, 0, &display))
        }
        RustPositionMode::Sequence => {
            let points = position.sequence_points.lock().unwrap();
            if points.is_empty() {
                return None;
            }
            let index = session.sequence_index % points.len();
            let point = &points[index];
            session.sequence_index = (index + 1) % points.len();
            Some(target(
                point.x,
                point.y,
                coordinate,
                jitter,
                point.dwell,
                &display,
            ))
        }
    }
}

pub(super) fn move_to(enigo: &mut Enigo, target: ClickTarget) {
    if let ClickTarget::Move {
        x, y, coordinate, ..
    } = target
    {
        let _ = enigo.move_mouse(x, y, coordinate);
    }
}

fn target(
    x: i32,
    y: i32,
    coordinate: Coordinate,
    jitter: i32,
    dwell_ms: u32,
    display: &DisplayInfo,
) -> ClickTarget {
    let (x, y) = coordinates::apply(x, y, coordinate, jitter, display);
    ClickTarget::Move {
        x,
        y,
        coordinate,
        dwell: Duration::from_millis(dwell_ms as u64),
    }
}
