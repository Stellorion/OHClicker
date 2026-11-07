// Basic click settings types.
// Mirrors backend-src/clicker/state.rs   (MouseButton, ClickType, RepeatType, RegionMode)
//     and backend-src/clicker/position.rs (PositionMode, CoordinateType, SequencePoint).
// Keep names AND values identical on both sides.
import type { Point } from "./common";

export type MouseButton = "left" | "middle" | "right";
export type ClickType = "single" | "hold";
export type RepeatType = "until_stopped" | "fixed_count";
export type RegionMode = "fullscreen" | "choose_window" | "custom";
export type PositionMode = "cursor" | "fixed" | "sequence";
export type CoordinateType = "absolute" | "relative";

/** One step of a sequence: where to click and the wait afterwards (ms). */
export interface SequencePoint extends Point {
  id: string;
  dwell: number;
}
