// UI-only state: view mode, sidebar and the error dialog (NoticeDialog).
import { create } from 'zustand';
import { type UIState, type UIActions } from '../types/ui-state';

export const useUIStore = create<UIState & UIActions>((set) => ({
  clickerMode: 'minimized',
  isExpanded: true,
  notice: null,

  setClickerMode: (mode) => set({ clickerMode: mode }),

  setIsExpanded: (expanded) =>
    set((state) => ({
      isExpanded: typeof expanded === 'function' ? expanded(state.isExpanded) : expanded,
    })),

  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),

  showNotice: (notice) => set({ notice }),
  closeNotice: () => set({ notice: null }),
}));