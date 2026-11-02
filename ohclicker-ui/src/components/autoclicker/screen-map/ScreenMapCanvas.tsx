import React, { useRef } from "react";
import type { ACPositionMode } from "../../../types/ac-types";
import { ScreenGrid } from "./ScreenGrid";
import { ScreenBoundsOverlay } from "./ScreenBoundsOverlay";
import { ScreenTargets } from "./ScreenTargets";

interface ScreenMapCanvasProps {
  screenSize: { width: number; height: number };
  positionMode: ACPositionMode;
  target: { x: number; y: number };
  points: Array<{ x: number; y: number }>;
  bounds: {
    enabled: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Called with display-local pixel coordinates when the map is clicked. */
  onTargetChange: (x: number, y: number) => void;
}

/** The clickable map; it takes the real shape of the selected display. */
export const ScreenMapCanvas: React.FC<ScreenMapCanvasProps> = ({
  screenSize,
  positionMode,
  target,
  points,
  bounds,
  onTargetChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (positionMode !== "fixed") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.round(((e.clientX - rect.left) / rect.width) * screenSize.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * screenSize.height);

    onTargetChange(
      Math.max(0, Math.min(screenSize.width - 1, x)),
      Math.max(0, Math.min(screenSize.height - 1, y)),
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Screen map target picker"
      style={{ aspectRatio: `${screenSize.width} / ${screenSize.height}` }}
      className="relative w-full overflow-hidden rounded-md border border-app-border cursor-crosshair focus:outline-none"
    >
      <ScreenGrid />
      <ScreenBoundsOverlay
        screenSize={screenSize}
        enabled={bounds.enabled}
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
      />
      <ScreenTargets
        screenSize={screenSize}
        positionMode={positionMode}
        targetX={target.x}
        targetY={target.y}
        points={points}
      />
    </div>
  );
};