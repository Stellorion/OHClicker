// Connected displays (filled by hooks/useDisplays.ts).
import { create } from "zustand";
import type { DisplayStore } from "../types/store-types";

export const useDisplayStore = create<DisplayStore>((set) => ({
  displays: [],
  setDisplays: (displays) => set({ displays }),
}));
