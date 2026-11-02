import type { Point, Size, Bounds } from './common';
import type { ACPositionMode } from './ac-types';

export interface ScreenBoundsOverlayProps {
  bounds: Bounds;
  screenSize: Size;
}

export interface ScreenMapCanvasProps {
  screenSize: Size;
  positionMode: ACPositionMode;
  target: Point;
  points: Point[];
  bounds: Bounds;
  onTargetChange: (target: Point) => void;
}

export interface ScreenTargetsProps {
  positionMode: ACPositionMode;
  target: Point;
  points: Point[];
  screenSize: Size;
}