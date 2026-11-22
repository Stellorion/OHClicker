//! Tauri commands for the Options section (frontend: services/optionsService.ts).
use crate::app_settings::{self, AppOptions};
use crate::app_state::AppState;
use crate::tray;
use std::sync::atomic::Ordering;
use tauri::{AppHandle, State};
use tauri_plugin_autostart::ManagerExt;

/// True once the backend finished its start-up work. The frontend waits for this
/// before it reads the saved options and the linked profile (see hooks/useStartup.ts).
#[tauri::command]
pub fn is_backend_ready(state: State<'_, AppState>) -> bool {
    state.setup_done.load(Ordering::SeqCst)
}

/// Current options, read once by the frontend on startup.
/// "Open on startup" is asked from the OS, so it is right even if the user changed it
/// outside the app (e.g. in Windows Task Manager -> Startup).
#[tauri::command]
pub fn get_app_options(app: AppHandle, state: State<'_, AppState>) -> AppOptions {
    AppOptions {
        keep_in_tray: state.keep_in_tray.load(Ordering::SeqCst),
        open_on_startup: app.autolaunch().is_enabled().unwrap_or(false),
    }
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

/// Turns "Open on startup" on/off (registers/removes the app in the OS startup list).
#[tauri::command]
pub fn set_open_on_startup(app: AppHandle, enabled: bool) -> Result<(), String> {
    let launcher = app.autolaunch();
    // `disable` fails when there is nothing to remove, so only call it when enabled.
    let result = if enabled {
        launcher.enable()
    } else if launcher.is_enabled().unwrap_or(false) {
        launcher.disable()
    } else {
        Ok(())
    };
    result.map_err(|e| e.to_string())
}
