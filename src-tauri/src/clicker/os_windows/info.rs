//! Live facts about windows: who is under a point, and a window's current title.
use super::{exists, rect::to_hwnd};

/// Handle of the top-level window under desktop point `(x, y)` (None = nothing there).
#[cfg(target_os = "windows")]
pub fn window_at_point(x: i32, y: i32) -> Option<i64> {
    use windows::Win32::Foundation::POINT;
    use windows::Win32::UI::WindowsAndMessaging::{GetAncestor, WindowFromPoint, GA_ROOT};
    unsafe {
        let hit = WindowFromPoint(POINT { x, y }); // may be a child control
        let root = GetAncestor(hit, GA_ROOT); // climb to the top-level window
        (root != Default::default()).then(|| root.0 as i64)
    }
}

/// Current title of the window with this handle (None = the window is gone).
#[cfg(target_os = "windows")]
pub fn title_of(id: i64) -> Option<String> {
    use windows::Win32::UI::WindowsAndMessaging::{GetWindowTextLengthW, GetWindowTextW};
    if !exists(id) {
        return None;
    }
    let hwnd = to_hwnd(id);
    unsafe {
        let length = GetWindowTextLengthW(hwnd).max(0) as usize;
        let mut buffer = vec![0u16; length + 1];
        let copied = GetWindowTextW(hwnd, &mut buffer).max(0) as usize;
        Some(String::from_utf16_lossy(&buffer[..copied]))
    }
}

#[cfg(not(target_os = "windows"))]
pub fn window_at_point(_x: i32, _y: i32) -> Option<i64> { None }
#[cfg(not(target_os = "windows"))]
pub fn title_of(_id: i64) -> Option<String> { None }