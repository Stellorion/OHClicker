export type ACMouseButton = 'left' | 'middle' | 'right';
export type ACClickType = 'single' | 'hold';
export type ACPositionMode = 'cursor' | 'fixed' | 'sequence';
export type ACCoordinateType = 'absolute' | 'relative';
export type ACRegionMode = 'fullscreen' | 'window' | 'custom' | 'active_window';

export interface ACSequencePoint {
  id: string;
  x: number;
  y: number;
  dwell: number;
}

export interface ACSettings {
  // Timing Configuration
  cps: number;
  exactIntervalMs: number;
  intervalRandomizationPct: number;
  buttonHoldTimeMs: number;
  startDelaySec: number;

  // Click Pattern
  mouseButton: ACMouseButton;
  clickType: ACClickType;

  // Target Location & Window
  positionMode: ACPositionMode;
  coordinateType: ACCoordinateType;
  targetWindow: string;
  targetX: number;
  targetY: number;
  positionJitterPx: number;
  sequencePoints?: ACSequencePoint[];

  // Click Limits & Repeat
  repeatType: 'until_stopped' | 'fixed_count';
  fixedCountLimit: number;
  maxDurationEnabled: boolean;
  maxDurationSec: number;

  // Boundaries
  boundariesEnabled: boolean;
  regionMode: ACRegionMode;
  boundaryX: number;
  boundaryY: number;
  boundaryWidth: number;
  boundaryHeight: number;
  stopWhenCursorLeaves: boolean;

  // Hotkeys
  startStopHotkey: string;
  pickPositionHotkey: string;
  toggleOverlayHotkey: string;
  emergencyStopHotkey: string;
}

export interface ACStats {
  elapsedFormatted: string;
  avgRate: number;
  isRunning: boolean;
  totalClicks: number;
  elapsedMs: number;
  currentCps: number;
}