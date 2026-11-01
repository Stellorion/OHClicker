import React from "react";
import { useAC } from "../hooks/useAC";

export const ACEstimateWidget: React.FC = () => {
  const { settings } = useAC();

  const repeatType = settings.repeatType ?? "until_stopped";
  const fixedCountLimit = settings.fixedCountLimit ?? 500;
  const cps = settings.cps ?? 25;
  const totalSeconds = Math.round(fixedCountLimit / cps);

  const randomizationPct = settings.intervalRandomizationPct ?? 0;
  const holdTimeMs = settings.buttonHoldTimeMs ?? 12;
  const mouseButton = settings.mouseButton ?? "left";
  const clickType = settings.clickType ?? "single";

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 space-y-1.5 shadow-sm">
      <h4 className="text-sm font-semibold text-app-text-secondary tracking-wider">
        Estimate
      </h4>

      {repeatType === "until_stopped" ? (
        <p className="text-sm font-bold text-app-text-primary tracking-tight">
          Runs until stopped
        </p>
      ) : (
        <p className="text-sm font-bold text-app-text-primary tracking-tight">
          {fixedCountLimit} clicks in about {totalSeconds}s
        </p>
      )}

      <p className="text-xs text-app-text-muted">
        ±{randomizationPct}% jitter · {holdTimeMs} ms hold · {mouseButton} {clickType}
      </p>
    </div>
  );
};