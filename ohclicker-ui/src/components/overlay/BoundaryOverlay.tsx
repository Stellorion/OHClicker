// Transparent full-screen window that draws the click region (backend: clicker/overlay/boundary_state.rs).
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { BoundaryOverlayState } from "../../types/overlay-types";

const LABELS: Record<BoundaryOverlayState["regionMode"], string> = {
  fullscreen: "FULL SCREEN",
  active_window: "ACTIVE WINDOW",
  custom: "CUSTOM",
};

/** Root of the `boundary-overlay` window; follows the focused window in "active window" mode. */
export const BoundaryOverlay = () => {
  const [state, setState] = useState<BoundaryOverlayState>();

  // Initial state + pushes from the backend (toggle, mode, rectangle, display changes)
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const setup = async () => {
      unlisten = await listen<BoundaryOverlayState>("boundary-state", (event) =>
        setState(event.payload),
      );
      setState(await invoke<BoundaryOverlayState>("get_boundary_overlay_state"));
    };
    void setup();
    return () => unlisten?.();
  }, []);

  // The focused window moves around on its own, so poll while in that mode
  const following = !!state?.visible && state.regionMode === "active_window";
  useEffect(() => {
    if (!following) return;
    const id = window.setInterval(() => {
      invoke<BoundaryOverlayState>("get_boundary_overlay_state")
        .then((next) =>
          setState((prev) =>
            prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
          ),
        )
        .catch(() => {});
    }, 100);
    return () => window.clearInterval(id);
  }, [following]);

  if (!state || !state.visible || state.width <= 0 || state.height <= 0) {
    return null;
  }

  // Percentages of the display, same approach as PositionOverlay (DPI independent)
  const w = Math.max(state.screenWidth, 1);
  const h = Math.max(state.screenHeight, 1);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ background: "transparent" }}
    >
      <div
        className="absolute box-border border-2 border-dashed border-red-500 bg-red-500/5"
        style={{
          left: `${(state.x / w) * 100}%`,
          top: `${(state.y / h) * 100}%`,
          width: `${(state.width / w) * 100}%`,
          height: `${(state.height / h) * 100}%`,
        }}
      >
        <span className="absolute left-0 top-0 rounded-br bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white">
          {LABELS[state.regionMode]}
        </span>
      </div>
    </div>
  );
};
