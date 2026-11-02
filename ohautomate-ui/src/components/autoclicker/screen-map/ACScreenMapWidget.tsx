import React, { useRef } from "react";
import { Target } from "lucide-react";
import { useAC } from "../../../hooks/useAC";
import { Separator } from "../../common/Separator";
import { SCREEN } from "./constants";
import { ScreenGrid } from "./ScreenGrid";
import { ScreenBoundsOverlay } from "./ScreenBoundsOverlay";
import { ScreenTargets } from "./ScreenTargets";

export const ACScreenMapWidget: React.FC = () => {
  const { settings, updateSettings } = useAC();
  const containerRef = useRef<HTMLDivElement>(null);

  const positionMode = settings.positionMode ?? "fixed";
  const boundariesEnabled = settings.boundariesEnabled ?? false;
  const boundaryX = settings.boundaryX ?? 320;
  const boundaryY = settings.boundaryY ?? 180;
  const boundaryWidth = settings.boundaryWidth ?? 1280;
  const boundaryHeight = settings.boundaryHeight ?? 720;
  const targetX = settings.targetX ?? 960;
  const targetY = settings.targetY ?? 540;
  const points = settings.sequencePoints ?? [
    { x: 412, y: 288 },
    { x: 1280, y: 420 },
    { x: 960, y: 780 },
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (positionMode !== "fixed") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newX = Math.round((clickX / rect.width) * SCREEN.w);
    const newY = Math.round((clickY / rect.height) * SCREEN.h);

    updateSettings({
      targetX: Math.max(0, Math.min(SCREEN.w, newX)),
      targetY: Math.max(0, Math.min(SCREEN.h, newY)),
    });
  };

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Target className="size-4 text-app-text-muted shrink-0" />
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Screen map
          </h3>
          <span className="text-xs font-mono text-app-text-muted">
            {SCREEN.w} × {SCREEN.h} · Primary display
          </span>
        </div>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div
        ref={containerRef}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Screen map target picker"
        className="relative w-full h-44 overflow-hidden cursor-crosshair focus:outline-none"
      >
        <ScreenGrid />
        <ScreenBoundsOverlay
          enabled={boundariesEnabled}
          x={boundaryX}
          y={boundaryY}
          width={boundaryWidth}
          height={boundaryHeight}
        />
        <ScreenTargets
          positionMode={positionMode}
          targetX={targetX}
          targetY={targetY}
          points={points}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs font-mono text-app-text-secondary px-0.5">
        <span>
          Target{" "}
          <strong className="text-app-text-primary">
            {positionMode === "sequence"
              ? `${points.length} points`
              : positionMode === "cursor"
              ? "Follow cursor"
              : `${targetX}, ${targetY}`}
          </strong>
        </span>
        <span>
          Bounds{" "}
          <strong className="text-app-text-primary">
            {boundariesEnabled
              ? `${boundaryWidth}×${boundaryHeight}`
              : "Disabled"}
          </strong>
        </span>
      </div>
    </div>
  );
};