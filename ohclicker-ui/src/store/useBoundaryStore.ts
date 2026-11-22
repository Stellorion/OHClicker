// Data of Boundaries -> "Choose window": open windows and the chosen window's live size
// (filled by hooks/useWindowList.ts and hooks/useLiveBounds.ts).
import { create } from "zustand";
import type { BoundaryStore } from "../types/overlay-store-types";

export const useBoundaryStore = create<BoundaryStore>((set) => ({
  windows: [],
  liveSize: null,
  setWindows: (windows) => set({ windows }),
  setLiveSize: (liveSize) => set({ liveSize }),
}));
