//! Global (OS-wide) hotkeys. Tauri commands live in commands/hotkeys.rs.
mod action;
mod apply;

pub use apply::apply_hotkeys;
