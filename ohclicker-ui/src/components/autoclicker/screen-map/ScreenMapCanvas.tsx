
import { useRef } from "react";
import { ScreenGrid } from "./ScreenGrid";
import { ScreenBoundsOverlay } from "./ScreenBoundsOverlay";
import { ScreenTargets } from "./ScreenTargets";
import type { ScreenMapCanvasProps } from "../../../types/screen-types";

export const ScreenMapCanvas = ({
  screenSize,
  positionMode,
  target,
  points,
  bounds,
  onTargetChange,
}: ScreenMapCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (positionMode !== "fixed") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.round(
      ((e.clientX - rect.left) / rect.width) * screenSize.width
    );

    const y = Math.round(
      ((e.clientY - rect.top) / rect.height) * screenSize.height
    );

    onTargetChange({
      x: Math.max(0, Math.min(screenSize.width - 1, x)),
      y: Math.max(0, Math.min(screenSize.height - 1, y)),
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Screen map target picker"
      style={{
        aspectRatio: `${screenSize.width} / ${screenSize.height}`,
      }}
      className="relative w-full overflow-hidden rounded-md border border-app-border cursor-crosshair focus:outline-none"
    >
      <ScreenGrid />

      <ScreenBoundsOverlay
        screenSize={screenSize}
        bounds={bounds}
      />

      <ScreenTargets
        screenSize={screenSize}
        positionMode={positionMode}
        target={target}
        points={points}
      />
    </div>
  );
};
