// Props of the sequence list (components/autoclicker/ACSequenceList.tsx).
import type { SequencePoint } from './ac-types';

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