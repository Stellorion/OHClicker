import { useAC } from "./useAC";

export const useHotkeys = () => {
  const { settings, updateSettings } = useAC();

  return {
    startStopKey: settings.startStopHotkey ?? "F6",
    pickPositionKey: settings.pickPositionHotkey ?? "F7",
    toggleOverlayKey: settings.toggleOverlayHotkey ?? "F8",
    updateSettings,
  };
};