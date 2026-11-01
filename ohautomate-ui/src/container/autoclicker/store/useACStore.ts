import { create } from 'zustand';
import type { ACSettings, ACStats } from '../types/ac-types';

interface ACState {
  settings: ACSettings;
  stats: ACStats;

  // Actions
  updateSettings: (partial: Partial<ACSettings>) => void;
  setRunningState: (isRunning: boolean) => void;
  updateStats: (stats: Partial<ACStats>) => void;
  resetStats: () => void;
}

const initialSettings: ACSettings = {
  cps: 12,
  exactIntervalMs: 83.3,
  intervalRandomizationPct: 8,
  buttonHoldTimeMs: 12,
  startDelaySec: 3.0,

  mouseButton: 'left',
  clickType: 'single',

  positionMode: 'cursor',
  coordinateType: 'absolute',
  targetWindow: 'Active Window',
  targetX: 960,
  targetY: 540,
  positionJitterPx: 2,

  repeatType: 'until_stopped',
  fixedCountLimit: 500,
  maxDurationEnabled: false,
  maxDurationSec: 300,

  boundariesEnabled: false,
  regionMode: 'custom',
  boundaryX: 320,
  boundaryY: 180,
  boundaryWidth: 1280,
  boundaryHeight: 800,
  stopWhenCursorLeaves: false,

  startStopHotkey: 'F6',
  pickPositionHotkey: 'F7',
  toggleOverlayHotkey: 'F8',
  emergencyStopHotkey: 'Ctrl+Shift+Esc',
};

const initialStats: ACStats = {
  isRunning: false,
  totalClicks: 0,
  elapsedMs: 0,
  currentCps: 0,
  elapsedFormatted: "00:00",
  avgRate: 0,
};

export const useACStore = create<ACState>((set) => ({
  settings: initialSettings,
  stats: initialStats,

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
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