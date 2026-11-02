use serde::{Deserialize, Serialize};
use crate::clicker::display::DisplayInfo;
use std::sync::atomic::{AtomicI32, AtomicU32};
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RustPositionMode {
    Cursor,
    Fixed,
    Sequence,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RustCoordinateType {
    Absolute,
    Relative,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RustSequencePoint {
    pub id: String,
    pub x: i32,
    pub y: i32,
    pub dwell: u32,
}

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreenPoint {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreenSize {
    pub width: u32,
    pub height: u32,
}

#[derive(Clone)]
pub struct PositionSettings {
    pub(crate) mode: Arc<Mutex<RustPositionMode>>,
    pub(crate) coordinate_type: Arc<Mutex<RustCoordinateType>>,
    pub(crate) target_x: Arc<AtomicI32>,
    pub(crate) target_y: Arc<AtomicI32>,
    pub(crate) jitter_px: Arc<AtomicU32>,
    pub(crate) sequence_points: Arc<Mutex<Vec<RustSequencePoint>>>,
    pub(crate) display: Arc<Mutex<DisplayInfo>>,
}

impl PositionSettings {
    pub fn new() -> Self {
        Self {
            mode: Arc::new(Mutex::new(RustPositionMode::Cursor)),
            coordinate_type: Arc::new(Mutex::new(RustCoordinateType::Absolute)),
            target_x: Arc::new(AtomicI32::new(960)),
            target_y: Arc::new(AtomicI32::new(540)),
            jitter_px: Arc::new(AtomicU32::new(2)),
            sequence_points: Arc::new(Mutex::new(vec![
                RustSequencePoint {
                    id: "1".into(),
                    x: 412,
                    y: 288,
                    dwell: 40,
                },
                RustSequencePoint {
                    id: "2".into(),
                    x: 1280,
                    y: 420,
                    dwell: 40,
                },
                RustSequencePoint {
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
