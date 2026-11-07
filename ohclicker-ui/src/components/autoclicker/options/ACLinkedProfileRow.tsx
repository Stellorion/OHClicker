// "Linked profile" row: a profile file that is loaded automatically every time the
// app starts. Clicking the path opens its folder. Backend: commands/profile/link.rs
import { Link2, Unlink } from "lucide-react";
import { ACBusyButton } from "./ACBusyButton";
import { ACLinkedPathButton } from "./ACLinkedPathButton";
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

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-app-text-primary">
            Linked profile
          </p>
          <p className="text-xs text-app-text-secondary leading-relaxed">
            {linked.path ? (
              badge && (
                <span className={`font-bold ${badge.color}`}>{badge.text}</span>
              )
            ) : (
              "Load a profile file automatically on every start"
            )}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <ACBusyButton
            icon={<Link2 className="size-3.5" />}
            busy={busy === "link"}
            disabled={busy !== null}
            onClick={onLink}
          >
            {linked.path ? "Change" : "Link"}
          </ACBusyButton>
          {linked.path && (
            <ACBusyButton
              icon={<Unlink className="size-3.5" />}
              busy={busy === "unlink"}
              disabled={busy !== null}
              onClick={onUnlink}
            >
              Unlink
            </ACBusyButton>
          )}
        </div>
      </div>

      {linked.path && (
        <ACLinkedPathButton path={linked.path} onReveal={onReveal} />
      )}
    </div>
  );
};
