//! One-time `setup` that runs when the app starts (plugins are in plugins.rs).
use crate::app_state::AppState;
use crate::plugins::AUTOSTART_FLAG;
use crate::{app_settings, clicker, status, tray};
use std::sync::atomic::Ordering;
use tauri::Manager;

/// Picks the primary monitor as the initial "selected display".
fn select_primary_display(app: &tauri::App, state: &AppState) {
    let Some(main_window) = app.get_webview_window("main") else {
        return;
    };
    if let Ok(displays) = clicker::service::available_displays(&main_window) {
        let primary = displays
            .iter()
            .find(|d| d.is_primary)
            .or_else(|| displays.first());
        if let Some(primary) = primary {
            clicker::service::update_selected_display(&state.clicker, primary.clone());
        }
    }
}

/// Runs once when the app starts.
///
/// ORDER MATTERS: creating a window (overlays, tray) runs a nested message loop on
/// Windows, and in that loop the main window's first `invoke` calls are already
/// answered. So everything the UI reads on startup (hotkeys, linked profile, saved
/// options) is loaded BEFORE any window is created.
pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let state = app.state::<AppState>();
    let handle = app.handle();

    // 1) Saved state. A linked profile may replace the default hotkeys.
    let options = app_settings::load(handle);
    state
        .keep_in_tray
        .store(options.keep_in_tray, Ordering::SeqCst);
    // Started by the OS at login with the tray option on: stay hidden in the tray
    // (opening the app again, or the tray icon, shows the window).
    let at_login = std::env::args().any(|arg| arg == AUTOSTART_FLAG);
    tray::set_main_window_visible(handle, !(at_login && options.keep_in_tray));
    select_primary_display(app, &state);
    clicker::hotkeys::apply_hotkeys(handle, &state, "F6", "F7")?;
    clicker::profile::load_on_startup(handle, &state);

    // 2) Engine, overlay + status windows and the tray icon (only visible when enabled).
    clicker::service::start_engine(handle.clone(), state.clicker.clone());
    clicker::overlay::create_window(handle, &state)?;
    clicker::overlay::create_boundary_window(handle, &state)?;
    clicker::overlay::spawn_z_order_sync(handle.clone());
    status::create_windows(handle, &state)?;
    status::spawn_indicator_sync(handle.clone());
    tray::create(handle, options.keep_in_tray)?;

    // 3) Tell the frontend it can read the saved state now.
    state.setup_done.store(true, Ordering::SeqCst);
    Ok(())
}
