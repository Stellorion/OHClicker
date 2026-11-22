// Options section state (saved by the backend, see hooks/useOptionSwitch.ts).
import { create } from "zustand";
import type { OptionsStore } from "../types/store-types";

export const useOptionsStore = create<OptionsStore>((set) => ({
  options: { keepInTray: false, openOnStartup: false },
  setOptions: (options) => set({ options }),
  setOption: (key, value) =>
    set((state) => ({ options: { ...state.options, [key]: value } })),
}));
