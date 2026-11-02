import { Separator } from "../common/Separator";
import { Scan } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { Switch } from "../common/Switch";
import { LabeledInput } from "../common/LabeledInput";
import { useBoundaries } from "../../hooks/useBoundaries";

export const ACBoundariesSection: React.FC = () => {
  const {
    boundariesEnabled,
    regionMode,
    x,
    y,
    width,
    height,
    stopWhenCursorLeaves,
    regionModeOptions,
    updateSettings,
  } = useBoundaries();

  const isCustomRegion = regionMode === "custom";

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <Scan className="size-4 text-app-text-muted shrink-0 mt-0.5" />
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Boundaries
          </h3>
        </div>

        <Switch
          checked={boundariesEnabled}
          onCheckedChange={(checked) =>
            updateSettings({ boundariesEnabled: checked })
          }
        />
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div
        className={`space-y-4 transition-opacity duration-200 ${
          boundariesEnabled
            ? "opacity-100"
            : "opacity-30 pointer-events-none select-none"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-app-text-primary">Region</p>
          <ChoiceGroup
            options={regionModeOptions}
            value={regionMode}
            onChange={(val) => updateSettings({ regionMode: val })}
          />
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">Rectangle</p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Origin and size in pixels
            </label>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: "X", value: x, key: "boundaryX" },
              { label: "Y", value: y, key: "boundaryY" },
              { label: "W", value: width, key: "boundaryWidth" },
              { label: "H", value: height, key: "boundaryHeight" },
            ].map((coord) => (
              <LabeledInput
                key={coord.key}
                label={coord.label}
                value={coord.value}
                disabled={!isCustomRegion}
                widthClass="w-20"
                onChange={(val) => updateSettings({ [coord.key]: val })}
              />
            ))}
          </div>
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">
              Stop when cursor leaves
            </p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Safety stop if you move outside the region
            </label>
          </div>

          <Switch
            checked={stopWhenCursorLeaves}
            onCheckedChange={(checked) =>
              updateSettings({ stopWhenCursorLeaves: checked })
            }
          />
        </div>
      </div>
    </div>
  );
};