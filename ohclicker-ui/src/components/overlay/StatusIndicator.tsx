// Tiny "● ACTIVE" pill in a screen corner (the `status-indicator` window).
// Shown by the backend while the overlay is visible and the clicker is running
// (backend-src/status/indicator.rs). Drag it to move it.
import { clickerService } from "../../services/clickerService";

export const StatusIndicator = () => (
  
  <div className="fixed inset-0 select-none p-0.5">
    <div
      title="Drag to move"
      // Left mouse button: let the backend start moving the whole window.
      onMouseDown={(e) => {
        if (e.button === 0) void clickerService.startStatusDrag();
      }}
      className="flex h-full w-full cursor-grab items-center justify-center gap-2 rounded-full border border-white/10 bg-black/75 text-[11px] font-extrabold tracking-wider text-white"
    >
      <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
      ACTIVE
    </div>
  </div>
);
