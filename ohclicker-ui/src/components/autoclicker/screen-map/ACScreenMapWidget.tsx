import { Target } from "lucide-react";
import { useAC } from "../../../hooks/useAC";
import { Separator } from "../../common/Separator";
import { SCREEN } from "../../../lib/constants";
import { friendlyName } from "../../../lib/displayUtil";
import { useDisplays } from "../../../hooks/useDisplays";
import { ScreenMapCanvas } from "./ScreenMapCanvas";
import { DisplaySelector } from "./DisplaySelector";
import { clickerService } from "../../../services/clickerService";
import { useEffect, useState } from "react";

export const ACScreenMapWidget: React.FC = () => {
  const { settings, updateSettings } = useAC();
  const [liveBounds, setLiveBounds] = useState<{
    width: number;
    height: number;
  } | null>(null);

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
  const isTrackingActiveWindow =
    bounds.enabled && settings.regionMode === "active_window";
  const points = settings.sequencePoints ?? [
    { x: 412, y: 288 },
    { x: 1280, y: 420 },
    { x: 960, y: 780 },
  ];

  useEffect(() => {
    if (!isTrackingActiveWindow) {
      setLiveBounds(null);
      return;
    }

    const fetchBounds = async () => {
      try {
        const res = await clickerService.getActiveWindowBounds();
        if (res) {
          setLiveBounds({ width: res.width, height: res.height });
        }
      } catch {
        // Handle or ignore temporary lookup errors when no active window is focused
      }
    };

    void fetchBounds();
    const intervalId = window.setInterval(fetchBounds, 100);

    return () => window.clearInterval(intervalId);
  }, [isTrackingActiveWindow]);

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
        positionMode={positionMode}
        target={target}
        points={points}
        bounds={bounds}
        onTargetChange={({ x, y }) =>
          void updateSettings({ targetX: x, targetY: y })
        }
      />

      <div className="flex items-center justify-between gap-3 mt-2 mb-3 text-xs font-mono text-app-text-secondary px-0.5">
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
            {bounds.enabled
              ? settings.regionMode === "fullscreen"
                ? `${screenSize.width}×${screenSize.height}`
                : settings.regionMode === "active_window"
                  ? liveBounds
                    ? `${liveBounds.width}×${liveBounds.height}`
                    : `${bounds.width}×${bounds.height}`
                  : `${bounds.width}×${bounds.height}`
              : "Disabled"}
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