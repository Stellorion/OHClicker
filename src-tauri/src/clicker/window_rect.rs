//! Bounds of the window that currently has focus (Boundaries -> "Active window").
//! Windows only; other platforms report an error.

/// Returns `(left, top, width, height)` in desktop pixels.
#[cfg(target_os = "windows")]
pub fn foreground_window_rect() -> Result<(i32, i32, u32, u32), String> {
    use windows::Win32::Foundation::{HWND, RECT};
    use windows::Win32::UI::WindowsAndMessaging::{GetForegroundWindow, GetWindowRect};

    let hwnd = unsafe { GetForegroundWindow() };
    if hwnd == HWND::default() {
        return Err("No foreground window".to_string());
    }
    let mut rect = RECT::default();
    if unsafe { GetWindowRect(hwnd, &mut rect) }.is_err() {
        return Err("Failed to retrieve window rectangle".to_string());
    }
    Ok((
        rect.left,
        rect.top,
        (rect.right - rect.left).max(0) as u32,
        (rect.bottom - rect.top).max(0) as u32,
    ))
}

#[cfg(not(target_os = "windows"))]
pub fn foreground_window_rect() -> Result<(i32, i32, u32, u32), String> {
    Err("Active window bounds are only supported on Windows".to_string())
}
