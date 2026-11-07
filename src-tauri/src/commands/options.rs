//! Tauri commands for the Options section (frontend: services/optionsService.ts).
use crate::app_settings::{self, AppOptions};
use crate::app_state::AppState;
use crate::tray;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, State};

/// Current options, read once by the frontend on startup.
#[tauri::command]
pub fn get_app_options(state: State<'_, AppState>) -> AppOptions {
    AppOptions { keep_in_tray: state.keep_in_tray.load(Ordering::SeqCst) }
}

/// Turns "Keep in system tray" on/off: saves it and shows/hides the tray icon.
#[tauri::command]
pub fn set_keep_in_tray(
    app: AppHandle,
    state: State<'_, AppState>,
    enabled: bool,
) -> Result<(), String> {
    let mut settings = app_settings::load(&app);
    settings.keep_in_tray = enabled;
    app_settings::save(&app, &settings)?;
    state.keep_in_tray.store(enabled, Ordering::SeqCst);
    tray::set_visible(&app, enabled).map_err(|e| e.to_string())
}
