import { create } from "zustand";
import type { ACSettings, ACStats } from "../types/ac-types";
import type { ACState } from "../types/state-types";

// Settings shown before a profile is loaded (the backend gets them via pushSettings).
const initialSettings: ACSettings = {
  cps: 12,
  exactIntervalMs: 83.3,
  intervalRandomizationPct: 8,
  buttonHoldMs: 12,
  startDelayMs: 3000,

  mouseButton: "left",
  clickType: "single",

  positionMode: "cursor",
  selectedDisplayId: "primary",
  coordinateType: "absolute",
  targetWindow: "Active Window",
  targetX: 960,
  targetY: 540,
  jitterPx: 2,
  sequencePoints: [
    { id: "1", x: 412, y: 288, dwell: 40 },
    { id: "2", x: 1280, y: 420, dwell: 40 },
    { id: "3", x: 960, y: 780, dwell: 120 },
  ],

  repeatType: "until_stopped",
  fixedCountLimit: 500,
  maxDurationEnabled: false,
  maxDurationSec: 300,

  boundariesEnabled: false,
  regionMode: "custom",
  boundaryX: 320,
  boundaryY: 180,
  boundaryWidth: 1280,
  boundaryHeight: 800,
  stopWhenCursorLeaves: false,

  startStopHotkey: "F6",
  pickPositionHotkey: "F7",
  toggleOverlayHotkey: "F8",
  scaleFactor: 0,
};

const initialStats: ACStats = {
  isRunning: false,
  totalClicks: 0,
  elapsedMs: 0,
  currentCps: 0,
  elapsedFormatted: "00:00",
  avgRate: 0,
};

// Main UI store: settings (sent to the backend by hooks/ac/pushSettings.ts) and live stats.
export const useACStore = create<ACState>((set) => ({
  settings: initialSettings,
  stats: initialStats,

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),

  applyProfile: (profile: Partial<ACSettings>) =>
    set((state) => ({
      settings: { ...state.settings, ...profile },
    })),

  setRunningState: (isRunning) =>
    set((state) => ({
      stats: { ...state.stats, isRunning },
    })),

  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),

  resetStats: () => set({ stats: initialStats }),
}));
