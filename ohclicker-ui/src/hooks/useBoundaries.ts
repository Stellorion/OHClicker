import { useAC } from "./useAC";
import type { ChoiceOption } from "../components/common/ChoiceGroup";
import type { ACRegionMode } from "../types/ac-types";

const REGION_MODE_OPTIONS: ChoiceOption<ACRegionMode>[] = [
  { id: "fullscreen", label: "Full screen" },
  { id: "active_window", label: "Active window" },
  { id: "custom", label: "Custom" },
];

export const useBoundaries = () => {
  const { settings, updateSettings } = useAC();

  return {
    boundariesEnabled: settings.boundariesEnabled ?? true,
    regionMode: settings.regionMode ?? "fullscreen",
    x: settings.boundaryX ?? 0,
    y: settings.boundaryY ?? 0,
    width: settings.boundaryWidth ?? 1920,
    height: settings.boundaryHeight ?? 1080,
    stopWhenCursorLeaves: settings.stopWhenCursorLeaves ?? true,
    regionModeOptions: REGION_MODE_OPTIONS,
    updateSettings,
  };
};