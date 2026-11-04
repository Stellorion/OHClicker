// Size of the focused window while Boundaries -> "Active window" is on.
// Polls the backend (clicker/overlay/boundary_state.rs) every 100 ms.
import { useEffect, useState } from "react";
import { clickerService } from "../services/clickerService";
import type { Size } from "../types/common";

/** Returns the live size, or null when `active` is false / no window is focused. */
export const useLiveBounds = (active: boolean): Size | null => {
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    if (!active) {
      setSize(null);
      return;
    }
    const fetchBounds = () =>
      clickerService
        .getBoundaryOverlayState()
        .then((s) => setSize({ width: s.width, height: s.height }))
        .catch(() => undefined); // no focused window right now
    void fetchBounds();
    const id = window.setInterval(fetchBounds, 100);
    return () => window.clearInterval(id);
  }, [active]);

  return size;
};
