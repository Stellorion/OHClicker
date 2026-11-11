//! Crash-safe reading and writing of `settings.json`.
//! The settings are kept in TWO places, so losing one copy does not lose the options:
//!   1. the app config folder      (e.g. %APPDATA%\<app identifier>)
//!   2. the app local-data folder  (e.g. %LOCALAPPDATA%\<app identifier>)
use std::fs::{self, File};
use std::io::{ErrorKind, Write};
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};
use tauri_plugin_log::log;

const FILE_NAME: &str = "settings.json";

/// Every place the settings are stored, main copy first.
pub fn locations(app: &AppHandle) -> Vec<PathBuf> {
    let paths = app.path();
    [paths.app_config_dir(), paths.app_local_data_dir()]
        .into_iter()
        .filter_map(Result::ok)
        .map(|dir| dir.join(FILE_NAME))
        .collect()
}

/// Writes `text` so a crash, power loss or PC restart can never leave a half-written
/// (empty) file: write a temp file, force it onto the disk, then rename it over the
/// real file. The rename is atomic, so the file is always either old or new, never broken.
pub fn write_atomic(path: &Path, text: &str) -> Result<(), String> {
    let fail = |e: std::io::Error| format!("{}: {e}", path.display());
    if let Some(folder) = path.parent() {
        fs::create_dir_all(folder).map_err(fail)?;
    }
    let temp = path.with_extension("json.tmp");
    let mut file = File::create(&temp).map_err(fail)?;
    file.write_all(text.as_bytes()).map_err(fail)?;
    file.sync_all().map_err(fail)?; // really on the disk before the rename
    drop(file);
    fs::rename(&temp, path).map_err(fail)
}

/// Returns the first copy that `parse` accepts, plus its index in `paths`
/// (0 = main copy). Missing or broken copies are skipped and logged.
pub fn read_first_valid<T>(
    paths: &[PathBuf],
    parse: impl Fn(&str) -> Option<T>,
) -> Option<(T, usize)> {
    for (index, path) in paths.iter().enumerate() {
        match fs::read_to_string(path) {
            Ok(text) => match parse(&text) {
                Some(value) => {
                    log::info!("settings loaded from {}", path.display());
                    return Some((value, index));
                }
                None => log::warn!("settings file is broken: {}", path.display()),
            },
            Err(e) if e.kind() == ErrorKind::NotFound => {}
            Err(e) => log::warn!("can't read {}: {e}", path.display()),
        }
    }
    None
}
