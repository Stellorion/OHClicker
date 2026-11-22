// Backend calls for the Options section. Rust side: backend-src/commands/options.rs
import { invoke } from "@tauri-apps/api/core";
import type { AppOptions } from "../types/options-types";

export const optionsService = {
  /** true once the backend finished its start-up work. */
  isBackendReady: () => invoke<boolean>("is_backend_ready"),
  /** Saved options; read once on startup. */
  getAppOptions: () => invoke<AppOptions>("get_app_options"),
  /** Turns the system tray option on/off (saved + tray icon shown/hidden). */
  setKeepInTray: (enabled: boolean) =>
    invoke<void>("set_keep_in_tray", { enabled }),
  /** Adds/removes the app from the OS startup list (starts when the PC starts). */
  setOpenOnStartup: (enabled: boolean) =>
    invoke<void>("set_open_on_startup", { enabled }),
};
