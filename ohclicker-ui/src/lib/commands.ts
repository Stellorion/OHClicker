import { invoke } from '@tauri-apps/api/core';

export const boundariesCommands = {
  setBoundariesEnabled: async (enabled: boolean): Promise<void> => {
    await invoke('set_boundaries_enabled', { enabled });
  },
  
  setRegionMode: async (mode: 'fullscreen' | 'active_window' | 'custom'): Promise<void> => {
    await invoke('set_region_mode', { mode });
  },
  
  updateBoundaryRect: async (x: number, y: number, width: number, height: number): Promise<void> => {
    await invoke('update_boundary_rect', { x, y, width, height });
  },
  
  setStopWhenCursorLeaves: async (enabled: boolean): Promise<void> => {
    await invoke('set_stop_when_cursor_leaves', { enabled });
  },
};

export const positionCommands = {
  getActiveWindowBounds: async (): Promise<{ width: number; height: number }> => {
    return await invoke('get_active_window_bounds');
  },
};
