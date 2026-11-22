//! Registers every Tauri plugin (each plugin may only be added once).
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_window_state::{Builder as WindowState, StateFlags};

/// Command-line flag the OS passes when it starts the app at login
/// (Options -> "Open on startup"). startup.rs checks for it.
pub const AUTOSTART_FLAG: &str = "--autostart";

/// Windows placed by our own code: the window-state plugin must not restore them.
const OWN_PLACED_WINDOWS: [&str; 4] = [
    "position-overlay",
    "boundary-overlay",
    "status-indicator",
    "status-toast",
];

pub fn add_plugins(builder: tauri::Builder<tauri::Wry>) -> tauri::Builder<tauri::Wry> {
    builder
        // Must be registered first! A second launch just shows the running window.
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            crate::tray::show_main_window(app);
        }))
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(
            WindowState::default()
                .with_denylist(&OWN_PLACED_WINDOWS)
                .with_state_flags(StateFlags::SIZE | StateFlags::POSITION | StateFlags::MAXIMIZED)
                .build(),
        )
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![AUTOSTART_FLAG]),
        ))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
}
