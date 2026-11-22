// Props of the target-position card parts (components/autoclicker/ACSequence*, ACFixedCoordinates).
import type { SequencePoint } from "./clicker-types";

export interface ACSequenceRowProps {
  point: SequencePoint;
  /** 1-based position shown in the red circle. */
  order: number;
  isPicking: boolean;
  onUpdate: (fields: Partial<SequencePoint>) => void;
  onPick: () => void;
  onRemove: () => void;
}

export interface ACFixedCoordinatesProps {
  x: number;
  y: number;
  isPicking: boolean;
  onChange: (fields: { targetX?: number; targetY?: number }) => void;
  onPick: () => void;
}

export interface ACSequenceListProps {
  points: SequencePoint[];
  onUpdatePoint: (
    id: string,
    fields: Partial<SequencePoint>
  ) => void;
  onRemovePoint: (id: string) => void;
  onAddPoint: () => void;
  onPickPoint: (id: string) => void;
  pickingPointId: string | null;
}
