//! Start-up work used by lib.rs: plugins and the one-time `setup`.
use crate::app_state::AppState;
use crate::{app_settings, clicker, tray};
use std::sync::atomic::Ordering;
use tauri::Manager;
use tauri_plugin_window_state::{Builder as WindowState, StateFlags};

/// Registers every Tauri plugin (each plugin may only be added once).
pub fn add_plugins(builder: tauri::Builder<tauri::Wry>) -> tauri::Builder<tauri::Wry> {
    builder
        // Must be registered first!
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            use tauri::Manager;

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(
            WindowState::default()
                .with_denylist(&["position-overlay", "boundary-overlay"])
                .with_state_flags(StateFlags::SIZE | StateFlags::POSITION | StateFlags::MAXIMIZED)
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
}

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
    select_primary_display(app, &state);
    clicker::hotkeys::apply_hotkeys(handle, &state, "F6", "F7")?;
    clicker::profile::load_on_startup(handle, &state);
    let options = app_settings::load(handle);
    state
        .keep_in_tray
        .store(options.keep_in_tray, Ordering::SeqCst);

    // 2) Engine, overlay windows and the tray icon (only visible when the option is on).
    clicker::service::start_engine(handle.clone(), state.clicker.clone());
    clicker::overlay::create_window(handle, &state)?;
    clicker::overlay::create_boundary_window(handle, &state)?;
    clicker::overlay::spawn_z_order_sync(handle.clone());
    tray::create(handle, options.keep_in_tray)?;

    // 3) Tell the frontend it can read the saved state now.
    state.setup_done.store(true, Ordering::SeqCst);
    Ok(())
}
