import { create } from 'zustand';
import { type UIState, type UIActions } from '../types/ui-state';

export const useUIStore = create<UIState & UIActions>((set) => ({
  activeTab: 'clicker',
  clickerMode: 'minimized',
  macroMode: 'minimized',
  settingsMode: 'minimized',

  setActiveTab: (tab) => set({ activeTab: tab }),

  setPageMode: (page, mode) =>
    set((state) => {
      if (page === 'clicker') return { clickerMode: mode };
      if (page === 'macro') return { macroMode: mode };
      if (page === 'settings') return { settingsMode: mode };
      return state;
    }),

  togglePageMode: (page) =>
    set((state) => {
      if (page === 'clicker') {
        return { clickerMode: state.clickerMode === 'minimized' ? 'advanced' : 'minimized' };
      }
      if (page === 'macro') {
        return { macroMode: state.macroMode === 'minimized' ? 'advanced' : 'minimized' };
      }
      if (page === 'settings') {
        return { settingsMode: state.settingsMode === 'minimized' ? 'advanced' : 'minimized' };
      }
      return state;
    }),
}));