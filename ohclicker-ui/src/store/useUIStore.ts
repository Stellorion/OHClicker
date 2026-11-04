// UI-only state: view mode and the error dialog (NoticeDialog).
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type UIState, type UIActions } from "../types/ui-state";

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      clickerMode: "minimized",
      isExpanded: true,
      notice: null,

      setClickerMode: (mode) => set({ clickerMode: mode }),

      setIsExpanded: (expanded) =>
        set((state) => ({
          isExpanded:
            typeof expanded === "function"
              ? expanded(state.isExpanded)
              : expanded,
        })),

      showNotice: (notice) => set({ notice }),
      closeNotice: () => set({ notice: null }),
    }),
    {
      name: "ui-state",
      // Save only the view choices, never `notice` (the error dialog).
      partialize: (s) => ({
        clickerMode: s.clickerMode,
        isExpanded: s.isExpanded,
      }),
    },
  ),
);
