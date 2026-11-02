import React from "react";
import { SCREEN, pct } from "./constants";

interface ScreenBoundsOverlayProps {
  enabled: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ScreenBoundsOverlay: React.FC<ScreenBoundsOverlayProps> = ({
  enabled,
  x,
  y,
  width,
  height,
}) => {
  if (!enabled) return null;

  return (
    <div
      className="absolute border border-dashed border-app-red rounded-sm bg-app-red/4 pointer-events-none"
      style={{
        left: pct(x, SCREEN.w),
        top: pct(y, SCREEN.h),
        width: pct(width, SCREEN.w),
        height: pct(height, SCREEN.h),
      }}
    >
      <span className="absolute -top-5 left-0 bg-app-red text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider">
        BOUNDS
      </span>
    </div>
  );
};