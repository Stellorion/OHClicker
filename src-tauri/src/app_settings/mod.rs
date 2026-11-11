//! Persistent app-level settings (survive closing and reopening the program, and
//! restarting the PC). Stored as `settings.json`, in two folders (see files.rs).
//! Frontend mirror: `AppOptions` in frontend-src/types/options-types.ts (see commands/options.rs).
mod files;

use files::{locations, read_first_valid, write_atomic};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Default, Debug)]
#[serde(rename_all = "camelCase", default)]
pub struct AppSettings {
    /// Profile file that is loaded automatically on every start.
    pub linked_profile_path: Option<String>,
    /// Options section: closing the window hides it to the system tray.
    pub keep_in_tray: bool,
}

/// The options the UI can change (sent to the frontend by `get_app_options`).
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AppOptions {
    pub keep_in_tray: bool,
}

/// Reads the settings from the first good copy (defaults if there is none).
/// If only the second copy was good, the main copy is repaired right away.
pub fn load(app: &AppHandle) -> AppSettings {
    let found = read_first_valid(&locations(app), |text| serde_json::from_str(text).ok());
    match found {
        Some((settings, 0)) => settings,
        Some((settings, _)) => {
            let _ = save(app, &settings); // heal the missing/broken main copy
            settings
        }
        None => AppSettings::default(),
    }
}

/// Writes the settings to every location. One successful copy is enough.
pub fn save(app: &AppHandle, settings: &AppSettings) -> Result<(), String> {
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    let mut errors = Vec::new();
    let mut saved = 0;
    for path in locations(app) {
        match write_atomic(&path, &json) {
            Ok(()) => saved += 1,
            Err(e) => errors.push(e),
        }
    }
    if saved == 0 {
        return Err(errors.join("; "));
    }
    Ok(())
}
