use crate::execution::{ExclusiveTool, ExecutionCoordinator};

pub fn start(
    coordinator: &ExecutionCoordinator,
    start_engine: impl FnOnce(),
) -> Result<(), ExclusiveTool> {
    coordinator.start(ExclusiveTool::Macro, start_engine)
}

pub fn stop(coordinator: &ExecutionCoordinator, stop_engine: impl FnOnce()) -> bool {
    coordinator.stop(ExclusiveTool::Macro, stop_engine)
}
