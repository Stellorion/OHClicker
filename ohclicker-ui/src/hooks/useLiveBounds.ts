// Size of the chosen window while Boundaries -> "Choose window" is on.
// Polls the backend (clicker/overlay/boundary_state.rs) every 100 ms.
import { useEffect, useState } from "react";
import { clickerService } from "../services/clickerService";
import type { Size } from "../types/common";
import { useACStore } from "../store/useACStore";

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
        .then((s) => {
          setSize({ width: s.width, height: s.height });
          // Store only (the backend already has the new title): keeps the label live.
          const { settings, updateSettings } = useACStore.getState();
          const title = s.windowTitle || settings.boundaryWindowTitle;
          if (
            title !== settings.boundaryWindowTitle ||
            s.windowOpen !== settings.boundaryWindowOpen
          ) {
            updateSettings({
              boundaryWindowTitle: title,
              boundaryWindowOpen: s.windowOpen,
            });
          }
        })
        .catch(() => undefined);
    void fetchBounds();
    const id = window.setInterval(fetchBounds, 100);
    return () => window.clearInterval(id);
  }, [active]);

  return size;
};
