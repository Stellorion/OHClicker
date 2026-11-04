// Main hook for components: read settings/stats, change settings, start/stop.
// (Backend events and the elapsed-time timer run once in hooks/ac/useAppRuntime.ts.)
import { useACStore } from "../store/useACStore";
import { clickerService } from "../services/clickerService";
import { pushSettings } from "./ac/pushSettings";
import { pushHotkeys } from "./ac/pushHotkeys";
import type { ACSettings } from "../types/ac-types";

export const useAC = () => {
  const settings = useACStore((state) => state.settings);
  const stats = useACStore((state) => state.stats);
  const isRunning = useACStore((state) => state.stats.isRunning);
  const setRunningState = useACStore((state) => state.setRunningState);
  const updateStats = useACStore((state) => state.updateStats);
  const resetStats = useACStore((state) => state.resetStats);

  /** Updates the UI immediately, then sends the change to the backend. */
  const updateSettings = async (changed: Partial<ACSettings>) => {
    const previous = useACStore.getState().settings;
    useACStore.getState().updateSettings(changed);
    await pushSettings(changed);
    await pushHotkeys(changed, previous);
  };

  /** Start/stop button. The backend answers with the new running state. */
  const toggleExecution = async () => {
    try {
      const isRunningNow = await clickerService.toggleClicker();
      if (isRunningNow) resetStats();
      setRunningState(isRunningNow);
    } catch (error) {
      console.error("Unable to toggle the autoclicker:", error);
    }
  };

  return { settings, stats, isRunning, updateSettings, toggleExecution, updateStats, resetStats };
};
