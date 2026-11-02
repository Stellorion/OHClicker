import { useEffect, useRef } from "react";
import type { ACSettings, ACStats } from "../types/ac-types";

interface UseACTimerProps {
  isRunning: boolean;
  settings: ACSettings;
  totalClicks: number;
  updateStats: (stats: Partial<ACStats>) => void;
}

export const useACTimer = ({
  isRunning,
  settings,
  totalClicks,
  updateStats,
}: UseACTimerProps) => {
  const totalClicksRef = useRef(totalClicks);

  useEffect(() => {
    totalClicksRef.current = totalClicks;
  }, [totalClicks]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      const startDelaySec = settings.startDelaySec ?? 0;
      const delayMs = startDelaySec * 1000;
      const executionStartTime = Date.now() + delayMs;

      interval = setInterval(() => {
        const now = Date.now();

        if (now < executionStartTime) {
          updateStats({
            totalClicks: 0,
            elapsedMs: 0,
            elapsedFormatted: "00:00",
            avgRate: 0,
          });
          return;
        }

        const activeMs = now - executionStartTime;
        const activeSeconds = activeMs / 1000;

        const clickCount = totalClicksRef.current;
        const avgRate = activeSeconds > 0 ? clickCount / activeSeconds : 0;

        const mins = Math.floor(activeSeconds / 60).toString().padStart(2, "0");
        const secs = Math.floor(activeSeconds % 60).toString().padStart(2, "0");

        updateStats({
          elapsedMs: activeMs,
          elapsedFormatted: `${mins}:${secs}`,
          avgRate: isNaN(avgRate) ? 0 : avgRate,
        });
      }, 50);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isRunning,
    settings.cps,
    settings.startDelaySec,
    updateStats,
  ]);
};