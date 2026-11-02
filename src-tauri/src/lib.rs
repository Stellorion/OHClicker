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
            commands::clicker::update_max_duration_sec,
            commands::position::update_position_mode,
            commands::position::update_coordinate_type,
            commands::position::update_target_position,
            commands::position::get_displays,
            commands::position::select_display,
            commands::position::update_position_jitter,
            commands::position::update_sequence_points,
            commands::position::get_screen_size,
            commands::position::begin_position_pick,
            commands::position::complete_position_pick,
            commands::position::toggle_position_overlay,
            commands::position::get_position_overlay_state
        ])
        .setup(move |app| {
            let state = app.state::<app_state::AppState>();
            if let Some(main_window) = app.get_webview_window("main") {
                if let Ok(displays) = clicker::service::available_displays(&main_window) {
                    if let Some(primary) = displays
                        .iter()
                        .find(|display| display.is_primary)
                        .or_else(|| displays.first())
                    {
                        clicker::service::update_selected_display(
                            &state.clicker,
                            primary.clone(),
                        );
                    }
                }
            }
            clicker::service::start_engine(app.handle().clone(), state.clicker.clone());
            clicker::overlay::create_window(app.handle(), &state)?;

            let toggle_shortcut = Shortcut::new(None, Code::F6);

            app.global_shortcut()
                .on_shortcut(toggle_shortcut, move |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let state = app.state::<app_state::AppState>();
                        let running = clicker::service::toggle(&state);
                        let _ = app.emit("clicker-state-changed", running);
                    }
                })?;

            let pick_shortcut = Shortcut::new(None, Code::F7);
            app.global_shortcut()
                .on_shortcut(pick_shortcut, move |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let state = app.state::<app_state::AppState>();
                        let _ = clicker::overlay::begin_pick(app, &state);
                    }
                })?;

            let overlay_shortcut = Shortcut::new(None, Code::F8);
            app.global_shortcut()
                .on_shortcut(overlay_shortcut, move |app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let state = app.state::<app_state::AppState>();
                        let _ = clicker::overlay::toggle(app, &state);
                    }
                })?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
