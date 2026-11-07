//! Position and size of one window, by handle.

/// Handle number -> HWND (works for both integer and pointer HWND types).
#[cfg(target_os = "windows")]
pub(super) fn to_hwnd(id: i64) -> windows::Win32::Foundation::HWND {
    windows::Win32::Foundation::HWND(id as _)
}

/// `(left, top, width, height)` in desktop pixels.
/// `None` when the window is closed or minimized (it has no usable area then).
#[cfg(target_os = "windows")]
pub fn rect(id: i64) -> Option<(i32, i32, u32, u32)> {
    use windows::Win32::Foundation::RECT;
    use windows::Win32::UI::WindowsAndMessaging::{GetWindowRect, IsIconic};
    let hwnd = to_hwnd(id);
    let mut area = RECT::default();
    unsafe {
        if IsIconic(hwnd).as_bool() || GetWindowRect(hwnd, &mut area).is_err() {
            return None;
        }
    }
    let width = (area.right - area.left).max(0) as u32;
    let height = (area.bottom - area.top).max(0) as u32;
    Some((area.left, area.top, width, height))
}

/// Does a window with this handle still exist?
#[cfg(target_os = "windows")]
pub fn exists(id: i64) -> bool {
    use windows::Win32::Foundation::RECT;
    use windows::Win32::UI::WindowsAndMessaging::GetWindowRect;
    unsafe { GetWindowRect(to_hwnd(id), &mut RECT::default()).is_ok() }
}

#[cfg(not(target_os = "windows"))]
pub fn rect(_id: i64) -> Option<(i32, i32, u32, u32)> {
    None
}

#[cfg(not(target_os = "windows"))]
pub fn exists(_id: i64) -> bool {
    false
}
