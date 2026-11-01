use std::fmt::{Display, Formatter};
use std::sync::Mutex;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ExclusiveTool {
    AutoClicker,
    Macro,
}

impl Display for ExclusiveTool {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::AutoClicker => formatter.write_str("AutoClicker"),
            Self::Macro => formatter.write_str("Macro"),
        }
    }
}

pub struct ExecutionCoordinator {
    active: Mutex<Option<ExclusiveTool>>,
}

impl ExecutionCoordinator {
    pub fn new() -> Self {
        Self {
            active: Mutex::new(None),
        }
    }

    pub fn start(&self, tool: ExclusiveTool, activate: impl FnOnce()) -> Result<(), ExclusiveTool> {
        let mut active = self.active.lock().unwrap();
        if let Some(active_tool) = *active {
            return Err(active_tool);
        }
        activate();
        *active = Some(tool);
        Ok(())
    }

    pub fn stop(&self, tool: ExclusiveTool, deactivate: impl FnOnce()) -> bool {
        let mut active = self.active.lock().unwrap();
        if *active != Some(tool) {
            return false;
        }
        deactivate();
        *active = None;
        true
    }

    pub fn request_stop(&self, tool: ExclusiveTool, deactivate: impl FnOnce()) -> bool {
        let active = self.active.lock().unwrap();
        if *active != Some(tool) {
            return false;
        }
        deactivate();
        true
    }
}

#[cfg(test)]
mod tests {
    use super::{ExclusiveTool, ExecutionCoordinator};

    #[test]
    fn exclusive_tools_cannot_run_together() {
        let coordinator = ExecutionCoordinator::new();
        assert_eq!(coordinator.start(ExclusiveTool::AutoClicker, || {}), Ok(()));
        assert_eq!(
            coordinator.start(ExclusiveTool::Macro, || {}),
            Err(ExclusiveTool::AutoClicker)
        );
        assert!(coordinator.stop(ExclusiveTool::AutoClicker, || {}));
        assert_eq!(coordinator.start(ExclusiveTool::Macro, || {}), Ok(()));
    }
}
