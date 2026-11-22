// "Profile: Import / Export" row (one-time, does not remember the file).
import type { ACProfileRowProps } from "../../../types/options-props";
import { Download, Upload } from "lucide-react";
import { ACBusyButton } from "./ACBusyButton";

export const ACProfileRow: React.FC<ACProfileRowProps> = ({
  busy,
  onImport,
  onExport,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-app-text-primary">Profile</p>
      <p className="text-xs text-app-text-secondary leading-relaxed">
        Save or load settings configuration
      </p>
    </div>

    <div className="flex gap-2">
      <ACBusyButton
        icon={<Upload className="size-3.5" />}
        busy={busy === "import"}
        disabled={busy !== null}
        onClick={onImport}
      >
        Import
      </ACBusyButton>
      <ACBusyButton
        icon={<Download className="size-3.5" />}
        busy={busy === "export"}
        disabled={busy !== null}
        onClick={onExport}
      >
        Export
      </ACBusyButton>
    </div>
  </div>
);
