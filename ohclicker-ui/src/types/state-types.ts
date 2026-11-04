// Shape of the main store (store/useACStore.ts).
import type { ACSettings, ACStats } from './ac-types';

export interface ACState {
  applyProfile: (profile: Partial<ACSettings>) => void;
  settings: ACSettings;
  stats: ACStats;

  updateSettings: (partial: Partial<ACSettings>) => void;
  setRunningState: (isRunning: boolean) => void;
  updateStats: (stats: Partial<ACStats>) => void;
  resetStats: () => void;
}