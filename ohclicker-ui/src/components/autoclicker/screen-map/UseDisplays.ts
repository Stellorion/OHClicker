import { useEffect, useState } from "react";
import { clickerService } from "../../../services/clickerService";
import type { ACDisplay } from "../../../types/ac-types";

export const useDisplays = (
  selectedId: string,
  onSelect: (id: string) => void,
) => {
  const [displays, setDisplays] = useState<ACDisplay[]>([]);

  const reconcile = (list: ACDisplay[]) => {
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