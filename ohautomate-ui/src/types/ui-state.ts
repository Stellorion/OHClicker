export type NavigationTab = 'clicker' | 'macro' | 'settings';

export type PageMode = 'minimized' | 'advanced';

export interface UIState {
  activeTab: NavigationTab;
  clickerMode: PageMode;
  macroMode: PageMode;
  settingsMode: PageMode;
  isExpanded: boolean;
}

export interface UIActions {
  setActiveTab: (tab: NavigationTab) => void;
  setPageMode: (page: NavigationTab, mode: PageMode) => void;
  togglePageMode: (page: NavigationTab) => void;
  setIsExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void; // Added action
  toggleSidebar: () => void;
}

export interface SidebarNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isExpanded: boolean;
}