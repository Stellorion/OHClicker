mod app_state;
mod clicker;
mod commands;

use tauri::{Emitter, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut, ShortcutState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(app_state::AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::clicker::toggle_clicker,
            commands::clicker::update_cps,
            commands::clicker::update_interval_randomization_pct,
            commands::clicker::update_button_hold_ms,
            commands::clicker::update_start_delay_ms,
            commands::clicker::update_mouse_button,
            commands::clicker::update_click_type,
            commands::clicker::update_repeat_type,
            commands::clicker::update_fixed_count_limit,
            commands::clicker::update_max_duration_enabled,
            commands::clicker::update_max_duration_sec
        ])
        .setup(move |app| {
            let state = app.state::<app_state::AppState>();
            clicker::service::start_engine(app.handle().clone(), state.clicker.clone());

            let toggle_shortcut = Shortcut::new(None, Code::F6);

            app.global_shortcut()
                .on_shortcut(toggle_shortcut, move |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let state = app.state::<app_state::AppState>();
                        let running = clicker::service::toggle(&state);
                        let _ = app.emit("clicker-state-changed", running);
                    }
                })?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
