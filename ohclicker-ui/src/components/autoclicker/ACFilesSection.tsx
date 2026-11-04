import React, { useState } from "react";
import { Separator } from "../common/Separator";
import { Folder, Download, Upload, Loader2 } from "lucide-react";
import { Button } from "../common/Button";
import { clickerService } from "../../services/clickerService";
import { useACStore } from "../../store/useACStore";
import { useUIStore } from "../../store/useUIStore";
import { profileToSettings, toProfileError } from "../../lib/profile";
import type { ProfileErrorKind } from "../../types/profile-types";

const ERROR_TITLES: Record<ProfileErrorKind, string> = {
  invalid_json: "Invalid JSON file",
  wrong_format: "Profile doesn't match",
  invalid_values: "Invalid profile values",
  hotkey: "Hotkeys couldn't be applied",
  busy: "Autoclicker is running",
  read: "Couldn't read file",
  write: "Couldn't save file",
  unknown: "Something went wrong",
};

type Busy = "import" | "export" | null;

export const ACFilesSection: React.FC = () => {
  const [busy, setBusy] = useState<Busy>(null);
  const [status, setStatus] = useState<string | null>(null);
  const applyProfile = useACStore((state) => state.applyProfile);
  const showNotice = useUIStore((state) => state.showNotice);

  const reportError = (error: unknown) => {
    const { kind, message, details } = toProfileError(error);
    showNotice({ title: ERROR_TITLES[kind], message, details });
  };

  const handleImport = async () => {
    setStatus(null);
    setBusy("import");
    try {
      const profile = await clickerService.importProfile();
      if (!profile) return; // user cancelled the file picker
      // The backend has already validated and applied everything (including
      // re-registering the hotkeys); this just brings the UI in sync.
      applyProfile(profileToSettings(profile));
      setStatus("Profile imported.");
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(null);
    }
  };

  const handleExport = async () => {
    setStatus(null);
    setBusy("export");
    try {
      const saved = await clickerService.exportProfile();
      if (saved) setStatus("Profile exported.");
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(null);
    }
  };

  const buttonClass =
    "flex items-center gap-1.5 px-3 py-1.5 bg-app-bg hover:bg-app-border/40 border border-app-border rounded-lg text-xs font-bold text-app-text-primary transition-all disabled:opacity-50";

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
              Save or load settings configuration, including hotkeys
            </p>
            {status && (
              <p className="text-xs font-medium text-app-text-muted mt-1">
                {status}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className={buttonClass}
              onClick={handleImport}
              disabled={busy !== null}
            >
              {busy === "import" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              Import
            </Button>
            <Button
              className={buttonClass}
              onClick={handleExport}
              disabled={busy !== null}
            >
              {busy === "export" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
