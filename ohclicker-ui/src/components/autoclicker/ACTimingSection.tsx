// "Timing" card: speed, randomization, hold time and start delay.
import { useAC } from "../../hooks/useAC";
import { SettingRow } from "../common/SettingRow";
import { Separator } from "../common/Separator";
import { Gauge } from "lucide-react";

/** Start delay is shown in seconds but stored in milliseconds (`startDelayMs`). */
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
            value={settings.buttonHoldMs}
            unit="ms"
            showSlider={false}
            onChange={(buttonHoldMs) =>
              updateSettings({ buttonHoldMs })
            }
          />

          <Separator className="w-[calc(100%+2rem)] -mx-4" />

          <SettingRow
            label="Start delay"
            description="Countdown before the first click"
            min={0}
            max={60}
            step={0.5}
            value={settings.startDelayMs / 1000}
            unit="s"
            showSlider={false}
            onChange={(sec) => updateSettings({ startDelayMs: Math.round(sec * 1000) })}
          />
        </div>
    </div>
  );
};