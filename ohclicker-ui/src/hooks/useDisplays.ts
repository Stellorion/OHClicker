// Lists connected displays and keeps a valid one selected.
import { useEffect } from "react";
import { clickerService } from "../services/clickerService";
import type { DisplayInfo } from "../types/ac-types";
import { useDisplayStore } from "../store/useDisplayStore";

/** Returns the display list, the selected display and a refresh function. */
export const useDisplays = (
  selectedId: string,
  onSelect: (id: string) => void,
) => {
  const displays = useDisplayStore((state) => state.displays);
  const setDisplays = useDisplayStore((state) => state.setDisplays);

  /** If the selected id is gone, select the primary (or first) display. */
  const reconcile = (list: DisplayInfo[]) => {
    const selected =
      list.find((display) => display.id === selectedId) ??
      list.find((display) => display.isPrimary) ??
      list[0];
    if (selected && selected.id !== selectedId) onSelect(selected.id);
  };

  useEffect(() => {
    let active = true;
    clickerService
      .getDisplays()
      .then((list) => {
        if (!active) return;
        setDisplays(list);
        reconcile(list);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  /** Re-reads the connected displays (user pressed "Refresh displays"). */
  const refresh = async () => {
    try {
      const list = await clickerService.getDisplays();
      setDisplays(list);
      reconcile(list);
    } catch (error) {
      console.error("Unable to refresh displays:", error);
    }
  };

  const selectedDisplay =
    displays.find((display) => display.id === selectedId) ??
    displays.find((display) => display.isPrimary) ??
    displays[0];

  return { displays, selectedDisplay, refresh };
};