// Dashed rectangle of the boundaries on the screen map.
import { pct } from "../../../lib/utils";
import type { ScreenBoundsOverlayProps } from "../../../types/screen-types";

/** Hidden while Boundaries are off. */
export const ScreenBoundsOverlay = ({
  bounds,
  screenSize,
}: ScreenBoundsOverlayProps) => {
  if (!bounds.enabled) return null;

  return (
    <div
      className="absolute border border-dashed border-app-red rounded-sm bg-app-red/4 pointer-events-none"
      style={{
        left: pct(bounds.x, screenSize.width),
        top: pct(bounds.y, screenSize.height),
        width: pct(bounds.width, screenSize.width),
        height: pct(bounds.height, screenSize.height),
      }}
    >
      <span className="absolute -top-5 left-0 bg-app-red text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider">
        BOUNDS
      </span>
    </div>
  );
};