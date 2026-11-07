//! Range and consistency checks for a parsed profile.
//! The limits match the sliders / inputs in the UI (frontend-src/components/autoclicker).
use super::ConfigProfile;
use crate::clicker::position::PositionMode;
use std::collections::HashSet;
use tauri_plugin_global_shortcut::Shortcut;

/// Pushes a message when `value` is outside `min..=max`.
fn check_range(problems: &mut Vec<String>, name: &str, value: u32, min: u32, max: u32) {
    if value < min || value > max {
        problems.push(format!(
            "{name} must be between {min} and {max} (found {value})"
        ));
    }
}

impl ConfigProfile {
    /// Returns every problem found (empty = profile is valid).
    pub fn validate(&self) -> Vec<String> {
        let mut problems = Vec::new();
        self.check_numbers(&mut problems);
        self.check_sequence(&mut problems);
        self.check_hotkeys(&mut problems);
        problems
    }

    /// Timing, limits and boundary numbers.
    fn check_numbers(&self, problems: &mut Vec<String>) {
        check_range(problems, "cps", self.cps, 1, 100);
        check_range(
            problems,
            "intervalRandomizationPct",
            self.interval_randomization_pct,
            0,
            50,
        );
        check_range(problems, "buttonHoldMs", self.button_hold_ms, 0, 1000);
        check_range(problems, "startDelayMs", self.start_delay_ms, 0, 60_000);
        check_range(problems, "jitterPx", self.jitter_px, 0, 50);
        if self.fixed_count_limit < 1 {
            problems.push("fixedCountLimit must be at least 1".to_string());
        }
        if self.max_duration_sec < 1 {
            problems.push("maxDurationSec must be at least 1".to_string());
        }
        if self.boundary_width < 1 || self.boundary_height < 1 {
            problems.push("boundaryWidth and boundaryHeight must be at least 1".to_string());
        }
    }

    /// Sequence point ids must be unique; sequence mode needs at least one point.
    fn check_sequence(&self, problems: &mut Vec<String>) {
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
        if self.position_mode == PositionMode::Sequence && self.sequence_points.is_empty() {
            problems.push("positionMode is \"sequence\" but sequencePoints is empty".to_string());
        }
    }

    /// Each hotkey must be a valid shortcut and no two may be the same.
    fn check_hotkeys(&self, problems: &mut Vec<String>) {
        let hotkeys = [
            ("startStopHotkey", &self.start_stop_hotkey),
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
    }
}
