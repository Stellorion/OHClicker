import React from "react";
import { Separator } from "../common/Separator";
import { Timer } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { Input } from "../common/Input";
import { useLimits } from "../../hooks/useLimit";
import { Switch } from "../common/Switch";

export const ACLimitsSection: React.FC = () => {
  const {
    repeatType,
    fixedCountLimit,
    maxDurationEnabled,
    maxDurationSec,
    repeatTypeOptions,
    updateSettings,
  } = useLimits();

  const isFixedRepeat = repeatType === "fixed_count";

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Timer className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Click Limits
        </h3>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <ChoiceGroup
            label="Repeat"
            options={repeatTypeOptions}
            value={repeatType}
            onChange={(val) => updateSettings({ repeatType: val })}
            className="w-full"
          />

          <div className="flex items-center">
            <div
              className={`relative flex items-center transition-opacity ${
                isFixedRepeat ? "opacity-100" : "opacity-30 pointer-events-none"
              }`}
            >
              <Input
                type="number"
                value={fixedCountLimit}
                disabled={!isFixedRepeat}
                onChange={(e) =>
                  updateSettings({ fixedCountLimit: Number(e.target.value) })
                }
                className="w-24 pl-3 text-sm font-bold border border-app-border bg-app-bg text-app-text-primary focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-lg py-1.5"
              />
            </div>
          </div>
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">
              Maximum Duration
            </p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Stop after a fixed amount of time
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`relative flex items-center transition-opacity duration-200 ${
                maxDurationEnabled
                  ? "opacity-100"
                  : "opacity-30 pointer-events-none"
              }`}
            >
              <Input
                type="number"
                value={maxDurationSec}
                disabled={!maxDurationEnabled}
                onChange={(e) =>
                  updateSettings({ maxDurationSec: Number(e.target.value) })
                }
                className="w-24 pr-7 pl-3 text-sm font-bold border border-app-border bg-app-bg text-app-text-primary focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-lg py-1.5"
              />

              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-app-text-muted pointer-events-none select-none">
                s
              </span>
            </div>

            <Switch
              checked={maxDurationEnabled}
              onCheckedChange={(checked) =>
                updateSettings({ maxDurationEnabled: checked })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
