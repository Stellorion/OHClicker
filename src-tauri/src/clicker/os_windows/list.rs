//! Lists the open windows (Windows: EnumWindows) and finds one by title.
use super::WindowInfo;

/// Windows that are visible but are not real program windows.
#[cfg(target_os = "windows")]
const IGNORED_TITLES: [&str; 3] = [
    "Program Manager",
    "Windows Input Experience",
    "Microsoft Text Input Application",
];

/// Builds a `WindowInfo` for real, titled, normal windows of other programs.
#[cfg(target_os = "windows")]
unsafe fn describe(hwnd: windows::Win32::Foundation::HWND) -> Option<WindowInfo> {
    use windows::Win32::UI::WindowsAndMessaging::*;
    if !unsafe { IsWindowVisible(hwnd).as_bool() } {
        return None;
    }
    if unsafe { GetWindowLongW(hwnd, GWL_EXSTYLE) } as u32 & WS_EX_TOOLWINDOW.0 != 0 {
        return None; // tool windows (tray helpers, tooltips...)
    }
    let length = unsafe { GetWindowTextLengthW(hwnd) };
    if length == 0 {
        return None;
    }
    let mut buffer = vec![0u16; length as usize + 1];
    let copied = unsafe { GetWindowTextW(hwnd, &mut buffer).max(0) } as usize;
    let title = String::from_utf16_lossy(&buffer[..copied]);
    if title.trim().is_empty() || IGNORED_TITLES.contains(&title.as_str()) {
        return None;
    }
    let mut process_id = 0u32;
    unsafe { GetWindowThreadProcessId(hwnd, Some(&mut process_id)) };
    if process_id == std::process::id() {
        return None; // never offer our own windows
    }
    Some(WindowInfo { id: hwnd.0 as i64, title })
}

/// EnumWindows callback. Generic return type: it becomes the `BOOL` of whichever
/// `windows` crate version is used (BOOL moved between versions).
#[cfg(target_os = "windows")]
unsafe extern "system" fn collect<B: From<bool>>(
    hwnd: windows::Win32::Foundation::HWND,
    lparam: windows::Win32::Foundation::LPARAM,
) -> B {
    let list = unsafe { &mut *(lparam.0 as *mut Vec<WindowInfo>) };
    list.extend(unsafe { describe(hwnd) });
    true.into() // keep enumerating
}

/// All choosable windows, topmost first.
#[cfg(target_os = "windows")]
pub fn list_windows() -> Vec<WindowInfo> {
    use windows::Win32::Foundation::LPARAM;
    use windows::Win32::UI::WindowsAndMessaging::EnumWindows;
    let mut found: Vec<WindowInfo> = Vec::new();
    let lparam = LPARAM(&mut found as *mut Vec<WindowInfo> as isize);
    let _ = unsafe { EnumWindows(Some(collect), lparam) };
    found
}

#[cfg(not(target_os = "windows"))]
pub fn list_windows() -> Vec<WindowInfo> {
    Vec::new()
}

/// Finds an open window by its title (exact match first, then ignoring case).
/// Used to re-find the chosen window after a restart, when its handle is gone.
pub fn find_by_title(title: &str) -> Option<i64> {
    let windows = list_windows();
    let exact = windows.iter().find(|w| w.title == title);
    let loose = || windows.iter().find(|w| w.title.eq_ignore_ascii_case(title));
    exact.or_else(loose).map(|w| w.id)
}
