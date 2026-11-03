import { Separator } from "../common/Separator";
import { Folder, Upload, Download } from "lucide-react";
import { Button } from "../common/Button";

export const ACFilesSection: React.FC = () => {

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Folder className="size-4 text-app-text-muted shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Files
          </h3>
        </div>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">Profile</p>
            <p className="text-xs text-app-text-secondary leading-relaxed">
              Save or load configuration
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border/40 border border-app-border rounded-lg text-xs font-bold text-app-text-primary transition-all disabled:opacity-50"
            >
              <Upload className="size-4" />
              Import
            </Button>
            <Button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border/40 border border-app-border rounded-lg text-xs font-bold text-app-text-primary transition-all disabled:opacity-50"
            >
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
