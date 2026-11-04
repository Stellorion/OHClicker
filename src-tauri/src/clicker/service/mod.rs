//! Plain functions that change the engine state (no Tauri types needed, except the
//! display lookup). Called by the commands in backend-src/commands/.
//!   clicking.rs   - speed, button, repeat and limits
//!   position.rs   - target position, displays, sequence
//!   boundaries.rs - click region
mod boundaries;
mod clicking;
mod position;

pub use boundaries::*;
pub use clicking::*;
pub use position::*;
