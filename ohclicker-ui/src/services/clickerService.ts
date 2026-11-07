import { invoke } from "@tauri-apps/api/core";
import type { DisplayInfo } from "../types/ac-types";
import type { BoundaryOverlayState } from "../types/overlay-types";
import type { RegionMode } from "../types/ac-types";
import type { WindowInfo } from "../types/window-types";
import { optionsService } from "./optionsService";
import { profileService } from "./profileService";

// Every backend command the UI can call (Rust side: backend-src/commands/*.rs).
// Profile commands live in profileService.ts and are merged in at the bottom.
export const clickerService = {
  /** Start/stop. Resolves to the new running state. */
  toggleClicker: () => invoke<boolean>("toggle_clicker"),
  updateCps: (cps: number) => invoke("update_cps", { cps }),
  updateIntervalRandomizationPct: (pct: number) =>
    invoke("update_interval_randomization_pct", { pct }),
  updateButtonHoldMs: (holdMs: number) =>
    invoke("update_button_hold_ms", { holdMs }),
  updateStartDelayMs: (delayMs: number) =>
    invoke("update_start_delay_ms", { delayMs }),
  updateMouseButton: async (button: string) => {
    await invoke("update_mouse_button", { button });
  },
  updateClickType: async (clickType: string) => {
    await invoke("update_click_type", { clickType });
  },
  updateRepeatType: async (repeatType: string) => {
    await invoke("update_repeat_type", { repeatType });
  },
  updateFixedCountLimit: (limit: number) =>
    invoke("update_fixed_count_limit", { limit }),
  updateMaxDurationEnabled: async (enabled: boolean) => {
    await invoke("update_max_duration_enabled", { enabled });
  },
  updateMaxDurationSec: (sec: number) =>
    invoke("update_max_duration_sec", { sec }),
  updatePositionMode: (mode: string) =>
    invoke("update_position_mode", { mode }),
  updateCoordinateType: (coordinateType: string) =>
    invoke("update_coordinate_type", { coordinateType }),
  updateTargetPosition: (x: number, y: number) =>
    invoke("update_target_position", { x, y }),
  updatePositionJitter: (jitterPx: number) =>
    invoke("update_position_jitter", { jitterPx }),
  updateSequencePoints: (
    points: Array<{ id: string; x: number; y: number; dwell: number }>,
  ) => invoke("update_sequence_points", { points }),
  /** Arms the position picker (optionally for one sequence point). */
  beginPositionPick: (pointId?: string) =>
    invoke<void>("begin_position_pick", { pointId }),
  togglePositionOverlay: () => invoke<boolean>("toggle_position_overlay"),
  getPositionOverlayState: () =>
    invoke<{ picking: boolean; pickPointId?: string | null }>(
      "get_position_overlay_state",
    ),
  getScreenSize: () =>
    invoke<{ width: number; height: number }>("get_screen_size"),
  getDisplays: () => invoke<DisplayInfo[]>("get_displays"),
  /** Selects the display that positions and boundaries are relative to. */
  selectDisplay: (displayId: string) => invoke("select_display", { displayId }),
  async updateStartStopHotkey(hotkey: string): Promise<void> {
    await invoke("update_start_stop_hotkey", { hotkey });
  },
  async updateToggleOverlayHotkey(hotkey: string): Promise<void> {
    await invoke("update_toggle_overlay_hotkey", { hotkey });
  },
  setBoundariesEnabled: (enabled: boolean) =>
    invoke("set_boundaries_enabled", { enabled }),
  setRegionMode: (mode: RegionMode) =>
    invoke("set_region_mode", { mode }),
  updateBoundaryRect: (x: number, y: number, width: number, height: number) =>
    invoke("update_boundary_rect", { x, y, width, height }),
  setStopWhenCursorLeaves: (enabled: boolean) =>
    invoke("set_stop_when_cursor_leaves", { enabled }),
  getBoundaryOverlayState: () =>
    invoke<BoundaryOverlayState>("get_boundary_overlay_state"),
  /** Open windows the boundary can follow ("Choose window"). */
  listWindows: () => invoke<WindowInfo[]>("list_windows"),
  /** Chooses the window the boundary follows (`id` comes from listWindows). */
  setBoundaryWindow: (id: number, title: string) =>
    invoke("set_boundary_window", { id, title }),
  ...optionsService,
  ...profileService,
};
