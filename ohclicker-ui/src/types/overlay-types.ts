import type { Point } from "./common";
import type { ACPositionMode, ACSequencePoint } from './ac-types';

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