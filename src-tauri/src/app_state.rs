use crate::clicker::state::AutoClickerState;
use crate::execution::ExecutionCoordinator;

pub struct AppState {
    pub clicker: AutoClickerState,
    pub execution: ExecutionCoordinator,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            clicker: AutoClickerState::new(),
            execution: ExecutionCoordinator::new(),
        }
    }
}
