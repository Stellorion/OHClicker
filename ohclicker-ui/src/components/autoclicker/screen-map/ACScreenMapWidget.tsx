import { Target } from "lucide-react";
import { useAC } from "../../../hooks/useAC";
import { Separator } from "../../common/Separator";
import { SCREEN } from "../../../lib/constants";
import { friendlyName } from "../../../lib/displayUtil";
import { useDisplays } from "../../../hooks/UseDisplays";
import { ScreenMapCanvas } from "./ScreenMapCanvas";
import { DisplaySelector } from "./DisplaySelector";

export const ACScreenMapWidget: React.FC = () => {
  const { settings, updateSettings } = useAC();

  const selectDisplay = (id: string) =>
    void updateSettings({ selectedDisplayId: id });
  const { displays, selectedDisplay, refresh } = useDisplays(
    settings.selectedDisplayId,
    selectDisplay,
  );

  const screenSize = selectedDisplay
    ? { width: selectedDisplay.width, height: selectedDisplay.height }
    : { width: SCREEN.w, height: SCREEN.h };
  const positionMode = settings.positionMode ?? "fixed";
  const target = { x: settings.targetX ?? 960, y: settings.targetY ?? 540 };
  const bounds = {
    enabled: settings.boundariesEnabled ?? false,
    x: settings.boundaryX ?? 320,
    y: settings.boundaryY ?? 180,
    width: settings.boundaryWidth ?? 1280,
    height: settings.boundaryHeight ?? 720,
  };
  const points = settings.sequencePoints ?? [
    { x: 412, y: 288 },
    { x: 1280, y: 420 },
    { x: 960, y: 780 },
  ];

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
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

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <ScreenMapCanvas
        screenSize={screenSize}
        positionMode={positionMode}
        target={target}
        points={points}
        bounds={bounds}
        onTargetChange={({ x, y }) => void updateSettings({ targetX: x, targetY: y })}
      />

      <div className="flex items-center justify-between gap-3 text-xs font-mono text-app-text-secondary px-0.5">
        <span>
          Target{" "}
          <strong className="text-app-text-primary">
            {positionMode === "sequence"
              ? `${points.length} points`
              : positionMode === "cursor"
                ? "Follow cursor"
                : `${target.x}, ${target.y}`}
          </strong>
        </span>
        <span>
          Bounds{" "}
          <strong className="text-app-text-primary">
            {bounds.enabled ? `${bounds.width}×${bounds.height}` : "Disabled"}
          </strong>
        </span>
      </div>

      <DisplaySelector
        displays={displays}
        selectedDisplay={selectedDisplay}
        onSelect={selectDisplay}
        onRefresh={() => void refresh()}
      />
    </div>
  );
};
