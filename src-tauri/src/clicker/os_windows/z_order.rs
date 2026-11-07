//! Z-order helper (Windows): keep one window directly above another.
//! Used so the boundary overlay is only drawn over the chosen window.

/// Collects every top-level window handle, topmost first (EnumWindows callback).
/// Generic return type: it becomes the `BOOL` of whichever `windows` crate version is used.
#[cfg(target_os = "windows")]
unsafe extern "system" fn collect_all<B: From<bool>>(
    hwnd: windows::Win32::Foundation::HWND,
    lparam: windows::Win32::Foundation::LPARAM,
) -> B {
    let list = unsafe { &mut *(lparam.0 as *mut Vec<i64>) };
    list.push(hwnd.0 as i64);
    true.into()
}

/// All top-level windows (visible or not) in z-order, topmost first.
#[cfg(target_os = "windows")]
fn z_order() -> Vec<i64> {
    use windows::Win32::Foundation::LPARAM;
    use windows::Win32::UI::WindowsAndMessaging::EnumWindows;
    let mut order: Vec<i64> = Vec::new();
    let lparam = LPARAM(&mut order as *mut Vec<i64> as isize);
    let _ = unsafe { EnumWindows(Some(collect_all), lparam) };
    order
}

/// Moves `overlay` so it sits directly above `chosen`, without activating it.
/// Windows above `chosen` therefore stay above the overlay too.
#[cfg(target_os = "windows")]
pub fn place_directly_above(overlay: i64, chosen: i64) {
    use super::rect::to_hwnd;
    use windows::Win32::UI::WindowsAndMessaging::*;

    let order = z_order();
    let Some(pos) = order.iter().position(|&h| h == chosen) else {
        return;
    };
    if pos > 0 && order[pos - 1] == overlay {
        return; // already directly above the chosen window
    }
    let target = if pos > 0 {
        to_hwnd(order[pos - 1]) // go just below the window that is above `chosen`
    } else {
        // `chosen` is the very top window: go to the top of its layer.
        let style = unsafe { GetWindowLongW(to_hwnd(chosen), GWL_EXSTYLE) } as u32;
        if style & WS_EX_TOPMOST.0 != 0 { HWND_TOPMOST } else { HWND_TOP }
    };
    let flags = SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE;
    let _ = unsafe { SetWindowPos(to_hwnd(overlay), target.into(), 0, 0, 0, 0, flags) };
}

#[cfg(not(target_os = "windows"))]
pub fn place_directly_above(_overlay: i64, _chosen: i64) {}