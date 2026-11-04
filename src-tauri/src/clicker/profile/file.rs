//! Reads a profile file from disk and parses it.
use super::{parse_profile, ConfigProfile, ProfileError, ProfileErrorKind};
use std::path::Path;

/// Profiles are tiny; anything bigger is certainly not one.
const MAX_PROFILE_BYTES: u64 = 1024 * 1024;

/// Reads, size-checks, decodes (UTF-8) and parses the file at `path`.
pub fn read_profile_file(path: &Path) -> Result<ConfigProfile, ProfileError> {
    let read_error = |e: std::io::Error| {
        let message = "Couldn't read the selected file.";
        ProfileError::new(ProfileErrorKind::Read, message, vec![format!("{}: {e}", path.display())])
    };

    let size = std::fs::metadata(path).map_err(read_error)?.len();
    if size > MAX_PROFILE_BYTES {
        return Err(ProfileError::new(
            ProfileErrorKind::WrongFormat,
            "This file is too large to be an autoclicker profile.",
            vec![format!("{size} bytes (limit is {MAX_PROFILE_BYTES})")],
        ));
    }

    let bytes = std::fs::read(path).map_err(read_error)?;
    let text = String::from_utf8(bytes).map_err(|_| {
        let message = "This file isn't a text file, so it can't be a JSON profile.";
        ProfileError::new(ProfileErrorKind::InvalidJson, message, vec![])
    })?;
    parse_profile(&text)
}
