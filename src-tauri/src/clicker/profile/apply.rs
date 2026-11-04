//! Applies a validated profile to the running app (used by Import, Link and startup).
use super::{ConfigProfile, ProfileError, ProfileErrorKind};
use crate::app_state::AppState;
use crate::clicker::{hotkeys::apply_hotkeys, overlay};
use std::sync::atomic::Ordering;
use tauri::AppHandle;

/// Refuses to change settings while the engine is clicking
/// (e.g. a shorter sequence could be indexed by the running engine).
pub fn ensure_stopped(state: &AppState) -> Result<(), ProfileError> {
    if state.clicker.is_running.load(Ordering::SeqCst) {
        return Err(ProfileError::new(
            ProfileErrorKind::Busy,
            "Stop the autoclicker before changing the profile.",
            vec![],
        ));
    }
    Ok(())
}

/// Hotkeys first (they can fail and are rolled back by `apply_hotkeys`, so a
/// failure leaves everything untouched), then the settings, then the overlays.
pub fn apply_profile_to_app(
    app: &AppHandle,
    state: &AppState,
    profile: &ConfigProfile,
) -> Result<(), ProfileError> {
    apply_hotkeys(
        app,
        state,
        &profile.start_stop_hotkey,
        &profile.pick_position_hotkey,
        &profile.toggle_overlay_hotkey,
    )
    .map_err(|e| {
        let message = "The profile's hotkeys couldn't be applied, so nothing was imported.";
        ProfileError::new(ProfileErrorKind::Hotkey, message, vec![e])
    })?;

    state.apply_profile(profile.clone());
    overlay::publish(app, state);
    overlay::publish_boundary_state(app, state);
    Ok(())
}
