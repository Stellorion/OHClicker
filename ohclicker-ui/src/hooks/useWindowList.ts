// Open windows for Boundaries -> "Choose window".
// Backend: clicker/os_windows/list.rs (command `list_windows`).
import { useCallback, useEffect, useState } from "react";
import { clickerService } from "../services/clickerService";
import type { WindowInfo } from "../types/window-types";

export const useWindowList = () => {
  const [windows, setWindows] = useState<WindowInfo[]>([]);

  /** Reads the open windows again (they change all the time). */
  const refresh = useCallback(async () => {
    try {
      setWindows(await clickerService.listWindows());
    } catch {
      setWindows([]);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { windows, refresh };
};
