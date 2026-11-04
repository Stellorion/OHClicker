export type PageMode = 'minimized' | 'advanced';

export interface Notice {
  title: string;
  message: string;
  details?: string[];
}

export interface UIState {
  clickerMode: PageMode;
  isExpanded: boolean;
  notice: Notice | null;
}

export interface UIActions {
  setClickerMode: (mode: PageMode) => void;
  setIsExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  showNotice: (notice: Notice) => void;
  closeNotice: () => void;
}
