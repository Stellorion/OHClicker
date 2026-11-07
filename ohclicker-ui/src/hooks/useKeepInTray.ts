// "Keep in system tray" switch. Backend: commands/options.rs + tray/.
import { clickerService } from "../services/clickerService";
import { useOptionsStore } from "../store/useOptionsStore";
import { useUIStore } from "../store/useUIStore";
import { errorMessage } from "../lib/profileError";

export const useKeepInTray = () => {
  const keepInTray = useOptionsStore((state) => state.keepInTray);

  /** Switches at once; if the backend refuses, switches back and tells the user. */
  const setKeepInTray = async (enabled: boolean) => {
    const { setKeepInTray: setStored } = useOptionsStore.getState();
    setStored(enabled);
    try {
      await clickerService.setKeepInTray(enabled);
    } catch (error) {
      setStored(!enabled);
      useUIStore.getState().showNotice({
        title: "Couldn't change the tray option",
        message: errorMessage(error),
      });
    }
  };

  return { keepInTray, setKeepInTray };
};
