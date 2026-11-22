// Which HotkeyInput is currently waiting for a key press (components/common/HotkeyInput.tsx).
import { create } from "zustand";
import type { HotkeyStore } from "../types/input-store-types";

export const useHotkeyStore = create<HotkeyStore>((set) => ({
  recordingId: null,
  startRecording: (id) => set({ recordingId: id }),
  stopRecording: (id) =>
    set((state) => (state.recordingId === id ? { recordingId: null } : state)),
}));
