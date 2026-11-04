// Props of hooks/useACTimer.ts.
import type { ACSettings, ACStats } from './ac-types';

export interface UseACTimerProps {
  isRunning: boolean;
  settings: ACSettings;
  totalClicks: number;
  updateStats: (stats: Partial<ACStats>) => void;
}