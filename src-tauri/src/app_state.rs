use crate::clicker::state::AutoClickerState;

pub struct AppState {
    pub clicker: AutoClickerState,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            clicker: AutoClickerState::new(),
        }
    }
}
