// "Linked profile" row: a profile file that is loaded automatically every time the
// app starts. Clicking the file name opens its folder. Backend: commands/profile/link.rs
import { FileJson, Link2, Loader2, Unlink } from "lucide-react";
import { Button } from "../../common/Button";
import { OUTLINE_BUTTON } from "../../../lib/styles";
import type { BusyAction } from "../../../hooks/useProfileFiles";
import type { LinkStatus, LinkedProfile } from "../../../types/profile-types";

/** Badge text + color for each link status (nothing is shown when unlinked). */
const STATUS_BADGE: Record<LinkStatus, { text: string; color: string } | null> = {
  unlinked: null,
  loaded: { text: "Loaded", color: "text-emerald-500" },
  missing: { text: "File not found", color: "text-amber-500" },
  invalid: { text: "Invalid file", color: "text-app-red" },
};

/** "C:\\folder\\profile.json" -> "profile.json" */
const fileName = (path: string) => path.split(/[\/]/).pop() ?? path;

interface ACLinkedProfileRowProps {
  linked: LinkedProfile;
  busy: BusyAction;
  onLink: () => void;
  onUnlink: () => void;
  onReveal: () => void;
}

export const ACLinkedProfileRow: React.FC<ACLinkedProfileRowProps> = ({ linked, busy, onLink, onUnlink, onReveal }) => {
  const badge = STATUS_BADGE[linked.status];
  const isLinked = linked.path !== null;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-app-text-primary">Linked profile</p>
        {linked.path ? (
          <button
            type="button"
            onClick={onReveal}
            title={`${linked.path}\n(click to show in folder)`}
            className="flex max-w-full items-center gap-1.5 text-xs text-app-text-secondary hover:text-app-red hover:underline"
          >
            <FileJson className="size-3.5 shrink-0" />
            <span className="truncate">{fileName(linked.path)}</span>
            {badge && <span className={`shrink-0 font-bold ${badge.color}`}>· {badge.text}</span>}
          </button>
        ) : (
          <p className="text-xs text-app-text-secondary leading-relaxed">
            Load a profile file automatically on every start
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Button className={OUTLINE_BUTTON} onClick={onLink} disabled={busy !== null}>
          {busy === "link" ? <Loader2 className="size-3.5 animate-spin" /> : <Link2 className="size-3.5" />}
          {isLinked ? "Change" : "Link"}
        </Button>
        {isLinked && (
          <Button className={OUTLINE_BUTTON} onClick={onUnlink} disabled={busy !== null}>
            {busy === "unlink" ? <Loader2 className="size-3.5 animate-spin" /> : <Unlink className="size-3.5" />}
            Unlink
          </Button>
        )}
      </div>
    </div>
  );
};
