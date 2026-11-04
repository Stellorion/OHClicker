//! The two transparent, click-through overlay windows drawn over the selected display.
//!   position overlay - shows the target / sequence points (frontend: PositionOverlay.tsx)
//!   boundary overlay - shows the click region          (frontend: BoundaryOverlay.tsx)
//!
//! windows.rs         creates + places the windows
//! position_state.rs  data pushed to the position overlay
//! boundary_state.rs  data pushed to the boundary overlay
//! control.rs         show/hide + arming the position picker
//! pick.rs            finishing a pick (user clicked a position)
mod boundary_state;
mod control;
mod pick;
mod position_state;
mod windows;

pub use boundary_state::{
    boundary_overlay_state, publish_boundary_state, update_boundary_window_position,
    BoundaryOverlayState,
};
pub use control::{begin_pick, begin_pick_for, toggle};
pub use pick::complete_pick;
pub use position_state::{position_overlay_state, publish, PositionOverlayState};
pub use windows::{create_boundary_window, create_window, move_to_selected_display};
