//! Tauri commands for profile files. Frontend: services/clickerService.ts (profile
//! section) and components/autoclicker/options/*.
pub mod export;
pub mod import;
pub mod link;

use crate::clicker::profile::{ProfileError, ProfileErrorKind};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

/// Opens the "choose a .json file" dialog. `Ok(None)` = the user cancelled.
pub(crate) fn pick_profile_path(app: &AppHandle) -> Result<Option<PathBuf>, ProfileError> {
    let Some(file) = app
        .dialog()
        .file()
        .add_filter("Autoclicker Profile", &["json"])
        .blocking_pick_file()
    else {
        return Ok(None);
    };
    file.into_path().map(Some).map_err(|e| {
        let message = "The selected file can't be used.";
        ProfileError::new(ProfileErrorKind::Read, message, vec![e.to_string()])
    })
}
