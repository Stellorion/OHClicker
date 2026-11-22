// Types of the two small status windows (components/overlay/StatusToast.tsx, StatusIndicator.tsx).
// The backend (backend-src/status/) drives them by calling the functions declared at the bottom.

/** One "OHC ENABLED / DISABLED" popup. */
export interface Toast {
  enabled: boolean;
  /** Changes on every popup, so React restarts the fade animation. */
  id: number;
}

/** State of the status windows (store/useStatusStore.ts). Each window has its own copy. */
export interface StatusStore {
  toast: Toast | null;
  /** How many popups were shown (source of `Toast.id`). */
  toastCount: number;
  /** Indicator text: true = "ACTIVE" (clicker running), false = "IDLE". */
  indicatorActive: boolean;
  /** true / false = show the popup, null = clear it. */
  showToast: (enabled: boolean | null) => void;
  setIndicatorActive: (active: boolean) => void;
}

declare global {
  interface Window {
    /** Called by the backend: toast.rs */
    __ohcToast?: (enabled: boolean | null) => void;
    /** Called by the backend: indicator.rs */
    __ohcIndicator?: (active: boolean) => void;
  }
}
