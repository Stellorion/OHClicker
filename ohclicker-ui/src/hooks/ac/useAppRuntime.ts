// Everything that must run exactly once for the whole app (called from App.tsx).
import { useACStore } from "../../store/useACStore";
import { useACTimer } from "../useACTimer";
import { useBackendEvents } from "./useBackendEvents";

export const useAppRuntime = () => {
  const settings = useACStore((state) => state.settings);
  const isRunning = useACStore((state) => state.stats.isRunning);
  const totalClicks = useACStore((state) => state.stats.totalClicks);
  const updateStats = useACStore((state) => state.updateStats);

  useBackendEvents();
  useACTimer({ isRunning, settings, totalClicks, updateStats });
};
