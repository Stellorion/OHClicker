// Shapes of the stores used by the overlay windows and the Boundaries card.
import type { BoundaryOverlayState, PositionOverlayState } from "./overlay-types";
import type { Size } from "./common";
import type { WindowInfo } from "./window-types";

/**
 * Data pushed by the backend to the overlay windows (store/useOverlayStore.ts).
 * Every window is its own web page, so each one has its own copy of this store.
 */
export interface OverlayStore {
  position?: PositionOverlayState;
  boundary?: BoundaryOverlayState;
  setPosition: (position: PositionOverlayState) => void;
  /** Ignores data equal to the current one (the window poll repeats it). */
  setBoundary: (boundary: BoundaryOverlayState) => void;
}

/** Boundaries -> "Choose window" data (store/useBoundaryStore.ts). */
export interface BoundaryStore {
  /** Open windows the user can choose from. */
  windows: WindowInfo[];
  /** Live size of the chosen window (null = unknown / mode off). */
  liveSize: Size | null;
  setWindows: (windows: WindowInfo[]) => void;
  setLiveSize: (size: Size | null) => void;
}
