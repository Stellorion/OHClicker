// Sends changed UI settings to the Rust backend.
// To sync a NEW setting: add one line to SINGLE_SENDERS (or a group below).
import { clickerService as s } from "../../services/clickerService";
import { useACStore } from "../../store/useACStore";
import type { ACSettings } from "../../types/ac-types";

type Senders = {
  [K in keyof ACSettings]?: (value: ACSettings[K]) => Promise<unknown>;
};

/** One setting -> one backend command. */
const SINGLE_SENDERS: Senders = {
  cps: s.updateCps,
  intervalRandomizationPct: s.updateIntervalRandomizationPct,
  buttonHoldMs: s.updateButtonHoldMs,
  startDelayMs: s.updateStartDelayMs,
  mouseButton: s.updateMouseButton,
  clickType: s.updateClickType,
  repeatType: s.updateRepeatType,
  fixedCountLimit: s.updateFixedCountLimit,
  maxDurationEnabled: s.updateMaxDurationEnabled,
  maxDurationSec: s.updateMaxDurationSec,
  positionMode: s.updatePositionMode,
  coordinateType: s.updateCoordinateType,
  jitterPx: s.updatePositionJitter,
  sequencePoints: s.updateSequencePoints,
  selectedDisplayId: s.selectDisplay,
  boundariesEnabled: s.setBoundariesEnabled,
  regionMode: s.setRegionMode,
  stopWhenCursorLeaves: s.setStopWhenCursorLeaves,
};

const has = (c: Partial<ACSettings>, ...keys: (keyof ACSettings)[]) =>
  keys.some((key) => c[key] !== undefined);

/** Sends every field in `changed` (the store must already contain the new values). */
export async function pushSettings(changed: Partial<ACSettings>): Promise<void> {
  for (const key of Object.keys(changed) as (keyof ACSettings)[]) {
    const send = SINGLE_SENDERS[key] as ((value: unknown) => Promise<unknown>) | undefined;
    if (send && changed[key] !== undefined) await send(changed[key]);
  }

  // Settings the backend takes as a group (x+y, x+y+width+height, id+title).
  const now = useACStore.getState().settings;
  if (has(changed, "targetX", "targetY")) {
    await s.updateTargetPosition(now.targetX, now.targetY);
  }
  if (has(changed, "boundaryX", "boundaryY", "boundaryWidth", "boundaryHeight")) {
    await s.updateBoundaryRect(now.boundaryX, now.boundaryY, now.boundaryWidth, now.boundaryHeight);
  }
  if (has(changed, "boundaryWindowId", "boundaryWindowTitle")) {
    await s.setBoundaryWindow(now.boundaryWindowId, now.boundaryWindowTitle);
  }
}
