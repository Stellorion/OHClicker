// Profile file types.
// Mirrors backend-src/clicker/profile/  (mod.rs, error.rs, linked.rs).
import type {
  ClickType, CoordinateType, MouseButton, PositionMode,
  RegionMode, RepeatType, SequencePoint,
} from "./clicker-types";

/** Every user setting. Same JSON keys as the Rust `ConfigProfile` (profile/mod.rs). */
export interface ConfigProfile {
  cps: number;
  intervalRandomizationPct: number;
  buttonHoldMs: number;
  startDelayMs: number;
  mouseButton: MouseButton;
  clickType: ClickType;
  repeatType: RepeatType;
  fixedCountLimit: number;
  maxDurationEnabled: boolean;
  maxDurationSec: number;
  boundariesEnabled: boolean;
  regionMode: RegionMode;
  /** Title of the window followed by "choose_window" (found again after a restart). */
  boundaryWindowTitle: string;
  boundaryX: number;
  boundaryY: number;
  boundaryWidth: number;
  boundaryHeight: number;
  stopWhenCursorLeaves: boolean;
  positionMode: PositionMode;
  coordinateType: CoordinateType;
  targetX: number;
  targetY: number;
  jitterPx: number;
  sequencePoints: SequencePoint[];
  startStopHotkey: string;
  toggleOverlayHotkey: string;
}

/** Mirrors Rust `ProfileErrorKind` (+ "unknown" for non-profile errors). */
export type ProfileErrorKind =
  | "read" | "write" | "busy" | "invalid_json"
  | "wrong_format" | "invalid_values" | "hotkey" | "unknown";

/** Mirrors Rust `ProfileError`: shown in the NoticeDialog. */
export interface ProfileError {
  kind: ProfileErrorKind;
  message: string;
  details: string[];
}

/** Mirrors Rust `LinkStatus`. */
export type LinkStatus = "unlinked" | "loaded" | "missing" | "invalid";

/** Mirrors Rust `LinkedProfile`: the profile file that loads automatically on start. */
export interface LinkedProfile {
  path: string | null;
  status: LinkStatus;
  error: ProfileError | null;
  profile: ConfigProfile | null;
}
