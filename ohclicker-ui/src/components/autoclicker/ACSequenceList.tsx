// Editable list of sequence points (position mode "Sequence").
import { Plus } from "lucide-react";
import { Button } from "../common/Button";
import { ACSequenceRow, SEQUENCE_GRID } from "./ACSequenceRow";
import { OUTLINE_BUTTON } from "../../lib/styles";
import type { ACSequenceListProps } from "../../types/sequence-types";

export const ACSequenceList: React.FC<ACSequenceListProps> = ({
  points,
  onUpdatePoint,
  onRemovePoint,
  onAddPoint,
  onPickPoint,
  pickingPointId,
}) => (
  <div className="space-y-3 pt-1">
    <div className={`${SEQUENCE_GRID} px-1 text-xs font-medium text-app-text-muted`}>
      <span>#</span>
      <span className="pl-1">X</span>
      <span className="pl-1">Y</span>
      <span className="pl-1">Dwell</span>
      <span className="sr-only">Actions</span>
    </div>

    <div className="space-y-2">
      {points.map((point, index) => (
        <ACSequenceRow
          key={point.id}
          point={point}
          order={index + 1}
          isPicking={pickingPointId === point.id}
          onUpdate={(fields) => onUpdatePoint(point.id, fields)}
          onPick={() => onPickPoint(point.id)}
          onRemove={() => onRemovePoint(point.id)}
        />
      ))}
    </div>

    <div className="pt-1">
      <Button type="button" onClick={onAddPoint} className={OUTLINE_BUTTON}>
        <Plus className="size-3.5" />
        Add point
      </Button>
    </div>
  </div>
);
