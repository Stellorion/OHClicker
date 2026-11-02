import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface OverlayState {
  visible: boolean;
  picking: boolean;
  pickPointId?: string | null;
  positionMode: "cursor" | "fixed" | "sequence";
  targetX: number;
  targetY: number;
  jitterPx: number;
  sequencePoints: Array<{ id: string; x: number; y: number; dwell: number }>;
  screenWidth: number;
  screenHeight: number;
  displayId: string;
  originX: number;
  originY: number;
  scaleFactor: number;
}

export const PositionOverlay = () => {
  const [state, setState] = useState<OverlayState>();

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const setup = async () => {
      unlisten = await listen<OverlayState>("overlay-state", (event) => setState(event.payload));
      const current = await invoke<OverlayState>("get_position_overlay_state");
      setState(current);
    };
    void setup();
    return () => unlisten?.();
  }, []);

  const pickAtPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!state?.picking) return;
    event.preventDefault();
    void invoke("complete_position_pick", {
      x: Math.round((event.clientX / window.innerWidth) * state.screenWidth),
      y: Math.round((event.clientY / window.innerHeight) * state.screenHeight),
    }).catch(console.error);
  };

  if (!state) return null;
  const pickIndex = state.pickPointId
    ? state.sequencePoints.findIndex((point) => point.id === state.pickPointId)
    : -1;
  const targets = state.positionMode === "fixed"
    ? [{ id: "fixed", x: state.targetX, y: state.targetY }]
    : state.positionMode === "sequence"
      ? state.sequencePoints
      : [];

  return (
    <div
      className="fixed inset-0 select-none"
      onPointerDown={pickAtPointer}
      style={{ background: "transparent", cursor: state.picking ? "crosshair" : "default" }}
    >
      {targets.map((target, index) => (
        <TargetMarker
          key={target.id}
          x={target.x}
          y={target.y}
          order={state.positionMode === "sequence" ? index + 1 : undefined}
          jitter={state.jitterPx}
          screenWidth={state.screenWidth}
          screenHeight={state.screenHeight}
        />
      ))}
      {state.picking && (
        <div className="fixed left-1/2 top-6 -translate-x-1/2 rounded bg-black/75 px-4 py-2 text-sm font-medium text-white">
          {pickIndex >= 0
            ? `Click the location for point ${pickIndex + 1}`
            : "Click the target location"}
        </div>
      )}
    </div>
  );
};

const TargetMarker = ({
  x,
  y,
  order,
  jitter,
  screenWidth,
  screenHeight,
}: {
  x: number;
  y: number;
  order?: number;
  jitter: number;
  screenWidth: number;
  screenHeight: number;
}) => {
  const w = Math.max(screenWidth, 1);
  const h = Math.max(screenHeight, 1);
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }}
    >
      {jitter > 0 && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500"
          style={{
            width: `max(2px, ${((jitter * 2) / w) * 100}vw)`,
            height: `max(2px, ${((jitter * 2) / w) * 100}vw)`,
          }}
        />
      )}
      <div className="size-2 rounded-full bg-red-500 ring-2 ring-white/80" />
      {order !== undefined && (
        <span className="absolute left-3 top-0 rounded bg-red-600 px-1 text-[10px] font-bold text-white">
          {order}
        </span>
      )}
    </div>
  );
};