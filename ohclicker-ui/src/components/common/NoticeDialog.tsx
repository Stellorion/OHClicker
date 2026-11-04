import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./Button";
import { useUIStore } from "../../store/useUIStore";

/** Global modal for errors/notices. Open it with useUIStore.getState().showNotice(...). */
export const NoticeDialog: React.FC = () => {
  const notice = useUIStore((state) => state.notice);
  const closeNotice = useUIStore((state) => state.closeNotice);

  useEffect(() => {
    if (!notice) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeNotice();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notice, closeNotice]);

  if (!notice) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeNotice();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        aria-describedby="notice-message"
        className="w-full max-w-md rounded-xl border border-app-border bg-app-surface p-5 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-app-red" />
          <div className="min-w-0 space-y-2">
            <h2
              id="notice-title"
              className="text-sm font-bold text-app-text-primary"
            >
              {notice.title}
            </h2>
            <p
              id="notice-message"
              className="text-xs leading-relaxed text-app-text-secondary"
            >
              {notice.message}
            </p>
            {notice.details && notice.details.length > 0 && (
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-app-border bg-app-bg p-2.5 font-mono text-[11px] leading-snug text-app-text-primary">
                {notice.details.map((detail, index) => (
                  <li key={index} className="break-words">
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            autoFocus
            onClick={closeNotice}
            className="rounded-lg bg-app-red px-4 py-1.5 text-xs font-bold text-white hover:opacity-90"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
