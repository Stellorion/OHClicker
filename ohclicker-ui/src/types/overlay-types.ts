import type { Point } from "./common";
import type { ACPositionMode, ACSequencePoint, ACRegionMode } from './ac-types';

export interface OverlayState {
  visible: boolean;
  picking: boolean;
  pickPointId?: string | null;

  positionMode: ACPositionMode;
  targetX: number;
  targetY: number;
  jitterPx: number;

  sequencePoints: ACSequencePoint[];

  screenWidth: number;
  screenHeight: number;

  displayId: string;
  originX: number;
  originY: number;
  scaleFactor: number;
}

export interface TargetMarkerProps extends Point {
  order?: number;
  jitter: number;
  screenWidth: number;
  screenHeight: number;
}

export interface BoundaryOverlayState {
  visible: boolean;
  regionMode: ACRegionMode;
  x: number;
  y: number;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
}
