//! System tray icon for Options -> "Keep in system tray".
//! Needs the `tray-icon` feature on the `tauri` crate (Cargo.toml).
//!   mod.rs    - the icon and its menu
//!   window.rs - showing the window, and what the close button does
mod window;

pub use window::{handle_window_event, set_main_window_visible, show_main_window};

use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle};

const TRAY_ID: &str = "main-tray";

/// Creates the tray icon (left click = show window, menu = Show / Quit).
/// It is only visible while the option is on.
pub fn create(app: &AppHandle, visible: bool) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, "show", "Show Autoclicker", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .tooltip("Autoclicker")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => show_main_window(app),
            "quit" => app.exit(0), // really quit (also stops the hotkeys)
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                show_main_window(tray.app_handle());
            }
        });
    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }
    builder.build(app)?.set_visible(visible)
}

/// Shows or hides the tray icon (called when the option is toggled).
pub fn set_visible(app: &AppHandle, visible: bool) -> tauri::Result<()> {
    match app.tray_by_id(TRAY_ID) {
        Some(tray) => tray.set_visible(visible),
        None => Ok(()),
    }
}
