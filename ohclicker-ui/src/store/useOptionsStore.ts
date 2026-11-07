// Options section state (saved by the backend in settings.json, see hooks/useKeepInTray.ts).
import { create } from "zustand";

interface OptionsStore {
  /** Closing the window hides it to the system tray instead of quitting. */
  keepInTray: boolean;
  setKeepInTray: (enabled: boolean) => void;
}

export const useOptionsStore = create<OptionsStore>((set) => ({
  keepInTray: false,
  setKeepInTray: (keepInTray) => set({ keepInTray }),
}));
