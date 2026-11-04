import type {
  ACClickType,
  ACCoordinateType,
  ACMouseButton,
  ACPositionMode,
  ACRegionMode,
  ACSequencePoint,
} from "./ac-types";

/** Shape of the profile JSON file (matches Rust `ConfigProfile`). */
export interface ConfigProfile {
  cps: number;
  intervalRandomizationPct: number;
  buttonHoldMs: number;
  startDelayMs: number;
  mouseButton: ACMouseButton;
  clickType: ACClickType;
  repeatType: "until_stopped" | "fixed_count";
  fixedCountLimit: number;
  maxDurationEnabled: boolean;
  maxDurationSec: number;
  boundariesEnabled: boolean;
  regionMode: ACRegionMode;
  boundaryX: number;
  boundaryY: number;
  boundaryWidth: number;
  boundaryHeight: number;
  stopWhenCursorLeaves: boolean;
  positionMode: ACPositionMode;
  coordinateType: ACCoordinateType;
  targetX: number;
  targetY: number;
  jitterPx: number;
  sequencePoints: ACSequencePoint[];
  startStopHotkey: string;
  pickPositionHotkey: string;
  toggleOverlayHotkey: string;
}

export type ProfileErrorKind =
  | "read"
  | "write"
  | "busy"
  | "invalid_json"
  | "wrong_format"
  | "invalid_values"
  | "hotkey"
  | "unknown";

export interface ProfileError {
  kind: ProfileErrorKind;
  message: string;
  details: string[];
}
