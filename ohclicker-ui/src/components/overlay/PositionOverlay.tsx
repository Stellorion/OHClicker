import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { PositionOverlayState } from "../../types/overlay-types";
import { useOverlayStore } from "../../store/useOverlayStore";
import { TargetMarker } from "./TargetMarker";

// Transparent full-screen window that shows the target / sequence points and,
// while the picker is armed, turns the click into a position (backend: clicker/overlay/).

/** Root component of the `position-overlay` window (see main.tsx). */
export const PositionOverlay = () => {
  const state = useOverlayStore((s) => s.position);
  const setPosition = useOverlayStore((s) => s.setPosition);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const setup = async () => {
      unlisten = await listen<PositionOverlayState>("overlay-state", (event) => setPosition(event.payload));
      const current = await invoke<PositionOverlayState>("get_position_overlay_state");
      setPosition(current);
    };
    void setup();
    return () => unlisten?.();
  }, [setPosition]);

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
