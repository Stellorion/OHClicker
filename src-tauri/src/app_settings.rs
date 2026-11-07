//! Persistent app-level settings (survive closing and reopening the program).
//! Stored as `settings.json` in the OS app-config folder.
//! Frontend mirror: `AppOptions` in frontend-src/types/options-types.ts (see commands/options.rs).
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

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

/// Full path of `settings.json`.
fn settings_path(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_config_dir()
        .map(|dir| dir.join("settings.json"))
        .map_err(|e| format!("Couldn't find the app config folder: {e}"))
}

/// Reads the settings; a missing or broken file simply gives the defaults.
pub fn load(app: &AppHandle) -> AppSettings {
    settings_path(app)
        .ok()
        .and_then(|path| std::fs::read_to_string(path).ok())
        .and_then(|text| serde_json::from_str(&text).ok())
        .unwrap_or_default()
}

/// Writes the settings to disk (creates the folder when needed).
pub fn save(app: &AppHandle, settings: &AppSettings) -> Result<(), String> {
    let path = settings_path(app)?;
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    }
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    std::fs::write(&path, json).map_err(|e| format!("{}: {e}", path.display()))
}
