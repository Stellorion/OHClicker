import { useACStore } from "../store/useACStore";

export const useAC = () => {
  const settings = useACStore((state) => state.settings);
  const stats = useACStore((state) => state.stats);
  const updateSettings = useACStore((state) => state.updateSettings);
  const setRunningState = useACStore((state) => state.setRunningState);
  const updateStats = useACStore((state) => state.updateStats);
  const resetStats = useACStore((state) => state.resetStats);

  const toggleExecution = () => {
    if (stats.isRunning) {
      setRunningState(false);
    } else {
      resetStats();
      setRunningState(true);
    }
  };

  return {
    settings,
    stats,
    updateSettings,
    toggleExecution,
    updateStats,
    resetStats,
  };
};