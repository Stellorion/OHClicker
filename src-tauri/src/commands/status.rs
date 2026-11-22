//! Tauri commands for the status windows (frontend: components/overlay/StatusIndicator.tsx).
use tauri::WebviewWindow;

/// Starts moving the calling window with the mouse (the indicator is draggable).
/// The page calls this on mouse down. Done in Rust so no extra permission is needed.
#[tauri::command]
pub fn start_status_drag(window: WebviewWindow) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}
