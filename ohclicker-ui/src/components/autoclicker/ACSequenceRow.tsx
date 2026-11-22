// One row of the sequence list: number, X, Y, dwell, pick and delete buttons.
import type { ACSequenceRowProps } from "../../types/position-props";
import { Trash2, Crosshair } from "lucide-react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

/** Grid shared with the header row in ACSequenceList. */
export const SEQUENCE_GRID = "grid grid-cols-[24px_1fr_1fr_1fr_28px_28px] items-center gap-2";

const FIELD =
  "w-full text-xs font-bold bg-app-bg border border-app-border rounded-lg py-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const ICON_BUTTON =
  "flex items-center justify-center size-7 rounded-lg transition-colors p-4";

export const ACSequenceRow: React.FC<ACSequenceRowProps> = ({ point, order, isPicking, onUpdate, onPick, onRemove }) => (
  <div className={SEQUENCE_GRID}>
    <div className="flex items-center justify-center size-6 rounded-full border border-app-red/40 text-app-red text-xs font-bold">
      {order}
    </div>

    <Input type="number" value={point.x} onChange={(e) => onUpdate({ x: Number(e.target.value) })} className={`${FIELD} text-center`} />
    <Input type="number" value={point.y} onChange={(e) => onUpdate({ y: Number(e.target.value) })} className={`${FIELD} text-center`} />

    <div className="relative flex items-center">
      <Input type="number" value={point.dwell} onChange={(e) => onUpdate({ dwell: Number(e.target.value) })} className={`${FIELD} pr-7 text-right`} />
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-app-text-muted pointer-events-none select-none">
        ms
      </span>
    </div>

    <Button
      type="button"
      onClick={onPick}
      title={isPicking ? "Click a screen location…" : `Pick location for point ${order}`}
      className={`${ICON_BUTTON} bg-app-bg border border-app-border ${
        isPicking ? "text-app-red bg-app-red/10 animate-pulse" : "text-app-text-muted hover:text-app-red hover:bg-app-border/30"
      }`}
    >
      <Crosshair className="size-4 text-app-red" />
    </Button>

    <Button
      type="button"
      onClick={onRemove}
      title="Delete point"
      className={`${ICON_BUTTON} text-app-text-muted hover:text-app-red hover:bg-app-border/30`}
    >
      <Trash2 className="size-4" />
    </Button>
  </div>
);
