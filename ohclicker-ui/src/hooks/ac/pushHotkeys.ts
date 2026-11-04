// Sends changed hotkeys to the backend. If the OS refuses one (invalid, duplicate or
// used by another app) the old value is restored and the user gets a dialog.
import { clickerService } from "../../services/clickerService";
import { useACStore } from "../../store/useACStore";
import { useUIStore } from "../../store/useUIStore";
import { errorMessage } from "../../lib/profileError";
import type { ACSettings } from "../../types/ac-types";

type HotkeyField = "startStopHotkey" | "pickPositionHotkey" | "toggleOverlayHotkey";

const HOTKEY_SENDERS: Record<HotkeyField, (hotkey: string) => Promise<void>> = {
  startStopHotkey: clickerService.updateStartStopHotkey,
  pickPositionHotkey: clickerService.updatePickPositionHotkey,
  toggleOverlayHotkey: clickerService.updateToggleOverlayHotkey,
};

/** `previous` = the settings before the change (used for the rollback). */
export async function pushHotkeys(changed: Partial<ACSettings>, previous: ACSettings): Promise<void> {
  for (const field of Object.keys(HOTKEY_SENDERS) as HotkeyField[]) {
    const value = changed[field];
    if (value === undefined) continue;
    try {
      await HOTKEY_SENDERS[field](value);
    } catch (error) {
      useACStore.getState().updateSettings({ [field]: previous[field] });
      useUIStore.getState().showNotice({ title: "Hotkey not changed", message: errorMessage(error) });
    }
  }
}
