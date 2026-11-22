// "OHC ENABLED" / "OHC DISABLED" popup near the cursor (the `status-toast` window).
// The backend (backend-src/status/toast.rs) calls `window.__ohcToast(true | false)` to
// show it and `__ohcToast(null)` to clear it; the fade-out is the `ohc-toast`
// animation in index.css (0.7 s), the backend hides the window right after.
import { useEffect, useState } from "react";

declare global {
  interface Window {
    __ohcToast?: (enabled: boolean | null) => void;
  }
}

interface Toast {
  enabled: boolean;
  /** Changes on every call, so React restarts the animation. */
  id: number;
}

export const StatusToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  // Expose the function the backend calls.
  useEffect(() => {
    let counter = 0;
    window.__ohcToast = (enabled) =>
      setToast(enabled === null ? null : { enabled, id: ++counter });
    return () => {
      delete window.__ohcToast;
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed select-none">
      <div
        key={toast.id}
        style={{ animation: "ohc-toast 0.7s ease-out forwards" }}
        className={`flex h-full w-full items-center justify-center rounded-lg text-xs px-2 py-1 font-bold tracking-wider text-white shadow-lg ${
          toast.enabled ? "bg-emerald-500/35" : "bg-red-500/35"
        }`}
      >
        {toast.enabled ? "OHC ENABLED" : "OHC DISABLED"}
      </div>
    </div>
  );
};
