import { invoke } from "@tauri-apps/api/core";

export const clickerService = {
  toggleClicker: () => invoke<boolean>("toggle_clicker"),
  updateCps: (cps: number) => invoke("update_cps", { cps }),
  updateIntervalRandomizationPct: (pct: number) =>
    invoke("update_interval_randomization_pct", { pct }),
  updateButtonHoldMs: (holdMs: number) =>
    invoke("update_button_hold_ms", { holdMs }),
  updateStartDelayMs: (delayMs: number) =>
    invoke("update_start_delay_ms", { delayMs }),
};
