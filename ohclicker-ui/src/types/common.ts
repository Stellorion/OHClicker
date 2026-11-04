// Small geometry types.
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds extends Point, Size {
  enabled: boolean;
}