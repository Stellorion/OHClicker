//! One physical monitor. Frontend mirror: `DisplayInfo` in frontend-src/types/display-types.ts
use serde::{Deserialize, Serialize};
use tauri::Monitor;

/// Monitor geometry in physical pixels; origin is relative to the primary display.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct DisplayInfo {
    pub id: String,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub origin_x: i32,
    pub origin_y: i32,
    pub scale_factor: f64,
    pub is_primary: bool,
}

impl DisplayInfo {
    /// Builds the info from a Tauri monitor (the id encodes position and size).
    pub fn from_monitor(monitor: &Monitor, is_primary: bool) -> Self {
        let size = *monitor.size();
        let position = *monitor.position();
        let name = monitor
            .name()
            .cloned()
            .unwrap_or_else(|| format!("Display at {},{}", position.x, position.y));
        let id = format!(
            "{}:{}:{}x{}",
            position.x, position.y, size.width, size.height
        );
        Self {
            id,
            name,
            width: size.width,
            height: size.height,
            origin_x: position.x,
            origin_y: position.y,
            scale_factor: monitor.scale_factor(),
            is_primary,
        }
    }

    /// 1920x1080 placeholder used until the real displays are read.
    pub fn fallback_primary() -> Self {
        Self {
            id: "primary".to_string(),
            name: "Primary display".to_string(),
            width: 1920,
            height: 1080,
            origin_x: 0,
            origin_y: 0,
            scale_factor: 1.0,
            is_primary: true,
        }
    }
}
