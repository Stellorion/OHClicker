// Text line under the screen map: current target and current bounds size.
import type { ScreenMapFooterProps } from "../../../types/screen-types";
import type { Size } from "../../../types/common";

/** "1280×720" */
const dims = (size: Size) => `${size.width}×${size.height}`;

export const ScreenMapFooter: React.FC<ScreenMapFooterProps> = (p) => {
  const targetText =
    p.positionMode === "sequence" ? `${p.pointCount} points`
    : p.positionMode === "cursor" ? "Follow cursor"
    : `${p.target.x}, ${p.target.y}`;

  const boundsText = !p.bounds.enabled ? "Disabled"
    : p.regionMode === "fullscreen" ? dims(p.screenSize)
    : p.regionMode === "choose_window" && p.liveBounds ? dims(p.liveBounds)
    : dims(p.bounds);

  return (
    <div className="flex items-center justify-between gap-3 mt-2 mb-3 text-xs font-mono text-app-text-secondary px-0.5">
      <span>Target <strong className="text-app-text-primary">{targetText}</strong></span>
      <span>Bounds <strong className="text-app-text-primary">{boundsText}</strong></span>
    </div>
  );
};
