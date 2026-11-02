import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import type { SequencePoint } from "../../hooks/usePosition";

interface ACSequenceListProps {
  points: SequencePoint[];
  onUpdatePoint: (id: string, fields: Partial<SequencePoint>) => void;
  onRemovePoint: (id: string) => void;
  onAddPoint: () => void;
}

export const ACSequenceList: React.FC<ACSequenceListProps> = ({
  points,
  onUpdatePoint,
  onRemovePoint,
  onAddPoint,
}) => {
  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-[24px_1fr_1fr_1fr_28px] items-center gap-2 px-1 text-xs font-medium text-app-text-muted">
        <span>#</span>
        <span className="pl-1">X</span>
        <span className="pl-1">Y</span>
        <span className="pl-1">Dwell</span>
        <span className="sr-only">Actions</span>
      </div>

      <div className="space-y-2">
        {points.map((point, index) => (
          <div
            key={point.id}
            className="grid grid-cols-[24px_1fr_1fr_1fr_28px] items-center gap-2"
          >
            <div className="flex items-center justify-center size-6 rounded-full border border-app-red/40 text-app-red text-xs font-bold">
              {index + 1}
            </div>

            <Input
              type="number"
              value={point.x}
              onChange={(e) =>
                onUpdatePoint(point.id, { x: Number(e.target.value) })
              }
              className="w-full text-center text-xs font-bold bg-app-bg border border-app-border rounded-lg py-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <Input
              type="number"
              value={point.y}
              onChange={(e) =>
                onUpdatePoint(point.id, { y: Number(e.target.value) })
              }
              className="w-full text-center text-xs font-bold bg-app-bg border border-app-border rounded-lg py-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <div className="relative flex items-center">
              <Input
                type="number"
                value={point.dwell}
                onChange={(e) =>
                  onUpdatePoint(point.id, { dwell: Number(e.target.value) })
                }
                className="w-full pr-7 text-right text-xs font-bold bg-app-bg border border-app-border rounded-lg py-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-app-text-muted pointer-events-none select-none">
                ms
              </span>
            </div>

            <Button
              type="button"
              onClick={() => onRemovePoint(point.id)}
              className="flex items-center justify-center size-7 text-app-text-muted hover:text-app-red hover:bg-app-border/30 rounded-lg transition-colors p-0"
              title="Delete point"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <Button
          type="button"
          onClick={onAddPoint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border/40 border border-app-border rounded-lg text-xs font-bold text-app-text-primary transition-all"
        >
          <Plus className="size-3.5" />
          Add point
        </Button>
      </div>
    </div>
  );
};