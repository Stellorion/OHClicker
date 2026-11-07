//! App entry point: wires plugins, state, commands, startup and the tray together.
//!
//! Layout:  startup.rs     plugins + one-time setup    commands/   functions the UI invokes
//!          app_state/     shared state                clicker/    engine, overlays, profiles
//!          app_settings.rs  settings saved on disk    tray/       system tray icon
mod app_settings;
mod app_state;
mod clicker;
mod commands;
mod startup;
mod tray;

use commands::registry::all_commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    startup::add_plugins(tauri::Builder::default())
        .manage(app_state::AppState::new())
        .invoke_handler(all_commands!())
        .setup(startup::setup)
        .on_window_event(tray::handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
