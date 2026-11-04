// Current hotkeys for the Hotkeys section.
import { useAC } from "./useAC";

/** Hotkey strings + `updateSettings` (the backend re-registers them). */
export const useHotkeys = () => {
  const { settings, updateSettings } = useAC();

  return {
    startStopKey: settings.startStopHotkey ?? "F6",
    pickPositionKey: settings.pickPositionHotkey ?? "F7",
    toggleOverlayKey: settings.toggleOverlayHotkey ?? "F8",
    updateSettings,
  };
};