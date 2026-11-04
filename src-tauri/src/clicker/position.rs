//! Click target settings (fixed point, sequence, jitter, selected display).
//! Frontend mirror: frontend-src/types/clicker-types.ts
use crate::clicker::display::DisplayInfo;
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicI32, AtomicU32};
use std::sync::{Arc, Mutex};

/// Click at the cursor, at a fixed point, or walk through a sequence.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum PositionMode {
    Cursor,
    Fixed,
    Sequence,
}

/// Absolute (screen position) or relative (offset from the cursor).
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum CoordinateType {
    Absolute,
    Relative,
}

/// One step of a sequence: where to click and how long to wait afterwards (ms).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SequencePoint {
    pub id: String,
    pub x: i32,
    pub y: i32,
    pub dwell: u32,
}

/// Size of the selected display in pixels.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreenSize {
    pub width: u32,
    pub height: u32,
}

/// Live position settings shared with the click thread.
#[derive(Clone)]
pub struct PositionSettings {
    pub(crate) mode: Arc<Mutex<PositionMode>>,
    pub(crate) coordinate_type: Arc<Mutex<CoordinateType>>,
    pub(crate) target_x: Arc<AtomicI32>,
    pub(crate) target_y: Arc<AtomicI32>,
    pub(crate) jitter_px: Arc<AtomicU32>,
    pub(crate) sequence_points: Arc<Mutex<Vec<SequencePoint>>>,
    pub(crate) display: Arc<Mutex<DisplayInfo>>,
}

impl PositionSettings {
    /// Default position settings.
    pub fn new() -> Self {
        Self {
            mode: Arc::new(Mutex::new(PositionMode::Cursor)),
            coordinate_type: Arc::new(Mutex::new(CoordinateType::Absolute)),
            target_x: Arc::new(AtomicI32::new(960)),
            target_y: Arc::new(AtomicI32::new(540)),
            jitter_px: Arc::new(AtomicU32::new(2)),
            sequence_points: Arc::new(Mutex::new(vec![
                SequencePoint {
                    id: "1".into(),
                    x: 412,
                    y: 288,
                    dwell: 40,
                },
                SequencePoint {
                    id: "2".into(),
                    x: 1280,
                    y: 420,
                    dwell: 40,
                },
                SequencePoint {
                    id: "3".into(),
                    x: 960,
                    y: 780,
                    dwell: 120,
                },
            ])),
            display: Arc::new(Mutex::new(DisplayInfo::fallback_primary())),
        }
    }
}
