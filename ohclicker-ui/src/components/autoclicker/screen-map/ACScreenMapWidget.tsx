// "Screen map" card: miniature of the selected display with target, sequence and bounds.
import { Target } from "lucide-react";
import { useAC } from "../../../hooks/useAC";
import { useDisplays } from "../../../hooks/useDisplays";
import { useLiveBounds } from "../../../hooks/useLiveBounds";
import { Separator } from "../../common/Separator";
import { SCREEN } from "../../../lib/constants";
import { friendlyName } from "../../../lib/displayUtil";
import { ScreenMapCanvas } from "./ScreenMapCanvas";
import { ScreenMapFooter } from "./ScreenMapFooter";
import { DisplaySelector } from "./DisplaySelector";

export const ACScreenMapWidget: React.FC = () => {
  const { settings, updateSettings } = useAC();

  const selectDisplay = (id: string) => void updateSettings({ selectedDisplayId: id });
  const { displays, selectedDisplay, refresh } = useDisplays(settings.selectedDisplayId, selectDisplay);

  const screenSize = selectedDisplay
    ? { width: selectedDisplay.width, height: selectedDisplay.height }
    : { width: SCREEN.w, height: SCREEN.h };
  const target = { x: settings.targetX, y: settings.targetY };
  const bounds = {
    enabled: settings.boundariesEnabled,
    x: settings.boundaryX,
    y: settings.boundaryY,
    width: settings.boundaryWidth,
    height: settings.boundaryHeight,
  };
  const liveBounds = useLiveBounds(settings.regionMode === "choose_window");

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 pb-3">
        <Target className="size-4 text-app-text-muted shrink-0" />
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Screen map
          </h3>
          <span className="text-xs font-mono text-app-text-muted">
            {screenSize.width} × {screenSize.height}
            {selectedDisplay ? ` · ${friendlyName(selectedDisplay)}` : ""}
          </span>
        </div>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4 mb-3" />

      <ScreenMapCanvas
        screenSize={screenSize}
        positionMode={settings.positionMode}
        target={target}
        points={settings.sequencePoints}
        bounds={bounds}
        onTargetChange={({ x, y }) => void updateSettings({ targetX: x, targetY: y })}
      />

      <ScreenMapFooter
        positionMode={settings.positionMode}
        target={target}
        pointCount={settings.sequencePoints.length}
        bounds={bounds}
        regionMode={settings.regionMode}
        screenSize={screenSize}
        liveBounds={liveBounds}
      />

      <DisplaySelector
        displays={displays}
        selectedDisplay={selectedDisplay}
        onSelect={selectDisplay}
        onRefresh={() => void refresh()}
      />
    </div>
  );
};
