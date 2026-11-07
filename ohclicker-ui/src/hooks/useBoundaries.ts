// Logic for the "Boundaries" section. Changes are sent to the backend by
// hooks/ac/pushSettings.ts (boundary fields), the overlay redraws from the backend.
import { useAC } from "./useAC";
import type { RegionMode } from "../types/ac-types";
import type { WindowInfo } from "../types/window-types";
import type { ChoiceOption } from "../components/common/ChoiceGroup";

const REGION_MODE_OPTIONS: ChoiceOption<RegionMode>[] = [
  { id: "fullscreen", label: "Full screen" },
  { id: "choose_window", label: "Choose window" },
  { id: "custom", label: "Custom" },
];

export type BoundaryField = "boundaryX" | "boundaryY" | "boundaryWidth" | "boundaryHeight";

export const useBoundaries = () => {
  const { settings, updateSettings } = useAC();

  /** Changes one side of the custom rectangle (width/height are at least 1). */
  const setRectField = (field: BoundaryField, value: number) => {
    const isSize = field === "boundaryWidth" || field === "boundaryHeight";
    void updateSettings({ [field]: isSize ? Math.max(1, value) : value });
  };

  /** Chooses the window the region follows (Region = Choose window). */
  const chooseWindow = (window: WindowInfo) => {
    void updateSettings({
      boundaryWindowId: window.id,
      boundaryWindowTitle: window.title,
    });
  };

  return {
    boundariesEnabled: settings.boundariesEnabled,
    regionMode: settings.regionMode,
    windowTitle: settings.boundaryWindowTitle,
    windowOpen: settings.boundaryWindowOpen,
    x: settings.boundaryX,
    y: settings.boundaryY,
    width: settings.boundaryWidth,
    height: settings.boundaryHeight,
    stopWhenCursorLeaves: settings.stopWhenCursorLeaves,
    regionModeOptions: REGION_MODE_OPTIONS,
    updateSettings,
    setRectField,
    chooseWindow,
  };
};
