// An on/off option of the Options section that the backend saves
// (keep in tray, open on startup). Backend: commands/options.rs
import { useOptionsStore } from "../store/useOptionsStore";
import { useUIStore } from "../store/useUIStore";
import { errorMessage } from "../lib/profileError";
import type { AppOptions } from "../types/options-types";

/**
 * `save` sends the new value to the backend, `errorTitle` is the dialog title
 * when that fails (the switch then jumps back).
 */
export const useOptionSwitch = (
  key: keyof AppOptions,
  save: (enabled: boolean) => Promise<unknown>,
  errorTitle: string,
) => {
  const checked = useOptionsStore((state) => state.options[key]);

  /** Switches at once; if the backend refuses, switches back and tells the user. */
  const setChecked = async (enabled: boolean) => {
    const { setOption } = useOptionsStore.getState();
    setOption(key, enabled);
    try {
      await save(enabled);
    } catch (error) {
      setOption(key, !enabled);
      useUIStore.getState().showNotice({
        title: errorTitle,
        message: errorMessage(error),
      });
    }
  };

  return { checked, setChecked };
};
