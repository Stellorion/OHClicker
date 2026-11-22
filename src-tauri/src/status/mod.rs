//! Small status windows: the "ACTIVE" indicator and the "OHC ENABLED" toast.
//! Frontend: components/overlay/StatusIndicator.tsx and StatusToast.tsx
//!   windows.rs   - creates and places the two windows
//!   indicator.rs - shows the indicator while the overlay is visible (ACTIVE / IDLE)
//!   toast.rs     - popup near the cursor when the start/stop hotkey is pressed
mod indicator;
mod toast;
mod windows;

pub use indicator::spawn_indicator_sync;
pub use toast::notify_toggled;
pub use windows::{create_windows, move_indicator_to_display};
