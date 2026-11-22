// "Rectangle" row of the Boundaries card (only shown for Region = Custom).
import type { ACRectangleRowProps } from "../../types/boundary-props";
import { ACBoundaryRect } from "./ACBoundaryRect";

export const ACRectangleRow: React.FC<ACRectangleRowProps> = ({
  x,
  y,
  width,
  height,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-app-text-primary">Rectangle</p>
      <label className="text-xs text-app-text-secondary block leading-relaxed">
        Origin and size in pixels
      </label>
    </div>
    <ACBoundaryRect
      x={x}
      y={y}
      width={width}
      height={height}
      disabled={false}
      onChange={onChange}
    />
  </div>
);
