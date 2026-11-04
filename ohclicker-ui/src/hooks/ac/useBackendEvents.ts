// Listens to the events the Rust backend emits and copies them into the UI store.
// Call it ONCE (hooks/ac/useAppRuntime.ts), not in every component.
import { useACStore } from "../../store/useACStore";
import { useTauriEvent } from "../useTauriEvent";
import { pushSettings } from "./pushSettings";

/** Payload of `position-picked` (backend: clicker/overlay/pick.rs). */
interface PickedPoint {
  x: number;
  y: number;
  pointId?: string | null;
}

export const useBackendEvents = () => {
  // The clicker started/stopped (also when it stopped itself: limit reached, cursor left region).
  useTauriEvent<boolean>("clicker-state-changed", (running) => {
    const { resetStats, setRunningState } = useACStore.getState();
    if (running) resetStats();
    setRunningState(running);
  });

  // Click counter + current clicks per second (backend: engine/stats.rs).
  useTauriEvent<{ totalClicks: number; currentCps: number }>("clicker-stats", (stats) =>
    useACStore.getState().updateStats(stats),
  );

  // The user clicked a position while the picker was armed.
  useTauriEvent<PickedPoint>("position-picked", ({ x, y, pointId }) => {
    const { settings, updateSettings } = useACStore.getState();
    if (pointId) {
      const sequencePoints = settings.sequencePoints.map((p) => (p.id === pointId ? { ...p, x, y } : p));
      updateSettings({ sequencePoints });
      void pushSettings({ sequencePoints });
      return;
    }
    updateSettings({ positionMode: "fixed", targetX: x, targetY: y });
  });
};
