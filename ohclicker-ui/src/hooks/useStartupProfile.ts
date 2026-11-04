// On app start: load the linked profile info from the backend and fill the UI.
// Returns false until that is done, so App.tsx does not show defaults for a moment.
import { useEffect } from "react";
import { clickerService } from "../services/clickerService";
import { useACStore } from "../store/useACStore";
import { useProfileStore } from "../store/useProfileStore";
import { useUIStore } from "../store/useUIStore";
import { profileToSettings } from "../lib/profileSettings";
import { pushSettings } from "./ac/pushSettings";
import { reportProfileError } from "../lib/profileError";

export const useStartupProfile = (): boolean => {
  const ready = useProfileStore((state) => state.ready);

  useEffect(() => {
    const load = async () => {
      try {
        const linked = await clickerService.getLinkedProfile();
        useProfileStore.getState().setLinked(linked);

        if (linked.profile) {
          // The backend already applied it; just show the same values in the UI.
          useACStore.getState().applyProfile(profileToSettings(linked.profile));
        } else {
          // No profile: make the backend use what the UI shows (display is chosen later).
          const { selectedDisplayId: _display, ...settings } = useACStore.getState().settings;
          await pushSettings(settings);
        }

        if (linked.status === "invalid" && linked.error) reportProfileError(linked.error);
        if (linked.status === "missing") {
          useUIStore.getState().showNotice({
            title: "Linked profile not found",
            message: "The linked profile file was moved or deleted. Default settings are used.",
            details: linked.path ? [linked.path] : [],
          });
        }
      } catch (error) {
        console.error("Unable to load the startup profile:", error);
      } finally {
        useProfileStore.getState().setReady();
      }
    };
    void load();
  }, []);

  return ready;
};
