// Position picker state (filled by hooks/usePickState.ts).
import { create } from "zustand";
import type { PickStore } from "../types/store-types";

export const usePickStore = create<PickStore>((set) => ({
  isPicking: false,
  pickingPointId: null,
  setPicking: (isPicking, pointId = null) =>
    set({ isPicking, pickingPointId: pointId }),
}));
