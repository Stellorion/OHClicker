use crate::app_state::AppState;
use crate::clicker;
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

fn register_shortcut<F>(
    app: &AppHandle,
    current_key_mutex: &std::sync::Mutex<String>,
    new_hotkey: String,
    action: F,
) -> Result<(), String>
where
    F: Fn(&AppHandle) + Send + Sync + 'static,
{
    let mut current_key = current_key_mutex.lock().unwrap();

    if let Ok(old_shortcut) = current_key.parse::<Shortcut>() {
        let _ = app.global_shortcut().unregister(old_shortcut);
    }

    let new_shortcut = new_hotkey
        .parse::<Shortcut>()
        .map_err(|e| format!("Invalid shortcut format: {e}"))?;

    let app_clone = app.clone();
    app.global_shortcut()
        .on_shortcut(new_shortcut, move |_app, _shortcut, event| {
            if event.state() == ShortcutState::Pressed {
                action(&app_clone);
            }
        })
        .map_err(|e| format!("Failed to register shortcut: {e}"))?;

    *current_key = new_hotkey;
    Ok(())
}

#[tauri::command]
pub fn update_start_stop_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    register_shortcut(&app, &state.start_stop_hotkey, hotkey, |app_handle| {
        let app_state = app_handle.state::<AppState>();
        let running = clicker::service::toggle(&app_state);
        let _ = app_handle.emit("clicker-state-changed", running);
    })
}

#[tauri::command]
pub fn update_pick_position_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    register_shortcut(&app, &state.pick_position_hotkey, hotkey, |app_handle| {
        let app_state = app_handle.state::<AppState>();
        let _ = clicker::overlay::begin_pick(app_handle, &app_state);
    })
}

#[tauri::command]
pub fn update_toggle_overlay_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    register_shortcut(&app, &state.toggle_overlay_hotkey, hotkey, |app_handle| {
        let app_state = app_handle.state::<AppState>();
        let _ = clicker::overlay::toggle(app_handle, &app_state);
    })
}