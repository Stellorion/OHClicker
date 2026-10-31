export type NavigationTab = 'clicker' | 'macro' | 'settings';

export type PageMode = 'minimized' | 'advanced';

export interface UIState {
  activeTab: NavigationTab;
  clickerMode: PageMode;
  macroMode: PageMode;
  settingsMode: PageMode;
}

export interface UIActions {
  setActiveTab: (tab: NavigationTab) => void;
  setPageMode: (page: NavigationTab, mode: PageMode) => void;
  togglePageMode: (page: NavigationTab) => void;
}