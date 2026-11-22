// Shapes of the stores behind the shared input components (components/common/).

/** Text typed into each SettingRow number box, by input id (store/useFieldTextStore.ts). */
export interface FieldTextStore {
  texts: Record<string, string>;
  setText: (id: string, text: string) => void;
  /** Forgets the text of an input that left the screen. */
  clearText: (id: string) => void;
}

/** Which HotkeyInput waits for a key press; only one can at a time (store/useHotkeyStore.ts). */
export interface HotkeyStore {
  recordingId: string | null;
  startRecording: (id: string) => void;
  /** Stops recording, but only if `id` is the one recording. */
  stopRecording: (id: string) => void;
}
