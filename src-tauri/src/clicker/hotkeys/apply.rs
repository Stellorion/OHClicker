//! Replaces all three global hotkeys at once (all-or-nothing).
use super::action::{bind, ACTIONS};
use crate::app_state::AppState;
use tauri::AppHandle;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

/// Parses the three keys and rejects invalid or duplicate ones.
fn parse_all(requested: &[(&str, &str); 3]) -> Result<Vec<Shortcut>, String> {
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
    Ok(parsed)
}

/// Registers the new keys; if one fails the old hotkeys are restored.
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
    let parsed = parse_all(&requested)?;

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
