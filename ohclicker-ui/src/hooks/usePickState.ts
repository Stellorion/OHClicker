// Tracks whether the position picker is armed (and for which sequence point).
// Backend: clicker/overlay/control.rs + pick.rs (events position-pick-armed / -picked / -cancelled).
import { useEffect } from "react";
import { clickerService } from "../services/clickerService";
import { usePickStore } from "../store/usePickStore";
import { useTauriEvent } from "./useTauriEvent";

export const usePickState = () => {
  const isPicking = usePickStore((state) => state.isPicking);
  const pickingPointId = usePickStore((state) => state.pickingPointId);
  const setPicking = usePickStore((state) => state.setPicking);

  useTauriEvent<string | null>("position-pick-armed", (id) => setPicking(true, id ?? null));
  useTauriEvent("position-picked", () => setPicking(false));
  useTauriEvent("position-pick-cancelled", () => setPicking(false));

  // The picker may already be armed (hotkey) before this component mounted.
  useEffect(() => {
    clickerService
      .getPositionOverlayState()
      .then((state) => setPicking(state.picking, state.picking ? (state.pickPointId ?? null) : null))
      .catch(() => undefined);
  }, []);

  return { isPicking, pickingPointId, setPicking };
};
