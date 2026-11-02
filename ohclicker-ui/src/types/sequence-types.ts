import type { ACSequencePoint } from './ac-types';

export interface ACSequenceListProps {
  points: ACSequencePoint[];
  onUpdatePoint: (
    id: string,
    fields: Partial<ACSequencePoint>
  ) => void;
  onRemovePoint: (id: string) => void;
  onAddPoint: () => void;
  onPickPoint: (id: string) => void;
  pickingPointId: string | null;
}