//! The list of every command the frontend can call.
//! Add a new command here (and in its file) so it can be `invoke`d.
macro_rules! all_commands {
    () => {
        tauri::generate_handler![
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
            commands::boundaries::list_windows,
            commands::boundaries::set_boundary_window,
            // options (system tray)
            commands::options::get_app_options,
            commands::options::set_keep_in_tray,
            // profile files
            commands::profile::export::export_profile,
            commands::profile::import::import_profile,
            commands::profile::link::link_profile,
            commands::profile::link::unlink_profile,
            commands::profile::link::get_linked_profile,
            commands::profile::link::reveal_linked_profile,
        ]
    };
}
pub(crate) use all_commands;
