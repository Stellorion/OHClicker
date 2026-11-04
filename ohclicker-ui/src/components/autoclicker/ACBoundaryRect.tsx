// X / Y / W / H inputs of the custom boundary rectangle (pixels, relative to the selected display).
import { LabeledInput } from "../common/LabeledInput";
import type { BoundaryField } from "../../hooks/useBoundaries";

interface ACBoundaryRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Inputs are only editable in "Custom" region mode. */
  disabled: boolean;
  onChange: (field: BoundaryField, value: number) => void;
}

export const ACBoundaryRect: React.FC<ACBoundaryRectProps> = ({ x, y, width, height, disabled, onChange }) => {
  const fields: { label: string; value: number; key: BoundaryField }[] = [
    { label: "X", value: x, key: "boundaryX" },
    { label: "Y", value: y, key: "boundaryY" },
    { label: "W", value: width, key: "boundaryWidth" },
    { label: "H", value: height, key: "boundaryHeight" },
  ];

  return (
    <div className="flex items-center gap-2">
      {fields.map((field) => (
        <LabeledInput
          key={field.key}
          label={field.label}
          value={field.value}
          disabled={disabled}
          widthClass="w-20"
          onChange={(value) => onChange(field.key, value)}
        />
      ))}
    </div>
  );
};
