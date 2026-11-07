// Overlay window types.
// `PositionOverlayState` mirrors backend-src/clicker/overlay/position_state.rs,
// `BoundaryOverlayState` mirrors backend-src/clicker/overlay/boundary_state.rs.
import type { Point } from "./common";
import type { PositionMode, RegionMode, SequencePoint } from "./clicker-types";

/** Pushed by the backend (event `overlay-state`) to the position overlay. */
export interface PositionOverlayState {
  visible: boolean;
  picking: boolean;
  pickPointId?: string | null;

  positionMode: PositionMode;
  targetX: number;
  targetY: number;
  jitterPx: number;

  sequencePoints: SequencePoint[];

  screenWidth: number;
  screenHeight: number;

  displayId: string;
  originX: number;
  originY: number;
  scaleFactor: number;
}

/** Props of one target dot on the position overlay. */
export interface TargetMarkerProps extends Point {
  order?: number;
  jitter: number;
  screenWidth: number;
  screenHeight: number;
}

/** Pushed by the backend (event `boundary-state`). Rect is relative to the selected display. */
export interface BoundaryOverlayState {
  visible: boolean;
  regionMode: RegionMode;
  windowTitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  windowOpen: boolean;
}
