//! Error type sent to the frontend. Frontend mirror: `ProfileError` in
//! frontend-src/types/profile-types.ts (the dialog title is chosen from `kind`).
use serde::Serialize;

#[derive(Serialize, Debug, Clone, Copy, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ProfileErrorKind {
    Read,          // file could not be opened / read
    Write,         // file or settings could not be written
    Busy,          // clicker is running, profile can't be changed
    InvalidJson,   // not valid JSON text
    WrongFormat,   // valid JSON but not a profile (missing fields / wrong types)
    InvalidValues, // right shape but values out of range
    Hotkey,        // hotkeys invalid or already used by another app
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProfileError {
    pub kind: ProfileErrorKind,
    /// One-sentence explanation for the user.
    pub message: String,
    /// Technical lines (line/column, missing fields, ...), shown as a list.
    pub details: Vec<String>,
}

impl ProfileError {
    /// Builds an error with an optional list of detail lines.
    pub fn new(kind: ProfileErrorKind, message: impl Into<String>, details: Vec<String>) -> Self {
        Self { kind, message: message.into(), details }
    }
}
