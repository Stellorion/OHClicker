// What the overlay windows draw (pushed by the backend, see components/overlay/).
import { create } from "zustand";
import type { OverlayStore } from "../types/overlay-store-types";

export const useOverlayStore = create<OverlayStore>((set) => ({
  position: undefined,
  boundary: undefined,
  setPosition: (position) => set({ position }),
  // Returning the same state object tells zustand "nothing changed": no re-render.
  setBoundary: (next) =>
    set((state) =>
      state.boundary && JSON.stringify(state.boundary) === JSON.stringify(next)
        ? state
        : { boundary: next },
    ),
}));
