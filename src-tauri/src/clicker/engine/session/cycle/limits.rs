//! Run limits: fixed click count and maximum duration.
use super::super::ClickSession;
use crate::clicker::state::AutoClickerState;
use crate::clicker::state::RepeatType;
use std::time::Duration;

/// True when any limit says the run must end.
pub(super) fn reached(session: &ClickSession, state: &AutoClickerState) -> bool {
    let repeat_type = *state.repeat_type.lock().unwrap();
    let elapsed = session.start_time.map(|start| start.elapsed());
    fixed_count_reached(
        repeat_type,
        session.total_clicks,
        state
            .fixed_count_limit
            .load(std::sync::atomic::Ordering::Relaxed),
    ) || duration_reached(
        state
            .max_duration_enabled
            .load(std::sync::atomic::Ordering::Relaxed),
        elapsed,
        state
            .max_duration_sec
            .load(std::sync::atomic::Ordering::Relaxed),
    )
}

/// Fixed count mode and the click total hit the limit.
pub(super) fn fixed_count_reached(
    repeat_type: RepeatType,
    total_clicks: u64,
    limit: u32,
) -> bool {
    repeat_type == RepeatType::FixedCount && total_clicks >= u64::from(limit)
}

/// Max-duration enabled and the elapsed time hit the limit.
pub(super) fn duration_reached(
    enabled: bool,
    elapsed: Option<Duration>,
    limit_seconds: u32,
) -> bool {
    enabled
        && elapsed.is_some_and(|elapsed| elapsed >= Duration::from_secs(u64::from(limit_seconds)))
}

#[cfg(test)]
mod tests {
    use super::{duration_reached, fixed_count_reached};
    use crate::clicker::state::RepeatType;
    use std::time::Duration;

    #[test]
    fn fixed_count_stops_at_limit_only_when_enabled() {
        assert!(!fixed_count_reached(RepeatType::FixedCount, 4, 5));
        assert!(fixed_count_reached(RepeatType::FixedCount, 5, 5));
        assert!(!fixed_count_reached(RepeatType::UntilStopped, 5, 5));
    }

    #[test]
    fn duration_stops_at_limit_only_when_enabled() {
        assert!(!duration_reached(true, Some(Duration::from_secs(9)), 10));
        assert!(duration_reached(true, Some(Duration::from_secs(10)), 10));
        assert!(!duration_reached(false, Some(Duration::from_secs(10)), 10));
        assert!(!duration_reached(true, None, 10));
    }
}
