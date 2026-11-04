// "Files" card: import / export a profile and link one that loads on every start.
// Logic: hooks/useProfileFiles.ts. Backend: backend-src/commands/profile/.
import { Separator } from "../../common/Separator";
import { Folder } from "lucide-react";
import { useProfileFiles } from "../../../hooks/useProfileFiles";
import { ACProfileRow } from "./ACProfileRow";
import { ACLinkedProfileRow } from "./ACLinkedProfileRow";
import { CARD, SEPARATOR } from "../../../lib/styles";

export const ACFilesSection: React.FC = () => {
  const files = useProfileFiles();

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2">
        <Folder className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Files
        </h3>
      </div>

      <Separator className={SEPARATOR} />

      <div className="space-y-4">
        <ACProfileRow busy={files.busy} onImport={files.importProfile} onExport={files.exportProfile} />

        <Separator className={SEPARATOR} />

        <ACLinkedProfileRow
          linked={files.linked}
          busy={files.busy}
          onLink={files.linkProfile}
          onUnlink={files.unlinkProfile}
          onReveal={files.revealLinked}
        />

        {files.status && (
          <p className="text-xs font-medium text-app-text-muted">{files.status}</p>
        )}
      </div>
    </div>
  );
};
