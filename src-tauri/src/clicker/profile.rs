use crate::clicker::{
    position::{RustCoordinateType, RustPositionMode, RustSequencePoint},
    state::{RustClickType, RustMouseButton, RustRegionMode, RustRepeatType},
};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use tauri_plugin_global_shortcut::Shortcut;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ConfigProfile {
    pub cps: u32,
    pub interval_randomization_pct: u32,
    pub button_hold_ms: u32,
    pub start_delay_ms: u32,
    pub mouse_button: RustMouseButton,
    pub click_type: RustClickType,
    pub repeat_type: RustRepeatType,
    pub fixed_count_limit: u32,
    pub max_duration_enabled: bool,
    pub max_duration_sec: u32,
    pub boundaries_enabled: bool,
    pub region_mode: RustRegionMode,
    pub boundary_x: i32,
    pub boundary_y: i32,
    pub boundary_width: u32,
    pub boundary_height: u32,
    pub stop_when_cursor_leaves: bool,
    pub position_mode: RustPositionMode,
    pub coordinate_type: RustCoordinateType,
    pub target_x: i32,
    pub target_y: i32,
    pub jitter_px: u32,
    pub sequence_points: Vec<RustSequencePoint>,
    pub start_stop_hotkey: String,
    pub pick_position_hotkey: String,
    pub toggle_overlay_hotkey: String,
}

/// Every key a profile must contain (keep in sync with `ConfigProfile`).
/// Used to report *all* missing keys at once instead of just the first one.
const REQUIRED_FIELDS: &[&str] = &[
    "cps",
    "intervalRandomizationPct",
    "buttonHoldMs",
    "startDelayMs",
    "mouseButton",
    "clickType",
    "repeatType",
    "fixedCountLimit",
    "maxDurationEnabled",
    "maxDurationSec",
    "boundariesEnabled",
    "regionMode",
    "boundaryX",
    "boundaryY",
    "boundaryWidth",
    "boundaryHeight",
    "stopWhenCursorLeaves",
    "positionMode",
    "coordinateType",
    "targetX",
    "targetY",
    "jitterPx",
    "sequencePoints",
    "startStopHotkey",
    "pickPositionHotkey",
    "toggleOverlayHotkey",
];

#[derive(Serialize, Debug, Clone, Copy, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ProfileErrorKind {
    Read,
    Write,
    Busy,
    InvalidJson,
    WrongFormat,
    InvalidValues,
    Hotkey,
}

/// Error returned to the frontend so it can show a meaningful dialog.
#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileError {
    pub kind: ProfileErrorKind,
    pub message: String,
    pub details: Vec<String>,
}

impl ProfileError {
    pub fn new(kind: ProfileErrorKind, message: impl Into<String>, details: Vec<String>) -> Self {
        Self {
            kind,
            message: message.into(),
            details,
        }
    }
}

fn json_type_name(value: &serde_json::Value) -> &'static str {
    match value {
        serde_json::Value::Null => "null",
        serde_json::Value::Bool(_) => "a boolean",
        serde_json::Value::Number(_) => "a number",
        serde_json::Value::String(_) => "a string",
        serde_json::Value::Array(_) => "an array",
        serde_json::Value::Object(_) => "an object",
    }
}

/// Parse and fully validate profile JSON. Nothing is applied here.
pub fn parse_profile(text: &str) -> Result<ConfigProfile, ProfileError> {
    // Editors on Windows sometimes prepend a BOM, which serde_json rejects.
    let text = text.trim_start_matches('\u{feff}');

    let value: serde_json::Value = serde_json::from_str(text).map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::InvalidJson,
            "This file is not valid JSON, so it can't be imported.",
            vec![e.to_string()],
        )
    })?;

    let object = value.as_object().ok_or_else(|| {
        ProfileError::new(
            ProfileErrorKind::WrongFormat,
            "This JSON doesn't look like an autoclicker profile.",
            vec![format!(
                "Expected an object at the top level but found {}.",
                json_type_name(&value)
            )],
        )
    })?;

    let missing: Vec<String> = REQUIRED_FIELDS
        .iter()
        .filter(|field| !object.contains_key(**field))
        .map(|field| format!("Missing field: \"{field}\""))
        .collect();
    if !missing.is_empty() {
        return Err(ProfileError::new(
            ProfileErrorKind::WrongFormat,
            "This JSON doesn't match the profile format. Some settings are missing.",
            missing,
        ));
    }

    let profile: ConfigProfile = serde_json::from_value(value).map_err(|e| {
        ProfileError::new(
            ProfileErrorKind::WrongFormat,
            "This JSON doesn't match the profile format. A setting has the wrong type or an unknown value.",
            vec![e.to_string()],
        )
    })?;

    let problems = profile.validate();
    if !problems.is_empty() {
        return Err(ProfileError::new(
            ProfileErrorKind::InvalidValues,
            "The profile contains values that are out of range or invalid.",
            problems,
        ));
    }
    Ok(profile)
}

fn check_range(problems: &mut Vec<String>, name: &str, value: u32, min: u32, max: u32) {
    if value < min || value > max {
        problems.push(format!(
            "{name} must be between {min} and {max} (found {value})"
        ));
    }
}

impl ConfigProfile {
    /// Range/consistency checks. Limits match the sliders and inputs in the UI.
    pub fn validate(&self) -> Vec<String> {
        let mut problems = Vec::new();

        check_range(&mut problems, "cps", self.cps, 1, 100);
        check_range(
            &mut problems,
            "intervalRandomizationPct",
            self.interval_randomization_pct,
            0,
            50,
        );
        check_range(&mut problems, "buttonHoldMs", self.button_hold_ms, 0, 1000);
        check_range(
            &mut problems,
            "startDelayMs",
            self.start_delay_ms,
            0,
            60_000,
        );
        check_range(&mut problems, "jitterPx", self.jitter_px, 0, 50);
        if self.fixed_count_limit < 1 {
            problems.push("fixedCountLimit must be at least 1".to_string());
        }
        if self.max_duration_sec < 1 {
            problems.push("maxDurationSec must be at least 1".to_string());
        }
        if self.boundary_width < 1 || self.boundary_height < 1 {
            problems.push("boundaryWidth and boundaryHeight must be at least 1".to_string());
        }

        let mut seen = HashSet::new();
        for (index, point) in self.sequence_points.iter().enumerate() {
            if point.id.trim().is_empty() {
                problems.push(format!("sequencePoints[{index}] has an empty id"));
            } else if !seen.insert(point.id.clone()) {
                problems.push(format!(
                    "sequencePoints[{index}] reuses the id \"{}\"",
                    point.id
                ));
            }
        }
        if self.position_mode == RustPositionMode::Sequence && self.sequence_points.is_empty() {
            problems.push("positionMode is \"sequence\" but sequencePoints is empty".to_string());
        }

        let hotkeys = [
            ("startStopHotkey", &self.start_stop_hotkey),
            ("pickPositionHotkey", &self.pick_position_hotkey),
            ("toggleOverlayHotkey", &self.toggle_overlay_hotkey),
        ];
        let mut parsed: Vec<(&str, &str, Shortcut)> = Vec::new();
        for (name, key) in hotkeys {
            match key.parse::<Shortcut>() {
                Ok(shortcut) => parsed.push((name, key.as_str(), shortcut)),
                Err(_) => problems.push(format!("{name} \"{key}\" is not a valid shortcut")),
            }
        }
        for i in 0..parsed.len() {
            for j in (i + 1)..parsed.len() {
                if parsed[i].2 == parsed[j].2 {
                    problems.push(format!(
                        "{} and {} use the same shortcut (\"{}\")",
                        parsed[i].0, parsed[j].0, parsed[i].1
                    ));
                }
            }
        }

        problems
    }
}
