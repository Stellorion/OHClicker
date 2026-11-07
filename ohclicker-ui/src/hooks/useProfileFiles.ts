// Actions of the Options section (profile part): import, export, link, unlink, reveal.
// Backend: commands/profile/*.rs (through services/profileService.ts).
import { useState } from "react";
import { profileService } from "../services/profileService";
import { useACStore } from "../store/useACStore";
import { UNLINKED, useProfileStore } from "../store/useProfileStore";
import { useUIStore } from "../store/useUIStore";
import { profileToSettings } from "../lib/profileSettings";
import { errorMessage, reportProfileError } from "../lib/profileError";

export type BusyAction = "import" | "export" | "link" | "unlink" | null;

export const useProfileFiles = () => {
  const linked = useProfileStore((state) => state.linked);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [status, setStatus] = useState<string | null>(null);

  /** Runs an action with a busy flag; `action` returns the success text (null = cancelled). */
  const run = async (kind: Exclude<BusyAction, null>, action: () => Promise<string | null>) => {
    setStatus(null);
    setBusy(kind);
    try {
      setStatus(await action());
    } catch (error) {
      reportProfileError(error);
    } finally {
      setBusy(null);
    }
  };

  const importProfile = () =>
    run("import", async () => {
      const profile = await profileService.importProfile();
      if (!profile) return null;
      useACStore.getState().applyProfile(profileToSettings(profile));
      return "Profile imported.";
    });

  const exportProfile = () =>
    run("export", async () => ((await profileService.exportProfile()) ? "Profile exported." : null));

  const linkProfile = () =>
    run("link", async () => {
      const profile = await profileService.linkProfile();
      if (!profile) return null;
      useACStore.getState().applyProfile(profileToSettings(profile));
      useProfileStore.getState().setLinked(await profileService.getLinkedProfile());
      return "Profile linked. It loads automatically on start.";
    });

  const unlinkProfile = () =>
    run("unlink", async () => {
      await profileService.unlinkProfile();
      useProfileStore.getState().setLinked(UNLINKED);
      return "Link removed.";
    });

  /** Opens the folder with the linked file selected. */
  const revealLinked = async () => {
    try {
      await profileService.revealLinkedProfile();
    } catch (error) {
      useUIStore.getState().showNotice({ title: "Couldn't open the folder", message: errorMessage(error) });
    }
  };

  return { linked, busy, status, importProfile, exportProfile, linkProfile, unlinkProfile, revealLinked };
};
