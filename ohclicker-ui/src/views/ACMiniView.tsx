import React from "react";
import { ACHeader } from "../components/autoclicker/ACHeader";
import { MousePointerClick, Repeat } from "lucide-react";
import { SettingRow } from "../components/common/SettingRow";
import { Separator } from "../components/common/Separator";
import { ChoiceGroup } from "../components/common/ChoiceGroup";
import { useClick } from "../hooks/useClick";
import { useLimits } from "../hooks/useLimit";
import { HotkeyInput } from "../components/common/HotkeyInput";
import { useHotkeys } from "../hooks/useHotkeys";
import { Input } from "../components/common/Input";

export const ACMinimizedView: React.FC = () => {
  const {
    cps,
    mouseButton,
    clickType,
    mouseButtonOptions,
    clickTypeOptions,
    updateSettings,
  } = useClick();

  const { repeatType, fixedCountLimit, repeatTypeOptions } = useLimits();
  const { startStopKey } = useHotkeys();

  const isFixedRepeat = repeatType === "fixed_count";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ACHeader />

      <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <MousePointerClick className="size-4 text-app-text-muted" />
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Click settings
          </h3>
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <SettingRow
          label="Speed"
          description="Clicks per second"
          min={1}
          max={100}
          value={cps}
          unit="CPS"
          showSlider={true}
          onChange={(newCps) => updateSettings({ cps: newCps })}
        />

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <ChoiceGroup
          label="Mouse Button"
          options={mouseButtonOptions}
          value={mouseButton}
          onChange={(val) => updateSettings({ mouseButton: val })}
        />

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <ChoiceGroup
          label="Click type"
          options={clickTypeOptions}
          value={clickType}
          onChange={(typeId) => updateSettings({ clickType: typeId })}
        />
      </div>

      <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Repeat className="size-4 text-app-text-muted" />
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Run
          </h3>
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

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
          <p className="text-sm font-bold text-app-text-primary">
            Start / stop
          </p>
          <HotkeyInput
            value={startStopKey}
            onChange={(key) => updateSettings({ startStopHotkey: key })}
          />
        </div>
      </div>
    </div>
  );
};
