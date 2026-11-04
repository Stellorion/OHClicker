//! App entry point: registers plugins, state, commands and startup work.
//!
//! Layout:  app_state/   shared state          app_settings.rs  saved-on-disk settings
//!          clicker/     engine + overlays     commands/        functions the UI invokes
mod app_settings;
mod app_state;
mod clicker;
mod commands;

use tauri::Manager;

/// Picks the primary monitor as the initial "selected display".
fn select_primary_display(app: &tauri::App, state: &app_state::AppState) {
    let Some(main_window) = app.get_webview_window("main") else {
        return;
    };
    if let Ok(displays) = clicker::service::available_displays(&main_window) {
        if let Some(primary) = displays.iter().find(|d| d.is_primary).or_else(|| displays.first()) {
            clicker::service::update_selected_display(&state.clicker, primary.clone());
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(app_state::AppState::new())
        .invoke_handler(tauri::generate_handler![
            // click engine settings
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
            // target position
            commands::position::update_position_mode,
            commands::position::update_coordinate_type,
            commands::position::update_target_position,
            commands::position::update_position_jitter,
            commands::position::update_sequence_points,
            // displays
            commands::displays::get_displays,
            commands::displays::select_display,
            commands::displays::get_screen_size,
            // position overlay / picker
            commands::overlay::begin_position_pick,
            commands::overlay::complete_position_pick,
            commands::overlay::toggle_position_overlay,
            commands::overlay::get_position_overlay_state,
            // hotkeys
            commands::hotkeys::update_start_stop_hotkey,
            commands::hotkeys::update_pick_position_hotkey,
            commands::hotkeys::update_toggle_overlay_hotkey,
            // boundaries
            commands::boundaries::set_boundaries_enabled,
            commands::boundaries::set_region_mode,
            commands::boundaries::update_boundary_rect,
            commands::boundaries::set_stop_when_cursor_leaves,
            commands::boundaries::get_boundary_overlay_state,
            // profile files
            commands::profile::export::export_profile,
            commands::profile::import::import_profile,
            commands::profile::link::link_profile,
            commands::profile::link::unlink_profile,
            commands::profile::link::get_linked_profile,
            commands::profile::link::reveal_linked_profile,
        ])
        .setup(move |app| {
            let state = app.state::<app_state::AppState>();
            select_primary_display(app, &state);
            clicker::service::start_engine(app.handle().clone(), state.clicker.clone());
            clicker::overlay::create_window(app.handle(), &state)?;
            clicker::overlay::create_boundary_window(app.handle(), &state)?;

            // Default hotkeys; a linked profile may replace them right below.
            clicker::hotkeys::apply_hotkeys(app.handle(), &state, "F6", "F7", "F8")?;
            clicker::profile::load_on_startup(app.handle(), &state);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
