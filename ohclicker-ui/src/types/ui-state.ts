export type PageMode = 'minimized' | 'advanced';

export interface UIState {
  clickerMode: PageMode;
  isExpanded: boolean;
}

export interface UIActions {
  setClickerMode: (mode: PageMode) => void;
  setIsExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
}