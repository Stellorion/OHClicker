//! The window chosen in Boundaries -> "Choose window".
//! The handle (id) only lives until the window closes; the title is kept so the
//! window can be found again, e.g. after a restart or when a profile is imported.
use crate::clicker::os_windows;
use std::sync::atomic::{AtomicI64, Ordering};
use std::sync::{Arc, Mutex};

/// `(left, top, width, height)` in desktop pixels.
pub type Rect = (i32, i32, u32, u32);

#[derive(Clone)]
pub struct BoundaryWindow {
    id: Arc<AtomicI64>,
    title: Arc<Mutex<String>>,
}

impl BoundaryWindow {
    /// Nothing chosen yet.
    pub fn new() -> Self {
        Self {
            id: Arc::new(AtomicI64::new(0)),
            title: Arc::new(Mutex::new(String::new())),
        }
    }

    /// Remembers the chosen window (`id` 0 = unknown, find it by title later).
    pub fn set(&self, id: i64, title: String) {
        self.id.store(id, Ordering::SeqCst);
        *self.title.lock().unwrap() = title;
    }

    /// Title of the chosen window (empty = none chosen).
    pub fn title(&self) -> String {
        self.title.lock().unwrap().clone()
    }

    /// Handle of the chosen window: the stored one while it is open, otherwise
    /// the open window with the same title (the new handle is remembered).
    fn resolve(&self) -> Option<i64> {
        let id = self.id.load(Ordering::SeqCst);
        if id != 0 && os_windows::exists(id) {
            return Some(id);
        }
        let found = os_windows::find_by_title(&self.title())?;
        self.id.store(found, Ordering::SeqCst);
        Some(found)
    }

    /// Where the chosen window is right now (None = closed, minimized or not chosen).
    pub fn rect(&self) -> Option<Rect> {
        os_windows::rect(self.resolve()?)
    }

    /// Is the chosen window the one directly under `(x, y)` (not covered by another)?
    pub fn is_under(&self, x: i32, y: i32) -> bool {
        match (self.resolve(), os_windows::window_at_point(x, y)) {
            (Some(chosen), Some(top)) => chosen == top,
            _ => false,
        }
    }

    /// Current title of the chosen window. Remembers it when it changed (e.g. a
    /// browser tab switch). None = the window is closed.
    pub fn live_title(&self) -> Option<String> {
        let title = os_windows::title_of(self.resolve()?)?;
        if !title.is_empty() {
            *self.title.lock().unwrap() = title.clone();
        }
        Some(title)
    }

    /// Handle of the chosen window if it is open (None = closed or not chosen).
    pub fn handle(&self) -> Option<i64> {
        self.resolve()
    }
}
