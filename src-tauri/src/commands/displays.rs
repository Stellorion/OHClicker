//! Tauri commands about monitors (frontend: hooks/useDisplays.ts, DisplaySelector).
use crate::app_state::AppState;
use crate::clicker::display::DisplayInfo;
use crate::clicker::position::ScreenSize;
use crate::clicker::{overlay, service};
use crate::status;
use tauri::{AppHandle, Manager, State, WebviewWindow};

/// Lists all connected displays.
#[tauri::command]
pub fn get_displays(window: WebviewWindow) -> Result<Vec<DisplayInfo>, String> {
    service::available_displays(&window)
}

/// Size of the selected display.
#[tauri::command]
pub fn get_screen_size(state: State<'_, AppState>) -> ScreenSize {
    service::screen_size(&state.clicker)
}

/// Selects the display and moves the overlay windows and the indicator onto it.
#[tauri::command]
pub fn select_display(
    app: AppHandle,
    state: State<'_, AppState>,
    display_id: String,
) -> Result<(), String> {
    let main = app
        .get_webview_window("main")
        .ok_or_else(|| "Main window is unavailable".to_string())?;
    let display = service::available_displays(&main)?
        .into_iter()
        .find(|display| display.id == display_id)
        .ok_or_else(|| "Selected display is no longer connected".to_string())?;
    service::update_selected_display(&state.clicker, display);
    overlay::move_to_selected_display(&app, &state)?;
    overlay::update_boundary_window_position(&app, &state)?;
    status::move_indicator_to_display(&app, &state);
    overlay::publish(&app, &state);
    overlay::publish_boundary_state(&app, &state);
    Ok(())
}
