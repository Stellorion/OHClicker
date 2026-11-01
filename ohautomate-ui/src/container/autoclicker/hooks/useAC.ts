import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useACStore } from "../store/useACStore";
import { clickerService } from "../../../services/clickerService";

export const useAC = () => {
  const settings = useACStore((state) => state.settings);
  const stats = useACStore((state) => state.stats);
  const setRunningState = useACStore((state) => state.setRunningState);
  const updateStats = useACStore((state) => state.updateStats);
  const resetStats = useACStore((state) => state.resetStats);

  const updateSettings = async (newSettings: Partial<typeof settings>) => {
    useACStore.getState().updateSettings(newSettings);

    if (newSettings.cps !== undefined) {
      await clickerService.updateCps(newSettings.cps);
    }

    if (newSettings.intervalRandomizationPct !== undefined) {
      await clickerService.updateIntervalRandomizationPct(
        newSettings.intervalRandomizationPct,
      );
    }

    if (newSettings.buttonHoldTimeMs !== undefined) {
      await clickerService.updateButtonHoldMs(newSettings.buttonHoldTimeMs);
    }

    if (newSettings.startDelaySec !== undefined) {
      await clickerService.updateStartDelayMs(newSettings.startDelaySec * 1000);
    }
  };

  useEffect(() => {
    if (settings.cps) {
      clickerService.updateCps(settings.cps);
    }
  }, []);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await listen<boolean>("clicker-state-changed", (event) => {
        const isRunning = event.payload;
        if (isRunning) {
          resetStats();
        }
        setRunningState(isRunning);
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [setRunningState, resetStats]);

  const toggleExecution = async () => {
    const isRunningNow = await clickerService.toggleClicker();
    if (isRunningNow) {
      resetStats();
    }
    setRunningState(isRunningNow);
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