import type { ACSettings } from "../types/ac-types";
import type { ConfigProfile, ProfileError } from "../types/profile-types";

/**
 * The backend profile uses different names/units than the UI settings
 * (buttonHoldMs vs buttonHoldTimeMs, startDelayMs vs startDelaySec, jitterPx vs
 * positionJitterPx), so it has to be translated before it goes into the store.
 */
export const profileToSettings = (p: ConfigProfile): Partial<ACSettings> => ({
  cps: p.cps,
  exactIntervalMs: 1000 / Math.max(p.cps, 1),
  intervalRandomizationPct: p.intervalRandomizationPct,
  buttonHoldTimeMs: p.buttonHoldMs,
  startDelaySec: p.startDelayMs / 1000,
  mouseButton: p.mouseButton,
  clickType: p.clickType,
  repeatType: p.repeatType,
  fixedCountLimit: p.fixedCountLimit,
  maxDurationEnabled: p.maxDurationEnabled,
  maxDurationSec: p.maxDurationSec,
  boundariesEnabled: p.boundariesEnabled,
  regionMode: p.regionMode,
  boundaryX: p.boundaryX,
  boundaryY: p.boundaryY,
  boundaryWidth: p.boundaryWidth,
  boundaryHeight: p.boundaryHeight,
  stopWhenCursorLeaves: p.stopWhenCursorLeaves,
  positionMode: p.positionMode,
  coordinateType: p.coordinateType,
  targetX: p.targetX,
  targetY: p.targetY,
  positionJitterPx: p.jitterPx,
  sequencePoints: p.sequencePoints,
  startStopHotkey: p.startStopHotkey,
  pickPositionHotkey: p.pickPositionHotkey,
  toggleOverlayHotkey: p.toggleOverlayHotkey,
});

/** Normalizes whatever `invoke` rejected with into a ProfileError. */
export const toProfileError = (error: unknown): ProfileError => {
  if (typeof error === "string") {
    return { kind: "unknown", message: error, details: [] };
  }
  if (error && typeof error === "object") {
    const e = error as Partial<ProfileError> & { message?: unknown };
    return {
      kind: e.kind ?? "unknown",
      message:
        typeof e.message === "string" ? e.message : "Something went wrong.",
      details: Array.isArray(e.details) ? e.details.map(String) : [],
    };
  }
  return { kind: "unknown", message: "Something went wrong.", details: [] };
};

export const errorMessage = (error: unknown): string => {
  const { message, details } = toProfileError(error);
  return details.length ? `${message} ${details.join(" ")}` : message;
};
