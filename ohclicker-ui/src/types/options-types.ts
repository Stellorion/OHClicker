// Options section types. Mirrors `AppOptions` in backend-src/app_settings.rs.

/** Options saved in settings.json (they survive restarts). */
export interface AppOptions {
  /** Closing the window hides it to the system tray instead of quitting. */
  keepInTray: boolean;
  /** Start the app when the PC starts (asked from the OS, not from settings.json). */
  openOnStartup: boolean;
}
