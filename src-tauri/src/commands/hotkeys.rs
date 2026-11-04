use crate::app_state::AppState;
use crate::clicker;
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[derive(Clone, Copy)]
enum HotkeyAction {
    StartStop,
    PickPosition,
    ToggleOverlay,
}

const ACTIONS: [HotkeyAction; 3] = [
    HotkeyAction::StartStop,
    HotkeyAction::PickPosition,
    HotkeyAction::ToggleOverlay,
];

fn run_action(app: &AppHandle, action: HotkeyAction) {
    let state = app.state::<AppState>();
    match action {
        HotkeyAction::StartStop => {
            let running = clicker::service::toggle(&state);
            let _ = app.emit("clicker-state-changed", running);
        }
        HotkeyAction::PickPosition => {
            let _ = clicker::overlay::begin_pick(app, &state);
        }
        HotkeyAction::ToggleOverlay => {
            let _ = clicker::overlay::toggle(app, &state);
        }
    }
}

fn bind(app: &AppHandle, shortcut: Shortcut, action: HotkeyAction) -> Result<(), String> {
    let handle = app.clone();
    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, _shortcut, event| {
            if event.state() == ShortcutState::Pressed {
                run_action(&handle, action);
            }
        })
        .map_err(|e| e.to_string())
}

/// Replaces all three global hotkeys at once.
///
/// Either every hotkey is applied or none is: the new keys are validated first,
/// and if registering one fails the previous hotkeys are restored.
/// Doing all three together also allows swapping keys between actions.
pub fn apply_hotkeys(
    app: &AppHandle,
    state: &AppState,
    start_stop: &str,
    pick_position: &str,
    toggle_overlay: &str,
) -> Result<(), String> {
    let requested = [
        ("Start / stop", start_stop),
        ("Pick position", pick_position),
        ("Toggle overlay", toggle_overlay),
    ];

    let mut parsed: Vec<Shortcut> = Vec::with_capacity(3);
    for (label, key) in requested {
        let shortcut = key
            .parse::<Shortcut>()
            .map_err(|e| format!("{label} hotkey \"{key}\" is not valid: {e}"))?;
        parsed.push(shortcut);
    }
    for i in 0..parsed.len() {
        for j in (i + 1)..parsed.len() {
            if parsed[i] == parsed[j] {
                return Err(format!(
                    "\"{}\" can't be used for both {} and {}.",
                    requested[i].1, requested[i].0, requested[j].0
                ));
            }
        }
    }

    let old = [
        state.start_stop_hotkey.lock().unwrap().clone(),
        state.pick_position_hotkey.lock().unwrap().clone(),
        state.toggle_overlay_hotkey.lock().unwrap().clone(),
    ];
    let gs = app.global_shortcut();

    for key in &old {
        if let Ok(shortcut) = key.parse::<Shortcut>() {
            let _ = gs.unregister(shortcut);
        }
    }

    let mut bound: Vec<Shortcut> = Vec::new();
    for (index, shortcut) in parsed.iter().enumerate() {
        if let Err(error) = bind(app, shortcut.clone(), ACTIONS[index]) {
            // Roll back: drop what we just bound and restore the previous hotkeys.
            for shortcut in bound {
                let _ = gs.unregister(shortcut);
            }
            for (action, key) in ACTIONS.iter().zip(old.iter()) {
                if let Ok(shortcut) = key.parse::<Shortcut>() {
                    let _ = bind(app, shortcut, *action);
                }
            }
            return Err(format!(
                "{} hotkey \"{}\" couldn't be registered. It may be in use by another app. ({error})",
                requested[index].0, requested[index].1
            ));
        }
        bound.push(shortcut.clone());
    }

    *state.start_stop_hotkey.lock().unwrap() = start_stop.to_string();
    *state.pick_position_hotkey.lock().unwrap() = pick_position.to_string();
    *state.toggle_overlay_hotkey.lock().unwrap() = toggle_overlay.to_string();
    Ok(())
}

fn current(state: &AppState) -> (String, String, String) {
    (
        state.start_stop_hotkey.lock().unwrap().clone(),
        state.pick_position_hotkey.lock().unwrap().clone(),
        state.toggle_overlay_hotkey.lock().unwrap().clone(),
    )
}

#[tauri::command]
pub fn update_start_stop_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    let (_, pick, overlay) = current(&state);
    apply_hotkeys(&app, &state, &hotkey, &pick, &overlay)
}

#[tauri::command]
pub fn update_pick_position_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    let (start, _, overlay) = current(&state);
    apply_hotkeys(&app, &state, &start, &hotkey, &overlay)
}

#[tauri::command]
pub fn update_toggle_overlay_hotkey(
    app: AppHandle,
    state: State<'_, AppState>,
    hotkey: String,
) -> Result<(), String> {
    let (start, pick, _) = current(&state);
    apply_hotkeys(&app, &state, &start, &pick, &hotkey)
}
