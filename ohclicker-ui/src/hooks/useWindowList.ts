// Open windows for Boundaries -> "Choose window".
// Backend: clicker/os_windows/list.rs (command `list_windows`).
import { useCallback, useEffect } from "react";
import { clickerService } from "../services/clickerService";
import { useBoundaryStore } from "../store/useBoundaryStore";

export const useWindowList = () => {
  const windows = useBoundaryStore((state) => state.windows);
  const setWindows = useBoundaryStore((state) => state.setWindows);

  /** Reads the open windows again (they change all the time). */
  const refresh = useCallback(async () => {
    try {
      setWindows(await clickerService.listWindows());
    } catch {
      setWindows([]);
    }
  }, [setWindows]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { windows, refresh };
};
