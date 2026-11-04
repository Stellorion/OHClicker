// Props of the screen map components (components/autoclicker/screen-map).
import type { Point, Size, Bounds } from './common';
import type { PositionMode } from './ac-types';

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