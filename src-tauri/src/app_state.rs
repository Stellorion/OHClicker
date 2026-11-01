use crate::clicker::state::AutoClickerState;
use crate::execution::ExecutionCoordinator;
use std::sync::Arc;

pub struct AppState {
    pub clicker: AutoClickerState,
    pub execution: Arc<ExecutionCoordinator>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            clicker: AutoClickerState::new(),
            execution: Arc::new(ExecutionCoordinator::new()),
        }
    }
}
