// Props of the Boundaries card parts (components/autoclicker/ACBoundary*, ACWindow*, ACRectangleRow).
import type { WindowInfo } from "./window-types";

/** The four numbers of the custom rectangle (same names as in the profile). */
export type BoundaryField =
  | "boundaryX"
  | "boundaryY"
  | "boundaryWidth"
  | "boundaryHeight";

export interface ACRectangleRowProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onChange: (field: BoundaryField, value: number) => void;
}

export interface ACWindowRowProps {
  title: string;
  onChoose: (window: WindowInfo) => void;
  isOpen: boolean;
}

export interface ACBoundaryRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Inputs are only editable in "Custom" region mode. */
  disabled: boolean;
  onChange: (field: BoundaryField, value: number) => void;
}

export interface ACWindowPickerProps {
  title: string;
  onChoose: (window: WindowInfo) => void;
  isOpen: boolean;
}
