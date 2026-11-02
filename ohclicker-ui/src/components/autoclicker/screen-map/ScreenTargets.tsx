import React from "react";
import { pct } from "./constants";

interface ScreenTargetsProps {
  positionMode: string;
  targetX: number;
  targetY: number;
  points: Array<{ x: number; y: number }>;
  screenSize: { width: number; height: number };
}

export const ScreenTargets: React.FC<ScreenTargetsProps> = ({
  positionMode,
  targetX,
  targetY,
  points,
  screenSize,
}) => {
  if (positionMode === "cursor") {
    return null;
  }

  if (positionMode === "sequence") {
    return (
      <>
        {/* Connecting SVG lines between sequence points */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox={`0 0 ${screenSize.width} ${screenSize.height}`}
          preserveAspectRatio="none"
        >
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="8 8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Sequence numbered nodes */}
        {points.map((pt, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 size-5 rounded-full z-20 bg-app-surface border-2 border-app-red flex items-center justify-center text-xs font-bold text-app-text-primary shadow-md pointer-events-none"
            style={{ left: pct(pt.x, screenSize.width), top: pct(pt.y, screenSize.height) }}
          >
            {i + 1}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Vertical tracking line following targetX */}
      <div
        className="absolute top-0 bottom-0 w-px bg-app-red/75 pointer-events-none -translate-x-1/2"
        style={{ left: pct(targetX, screenSize.width) }}
      />
      {/* Horizontal tracking line following targetY */}
      <div
        className="absolute left-0 right-0 h-px bg-app-red/75 pointer-events-none -translate-y-1/2"
        style={{ top: pct(targetY, screenSize.height) }}
      />

      {/* Target marker circle */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
        style={{ left: pct(targetX, screenSize.width), top: pct(targetY, screenSize.height) }}
      >
        <div className="size-3 rounded-full flex items-center justify-center bg-app-surface/50 ring-1 ring-app-red">
          <div className="size-1 rounded-full bg-app-red" />
        </div>
      </div>
    </>
  );
};