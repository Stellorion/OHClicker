//! Top-level windows of OTHER programs (Boundaries -> "Choose window").
//! Frontend mirror: `WindowInfo` in frontend-src/types/window-types.ts
//!   list.rs - list the open windows / find one by title
//!   rect.rs - position + size of one window
//! Only Windows is supported; other systems get an empty list.
//! z_order.rs - put one window directly above another.
mod list;
mod rect;
mod info;
mod z_order;

pub use list::{find_by_title, list_windows};
pub use rect::{exists, rect};
pub use info::{title_of, window_at_point};
pub use z_order::place_directly_above;

use serde::Serialize;

/// One window the user can choose.
#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WindowInfo {
    /// Window handle (HWND). Only valid while the window stays open.
    pub id: i64,
    pub title: String,
}
