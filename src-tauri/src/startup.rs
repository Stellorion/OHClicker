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
pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let state = app.state::<AppState>();
    select_primary_display(app, &state);
    clicker::service::start_engine(app.handle().clone(), state.clicker.clone());
    clicker::overlay::create_window(app.handle(), &state)?;
    clicker::overlay::create_boundary_window(app.handle(), &state)?;
    clicker::overlay::spawn_z_order_sync(app.handle().clone());

    // Default hotkeys; a linked profile may replace them right below.
    clicker::hotkeys::apply_hotkeys(app.handle(), &state, "F6", "F7")?;
    clicker::profile::load_on_startup(app.handle(), &state);

    // Options saved in settings.json: the tray icon only shows when enabled.
    let options = app_settings::load(app.handle());
    state
        .keep_in_tray
        .store(options.keep_in_tray, Ordering::SeqCst);
    tray::create(app.handle(), options.keep_in_tray)?;
    Ok(())
}
