//! What each hotkey does, and how it is bound to the OS.
use crate::app_state::AppState;
use crate::clicker;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

/// The two hotkey slots (same order as the UI: start/stop, toggle overlay).
#[derive(Clone, Copy)]
pub enum HotkeyAction {
    StartStop,
    ToggleOverlay,
}

pub const ACTIONS: [HotkeyAction; 2] = [HotkeyAction::StartStop, HotkeyAction::ToggleOverlay];

/// Runs the action when its key is pressed.
fn run_action(app: &AppHandle, action: HotkeyAction) {
    let state = app.state::<AppState>();
    match action {
        HotkeyAction::StartStop => {
            let running = clicker::service::toggle(&state);
            let _ = app.emit("clicker-state-changed", running);
        }
        HotkeyAction::ToggleOverlay => {
            let _ = clicker::overlay::toggle(app, &state);
        }
    }
}

/// Registers `shortcut` with the OS so it triggers `action`.
pub fn bind(app: &AppHandle, shortcut: Shortcut, action: HotkeyAction) -> Result<(), String> {
    let handle = app.clone();
    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, _shortcut, event| {
            if event.state() == ShortcutState::Pressed {
                run_action(&handle, action);
            }
        })
        .map_err(|e| e.to_string())
}
