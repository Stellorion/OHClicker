import { useAC } from "./useAC";
import type { ACRegionMode } from "../types/ac-types";
import type { ChoiceOption } from "../components/common/ChoiceGroup";

const REGION_MODE_OPTIONS: readonly ChoiceOption<ACRegionMode>[] = [
  { id: "fullscreen", label: "Full screen" },
  { id: "active_window", label: "Active window" },
  { id: "custom", label: "Custom" },
];

export const useBoundaries = () => {
  const { settings, updateSettings } = useAC();

  return {
    boundariesEnabled: settings.boundariesEnabled ?? true,
    regionMode: (settings.regionMode ?? "fullscreen") as ACRegionMode,
    x: settings.boundaryX ?? 0,
    y: settings.boundaryY ?? 0,
    width: settings.boundaryWidth ?? 1920,
    height: settings.boundaryHeight ?? 1080,
    stopWhenCursorLeaves: settings.stopWhenCursorLeaves ?? true,
    regionModeOptions: REGION_MODE_OPTIONS as ChoiceOption<ACRegionMode>[],
    updateSettings,
  } as const;
};