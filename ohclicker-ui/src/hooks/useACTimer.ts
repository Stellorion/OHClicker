import { useEffect, useRef } from "react";
// Elapsed time and average rate shown in the header while the clicker runs.
import type { UseACTimerProps } from "../types/timer-types";

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
      const delayMs = settings.startDelayMs ?? 0; // timer starts after the start delay
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
    settings.startDelayMs,
    updateStats,
  ]);
};