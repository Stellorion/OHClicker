// Options section state (saved by the backend, see hooks/useOptionSwitch.ts).
import { create } from "zustand";
import type { AppOptions } from "../types/options-types";

interface OptionsStore {
  options: AppOptions;
  /** Replaces all options (used once at startup). */
  setOptions: (options: AppOptions) => void;
  /** Changes one option. */
  setOption: (key: keyof AppOptions, value: boolean) => void;
}

export const useOptionsStore = create<OptionsStore>((set) => ({
  options: { keepInTray: false, openOnStartup: false },
  setOptions: (options) => set({ options }),
  setOption: (key, value) =>
    set((state) => ({ options: { ...state.options, [key]: value } })),
}));
