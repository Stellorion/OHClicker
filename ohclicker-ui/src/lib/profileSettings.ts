// Converts a profile (file format) into UI settings.
import type { ACSettings } from "../types/ac-types";
import type { ConfigProfile } from "../types/profile-types";

/**
 * ConfigProfile and ACSettings use the same field names, so this is a spread plus
 * the one derived value (`exactIntervalMs`).
 */
export const profileToSettings = (profile: ConfigProfile): Partial<ACSettings> => ({
  ...profile,
  exactIntervalMs: 1000 / Math.max(profile.cps, 1),
});
