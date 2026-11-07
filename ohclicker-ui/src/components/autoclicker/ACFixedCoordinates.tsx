// "Coordinates X / Y + Pick" row of the fixed-point mode.
import { Crosshair } from "lucide-react";
import { Button } from "../common/Button";
import { LabeledInput } from "../common/LabeledInput";
import { OUTLINE_BUTTON } from "../../lib/styles";

interface ACFixedCoordinatesProps {
  x: number;
  y: number;
  isPicking: boolean;
  onChange: (fields: { targetX?: number; targetY?: number }) => void;
  onPick: () => void;
}

export const ACFixedCoordinates: React.FC<ACFixedCoordinatesProps> = ({ x, y, isPicking, onChange, onPick }) => (
  <div className="flex items-center justify-between gap-4">
    <p className="text-sm font-bold text-app-text-primary">Coordinates</p>

    <div className="flex items-center gap-2">
      <LabeledInput label="X" value={x} widthClass="w-24" onChange={(targetX) => onChange({ targetX })} />
      <LabeledInput label="Y" value={y} widthClass="w-24" onChange={(targetY) => onChange({ targetY })} />

      <Button
        type="button"
        onClick={onPick}
        title="Arm the picker, then click a screen location"
        className={OUTLINE_BUTTON}
      >
        <Crosshair className="size-3.5 text-app-red" />
        {isPicking ? "Click target" : "Pick"}
      </Button>
    </div>
  </div>
);
