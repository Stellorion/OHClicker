//! A profile is the JSON file that stores every setting (Import / Export / Link).
//! Frontend mirror: frontend-src/types/profile-types.ts (`ConfigProfile`).
//!
//! | file          | purpose                                            |
//! |---------------|----------------------------------------------------|
//! | `error.rs`    | `ProfileError` shown to the user in a dialog       |
//! | `fields.rs`   | list of required JSON keys                         |
//! | `parse.rs`    | JSON text -> `ConfigProfile` (syntax + shape)      |
//! | `validate.rs` | range / consistency checks                         |
//! | `file.rs`     | reads a profile file from disk                     |
//! | `apply.rs`    | applies a profile to the running app               |
//! | `linked.rs`   | `LinkedProfile` data (same name in the frontend)   |
//! | `link.rs`     | link / unlink / auto-load on startup               |
//! | `reveal.rs`   | "show in folder" for the linked file               |
mod apply;
mod error;
mod fields;
mod file;
mod link;
mod linked;
mod parse;
mod reveal;
mod validate;

pub use apply::{apply_profile_to_app, ensure_stopped};
pub use error::{ProfileError, ProfileErrorKind};
pub use file::read_profile_file;
pub use link::{link_profile_file, load_on_startup, unlink_profile_file};
pub use linked::LinkedProfile;
pub use parse::parse_profile;
pub use reveal::reveal_in_file_manager;

use crate::clicker::position::{CoordinateType, PositionMode, SequencePoint};
use crate::clicker::state::{ClickType, MouseButton, RegionMode, RepeatType};
use serde::{Deserialize, Serialize};

/// Every user setting. JSON keys are camelCase and identical to the
/// frontend `ConfigProfile` interface.
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ConfigProfile {
    pub cps: u32,
    pub interval_randomization_pct: u32,
    pub button_hold_ms: u32,
    pub start_delay_ms: u32,
    pub mouse_button: MouseButton,
    pub click_type: ClickType,
    pub repeat_type: RepeatType,
    pub fixed_count_limit: u32,
    pub max_duration_enabled: bool,
    pub max_duration_sec: u32,
    pub boundaries_enabled: bool,
    pub region_mode: RegionMode,
    /// Window followed by "Choose window" (found again by title; old files may lack it).
    #[serde(default)]
    pub boundary_window_title: String,
    pub boundary_x: i32,
    pub boundary_y: i32,
    pub boundary_width: u32,
    pub boundary_height: u32,
    pub stop_when_cursor_leaves: bool,
    pub position_mode: PositionMode,
    pub coordinate_type: CoordinateType,
    pub target_x: i32,
    pub target_y: i32,
    pub jitter_px: u32,
    pub sequence_points: Vec<SequencePoint>,
    pub start_stop_hotkey: String,
    pub toggle_overlay_hotkey: String,
}
