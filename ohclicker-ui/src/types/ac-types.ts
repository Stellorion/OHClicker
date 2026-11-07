// Types used by the UI state.
// Shared basic types live in clicker-types.ts / display-types.ts (they mirror the backend).
import type { ConfigProfile } from "./profile-types";

export type {
  ClickType, CoordinateType, MouseButton, PositionMode,
  RegionMode, RepeatType, SequencePoint,
} from "./clicker-types";
export type { DisplayInfo } from "./display-types";

/**
 * UI settings = everything saved in a profile (`ConfigProfile`)
 * + a few values that only exist in the UI.
 */
export interface ACSettings extends ConfigProfile {
  scaleFactor: number;
  /** Derived from `cps`, shown in the estimate widget. */
  exactIntervalMs: number;
  /** Id of the display the screen map / overlays are relative to. */
  selectedDisplayId: string;
  /** Handle of the chosen window (runtime only, not saved in profiles). */
  boundaryWindowId: number;
  targetWindow: string;

  boundaryWindowOpen: boolean;
}

/** Live numbers while the clicker runs (event `clicker-stats` + the UI timer). */
export interface ACStats {
  elapsedFormatted: string;
  avgRate: number;
  isRunning: boolean;
  totalClicks: number;
  elapsedMs: number;
  currentCps: number;
}
