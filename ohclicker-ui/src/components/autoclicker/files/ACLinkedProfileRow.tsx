// "Linked profile" row: a profile file that is loaded automatically every time the
// app starts. Clicking the file name opens its folder. Backend: commands/profile/link.rs
import { Link2, Loader2, Unlink } from "lucide-react";
import { Button } from "../../common/Button";
import { OUTLINE_BUTTON } from "../../../lib/styles";
import type { BusyAction } from "../../../hooks/useProfileFiles";
import type { LinkStatus, LinkedProfile } from "../../../types/profile-types";

/** Badge text + color for each link status (nothing is shown when unlinked). */
const STATUS_BADGE: Record<LinkStatus, { text: string; color: string } | null> =
  {
    unlinked: null,
    loaded: { text: "Loaded", color: "text-emerald-500" },
    missing: { text: "File not found", color: "text-amber-500" },
    invalid: { text: "Invalid file", color: "text-app-red" },
  };

interface ACLinkedProfileRowProps {
  linked: LinkedProfile;
  busy: BusyAction;
  onLink: () => void;
  onUnlink: () => void;
  onReveal: () => void;
}

export const ACLinkedProfileRow: React.FC<ACLinkedProfileRowProps> = ({
  linked,
  busy,
  onLink,
  onUnlink,
  onReveal,
}) => {
  const badge = STATUS_BADGE[linked.status];
  const isLinked = linked.path !== null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-app-text-primary">
            Linked profile
          </p>
          {linked.path ? (
            <p className="text-xs text-app-text-secondary leading-relaxed">
              {badge && (
                <span className={`shrink-0 font-bold ${badge.color}`}>
                  {badge.text}
                </span>
              )}
            </p>
          ) : (
            <p className="text-xs text-app-text-secondary leading-relaxed">
              Load a profile file automatically on every start
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            className={OUTLINE_BUTTON}
            onClick={onLink}
            disabled={busy !== null}
          >
            {busy === "link" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Link2 className="size-3.5" />
            )}
            {isLinked ? "Change" : "Link"}
          </Button>
          {isLinked && (
            <Button
              className={OUTLINE_BUTTON}
              onClick={onUnlink}
              disabled={busy !== null}
            >
              {busy === "unlink" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Unlink className="size-3.5" />
              )}
              Unlink
            </Button>
          )}
        </div>
      </div>
      {linked.path ? (
        <Button
          onClick={onReveal}
          title={`${linked.path}\n(click to show in folder)`}
          className="mt-2 flex w-full min-w-0 justify-start items-center rounded-lg border border-app-border bg-app-bg px-3.5 py-3 text-left transition-colors hover:border-app-text-muted"
        >
          <span className="truncate font-mono text-sm text-app-text-muted">
            {linked.path}
          </span>
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};
