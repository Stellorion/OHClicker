// Props of the screen map components (components/autoclicker/screen-map).
import type { Point, Size, Bounds } from './common';
import type { PositionMode, RegionMode } from './ac-types';

export interface ScreenBoundsOverlayProps {
  bounds: Bounds;
  screenSize: Size;
}

export interface ScreenMapCanvasProps {
  screenSize: Size;
  positionMode: PositionMode;
  target: Point;
  points: Point[];
  bounds: Bounds;
  onTargetChange: (target: Point) => void;
}

export interface ScreenTargetsProps {
  positionMode: PositionMode;
  target: Point;
  points: Point[];
  screenSize: Size;
}

export interface ScreenMapFooterProps {
  positionMode: PositionMode;
  target: Point;
  pointCount: number;
  bounds: Bounds;
  regionMode: RegionMode;
  screenSize: Size;
  /** Size of the chosen window ("choose window" mode), null when unknown. */
  liveBounds: Size | null;
}
