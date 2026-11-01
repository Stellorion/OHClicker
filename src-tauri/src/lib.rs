mod clicker;
mod commands;
mod state;

use state::AutoClickerState;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use tauri::{Emitter, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Shortcut, ShortcutState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let is_running = Arc::new(AtomicBool::new(false));
    let cps = Arc::new(AtomicU32::new(10));
    let interval_randomization_pct = Arc::new(AtomicU32::new(0));
    let button_hold_ms = Arc::new(AtomicU32::new(12));
    let start_delay_ms = Arc::new(AtomicU32::new(0));

    let is_running_hotkey = Arc::clone(&is_running);

    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(AutoClickerState {
            is_running: Arc::clone(&is_running),
            cps: Arc::clone(&cps),
            interval_randomization_pct: Arc::clone(&interval_randomization_pct),
            button_hold_ms: Arc::clone(&button_hold_ms),
            start_delay_ms: Arc::clone(&start_delay_ms),
        })
        .invoke_handler(tauri::generate_handler![
            commands::toggle_clicker,
            commands::update_cps,
            commands::update_interval_randomization_pct,
            commands::update_button_hold_ms,
            commands::update_start_delay_ms
        ])
        .setup(move |app| {
            let handle = app.handle().clone();

            // Pass start_delay_ms into the background click loop
            clicker::start_click_loop(
                app.handle().clone(),
                Arc::clone(&is_running),
                Arc::clone(&cps),
                Arc::clone(&interval_randomization_pct),
                Arc::clone(&button_hold_ms),
                Arc::clone(&start_delay_ms),
            );

            let toggle_shortcut = Shortcut::new(None, Code::F6);

            app.global_shortcut()
                .on_shortcut(toggle_shortcut, move |_app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let current = is_running_hotkey.load(Ordering::SeqCst);
                        let next_state = !current;
                        is_running_hotkey.store(next_state, Ordering::SeqCst);

                        let _ = handle.emit("clicker-state-changed", next_state);
                    }
                })?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}