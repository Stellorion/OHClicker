// State of the status windows: the "OHC ENABLED" popup and the ACTIVE / IDLE indicator
// (components/overlay/StatusToast.tsx and StatusIndicator.tsx).
import { create } from "zustand";
import type { StatusStore } from "../types/status-types";

export const useStatusStore = create<StatusStore>((set) => ({
  toast: null,
  toastCount: 0,
  indicatorActive: false,
  showToast: (enabled) =>
    set((state) =>
      enabled === null
        ? { toast: null }
        : {
            toast: { enabled, id: state.toastCount + 1 },
            toastCount: state.toastCount + 1,
          },
    ),
  setIndicatorActive: (indicatorActive) => set({ indicatorActive }),
}));
