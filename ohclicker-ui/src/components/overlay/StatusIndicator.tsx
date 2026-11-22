// Tiny "● ACTIVE" / "● IDLE" pill in a screen corner (the `status-indicator` window).
// The backend shows it while the overlay is visible and tells it whether the clicker is
// running by calling `window.__ohcIndicator(true | false)` (backend-src/status/indicator.rs).
// Drag it to move it.
import { useEffect } from "react";
import { clickerService } from "../../services/clickerService";
import { useStatusStore } from "../../store/useStatusStore";

export const StatusIndicator = () => {
  const active = useStatusStore((state) => state.indicatorActive);

  // Expose the function the backend calls.
  useEffect(() => {
    window.__ohcIndicator = (isActive) =>
      useStatusStore.getState().setIndicatorActive(isActive);
    return () => {
      delete window.__ohcIndicator;
    };
  }, []);

  return (
    <div className="fixed inset-0 select-none p-0.5">
      <div
        title="Drag to move"
        // Left mouse button: let the backend start moving the whole window.
        onMouseDown={(e) => {
          if (e.button === 0) void clickerService.startStatusDrag();
        }}
        className="flex h-full w-full cursor-grab items-center justify-center gap-2 rounded-full border border-white/10 bg-black/75 text-[11px] font-extrabold tracking-wider text-white"
      >
        <span
          className={`size-2 rounded-full ${
            active ? "animate-pulse bg-emerald-400" : "bg-zinc-500"
          }`}
        />
        {active ? "ACTIVE" : "IDLE"}
      </div>
    </div>
  );
};
