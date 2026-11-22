// Text typed into the SettingRow number boxes, by input id (see components/common/SettingRow.tsx).
// Kept as text (not number) so half-typed values like "1." or "" are allowed.
import { create } from "zustand";
import type { FieldTextStore } from "../types/input-store-types";

export const useFieldTextStore = create<FieldTextStore>((set) => ({
  texts: {},
  setText: (id, text) =>
    set((state) => ({ texts: { ...state.texts, [id]: text } })),
  clearText: (id) =>
    set((state) => {
      const { [id]: _removed, ...rest } = state.texts;
      return { texts: rest };
    }),
}));
