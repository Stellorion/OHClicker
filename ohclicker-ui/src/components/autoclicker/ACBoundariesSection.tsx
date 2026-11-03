import { useEffect } from "react";
import { Separator } from "../common/Separator";
import { Scan } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { Switch } from "../common/Switch";
import { LabeledInput } from "../common/LabeledInput";
import { useBoundaries } from "../../hooks/useBoundaries";
import { clickerService } from "../../services/clickerService";
import type { ACRegionMode } from "../../types/ac-types";

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

  const isCustomRegion: boolean = regionMode === "custom";

  // The backend starts with its own defaults, so push what the UI shows once on mount.
  useEffect(() => {
    void clickerService.setBoundariesEnabled(boundariesEnabled);
    void clickerService.setRegionMode(regionMode);
    void clickerService.updateBoundaryRect(x, y, width, height);
    void clickerService.setStopWhenCursorLeaves(stopWhenCursorLeaves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleBoundaries = (checked: boolean) => {
    clickerService.setBoundariesEnabled(checked);
    updateSettings({ boundariesEnabled: checked });
  };

  const handleRegionModeChange = (mode: ACRegionMode) => {
    clickerService.setRegionMode(
      mode as "fullscreen" | "active_window" | "custom",
    );
    updateSettings({ regionMode: mode });
  };

  // Update the store AND push the full rectangle to the backend
  const handleBoundaryUpdate = (
    key: "boundaryX" | "boundaryY" | "boundaryWidth" | "boundaryHeight",
    value: number,
  ) => {
    if (!isCustomRegion) return;
    const v = key === "boundaryWidth" || key === "boundaryHeight" ? Math.max(1, value) : value;
    const rect = { boundaryX: x, boundaryY: y, boundaryWidth: width, boundaryHeight: height, [key]: v };
    updateSettings({ [key]: v });
    void clickerService.updateBoundaryRect(
      rect.boundaryX,
      rect.boundaryY,
      rect.boundaryWidth,
      rect.boundaryHeight,
    );
  };

  // Handle stop when cursor leaves toggle
  const handleStopWhenCursorLeaves = (checked: boolean) => {
    clickerService.setStopWhenCursorLeaves(checked);
    updateSettings({ stopWhenCursorLeaves: checked });
  };

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
          onCheckedChange={handleToggleBoundaries}
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
            onChange={handleRegionModeChange}
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
              { label: "X", value: x, key: "boundaryX" as const },
              { label: "Y", value: y, key: "boundaryY" as const },
              { label: "W", value: width, key: "boundaryWidth" as const },
              { label: "H", value: height, key: "boundaryHeight" as const },
            ].map((coord) => (
              <LabeledInput
                key={coord.key}
                label={coord.label}
                value={coord.value}
                disabled={!isCustomRegion}
                widthClass="w-20"
                onChange={(val) => handleBoundaryUpdate(coord.key, val)}
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
            onCheckedChange={handleStopWhenCursorLeaves}
          />
        </div>
      </div>
    </div>
  );
};