//! Data describing the "linked profile" row in the Files section.
//! Frontend mirror: `LinkedProfile` / `LinkStatus` in frontend-src/types/profile-types.ts.
use super::{ConfigProfile, ProfileError};
use serde::Serialize;
use std::path::Path;

#[derive(Serialize, Debug, Clone, Copy, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum LinkStatus {
    Unlinked, // nothing linked
    Loaded,   // file was read and applied
    Missing,  // linked file no longer exists
    Invalid,  // file exists but could not be loaded (see `error`)
}

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LinkedProfile {
    pub path: Option<String>,
    pub status: LinkStatus,
    pub error: Option<ProfileError>,
    /// The loaded settings, so the frontend can fill its store on startup.
    pub profile: Option<ConfigProfile>,
}

impl LinkedProfile {
    fn new(path: Option<&Path>, status: LinkStatus) -> Self {
        Self {
            path: path.map(|p| p.to_string_lossy().into_owned()),
            status,
            error: None,
            profile: None,
        }
    }

    /// No file linked.
    pub fn unlinked() -> Self {
        Self::new(None, LinkStatus::Unlinked)
    }

    /// File linked and applied successfully.
    pub fn loaded(path: &Path, profile: ConfigProfile) -> Self {
        Self {
            profile: Some(profile),
            ..Self::new(Some(path), LinkStatus::Loaded)
        }
    }

    /// The link is remembered but the file was moved or deleted.
    pub fn missing(path: &Path) -> Self {
        Self::new(Some(path), LinkStatus::Missing)
    }

    /// The file exists but could not be read, parsed or applied.
    pub fn invalid(path: &Path, error: ProfileError) -> Self {
        Self {
            error: Some(error),
            ..Self::new(Some(path), LinkStatus::Invalid)
        }
    }
}
