import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useACStore } from "../store/useACStore";
import { clickerService } from "../../../services/clickerService";
import { useACTimer } from "./useACTimer";

export const useAC = () => {
  const settings = useACStore((state) => state.settings);
  const stats = useACStore((state) => state.stats);
  const isRunning = useACStore((state) => state.stats.isRunning);
  const setRunningState = useACStore((state) => state.setRunningState);
  const updateStats = useACStore((state) => state.updateStats);
  const resetStats = useACStore((state) => state.resetStats);

  useACTimer({ isRunning, settings, totalClicks: stats.totalClicks, updateStats });

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

    if (newSettings.mouseButton !== undefined) {
      await clickerService.updateMouseButton(newSettings.mouseButton);
    }
    if (newSettings.clickType !== undefined) {
      await clickerService.updateClickType(newSettings.clickType);
    }
    if (newSettings.repeatType !== undefined) {
      await clickerService.updateRepeatType(newSettings.repeatType);
    }
    if (newSettings.fixedCountLimit !== undefined) {
      await clickerService.updateFixedCountLimit(newSettings.fixedCountLimit);
    }
    if (newSettings.maxDurationEnabled !== undefined) {
      await clickerService.updateMaxDurationEnabled(newSettings.maxDurationEnabled);
    }
    if (newSettings.maxDurationSec !== undefined) {
      await clickerService.updateMaxDurationSec(newSettings.maxDurationSec);
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
        const running = event.payload;
        if (running) {
          resetStats();
        }
        setRunningState(running);
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [setRunningState, resetStats]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await listen<{ totalClicks: number; currentCps: number }>(
        "clicker-stats",
        (event) => updateStats(event.payload),
      );
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [updateStats]);

  const toggleExecution = async () => {
    try {
      const isRunningNow = await clickerService.toggleClicker();
      if (isRunningNow) {
        resetStats();
      }
      setRunningState(isRunningNow);
    } catch (error) {
      console.error("Unable to toggle the autoclicker:", error);
    }
  };

  return {
    settings,
    stats,
    isRunning,
    updateSettings,
    toggleExecution,
    updateStats,
    resetStats,
  };
};
