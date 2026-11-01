import React from "react";
import { useAC } from "../hooks/useAC";
import { SettingRow } from "../../../components/common/SettingRow";
import { Separator } from "../../../components/common/Separator";
import { Gauge } from "lucide-react";

export const ACTimingSection: React.FC = () => {
  const { settings, updateSettings } = useAC();

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3">
      <div className="flex items-center gap-1.5">
        <Gauge className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Timing
        </h3>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <SettingRow
        label="Speed"
        description="Clicks per second"
        min={1}
        max={100}
        value={settings.cps}
        unit="cps"
        showSlider={true}
        onChange={(cps) => updateSettings({ cps })}
      />

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <div className="space-y-3 text-xs">
          <SettingRow
            label="Randomization Jitter"
            description="Interval variance spread"
            min={0}
            max={50}
            value={settings.intervalRandomizationPct}
            unit="%"
            showSlider={true}
            onChange={(intervalRandomizationPct) =>
              updateSettings({ intervalRandomizationPct })
            }
          />

          <Separator className="w-[calc(100%+2rem)] -mx-4" />

          <SettingRow
            label="Button hold time"
            description="How long each press is held down"
            min={0}
            max={1000}
            step={1}
            value={settings.buttonHoldTimeMs}
            unit="ms"
            showSlider={false}
            onChange={(buttonHoldTimeMs) =>
              updateSettings({ buttonHoldTimeMs })
            }
          />

          <Separator className="w-[calc(100%+2rem)] -mx-4" />

          <SettingRow
            label="Start delay"
            description="Countdown before the first click"
            min={0}
            max={60}
            step={0.5}
            value={settings.startDelaySec ?? 0}
            unit="s"
            showSlider={false}
            onChange={(startDelaySec) => updateSettings({ startDelaySec })}
          />
        </div>
    </div>
  );
};