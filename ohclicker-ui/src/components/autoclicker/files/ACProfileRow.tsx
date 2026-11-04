// "Profile: Import / Export" row (one-time, does not remember the file).
import { Download, Loader2, Upload } from "lucide-react";
import { Button } from "../../common/Button";
import { OUTLINE_BUTTON } from "../../../lib/styles";
import type { BusyAction } from "../../../hooks/useProfileFiles";

interface ACProfileRowProps {
  busy: BusyAction;
  onImport: () => void;
  onExport: () => void;
}

export const ACProfileRow: React.FC<ACProfileRowProps> = ({ busy, onImport, onExport }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-app-text-primary">Profile</p>
      <p className="text-xs text-app-text-secondary leading-relaxed">
        Save or load settings configuration
      </p>
    </div>

    <div className="flex gap-2">
      <Button className={OUTLINE_BUTTON} onClick={onImport} disabled={busy !== null}>
        {busy === "import" ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
        Import
      </Button>
      <Button className={OUTLINE_BUTTON} onClick={onExport} disabled={busy !== null}>
        {busy === "export" ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
        Export
      </Button>
    </div>
  </div>
);
