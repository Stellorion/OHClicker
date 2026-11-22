// "Options" card: profile import/export, linked profile, system tray and startup options.
// Profile logic: hooks/useProfileFiles.ts. Backend: backend-src/commands/profile/ and options.rs
import { Separator } from "../../common/Separator";
import { Settings2 } from "lucide-react";
import { useProfileFiles } from "../../../hooks/useProfileFiles";
import { ACProfileRow } from "./ACProfileRow";
import { ACLinkedProfileRow } from "./ACLinkedProfileRow";
import { ACTrayRow } from "./ACTrayRow";
import { ACStartupRow } from "./ACStartupRow";
import { CARD, SEPARATOR } from "../../../lib/styles";

export const ACOptionsSection: React.FC = () => {
  const files = useProfileFiles();

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2">
        <Settings2 className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Options
        </h3>
        {files.status && (
          <p className="text-xs font-medium text-app-text-muted">
            {files.status}
          </p>
        )}
      </div>

      <Separator className={SEPARATOR} />

      <div className="space-y-4">
        <ACProfileRow
          busy={files.busy}
          onImport={files.importProfile}
          onExport={files.exportProfile}
        />

        <Separator className={SEPARATOR} />

        <ACLinkedProfileRow
          linked={files.linked}
          busy={files.busy}
          onLink={files.linkProfile}
          onUnlink={files.unlinkProfile}
          onReveal={files.revealLinked}
        />

        <Separator className={SEPARATOR} />

        <ACTrayRow />

        <Separator className={SEPARATOR} />

        <ACStartupRow />
      </div>
    </div>
  );
};
