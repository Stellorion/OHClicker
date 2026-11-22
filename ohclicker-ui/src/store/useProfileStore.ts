// Linked-profile info (the profile file that loads automatically on start) and the
// state of the Options-section file actions (hooks/useProfileFiles.ts).
import { create } from "zustand";
import type { LinkedProfile } from "../types/profile-types";
import type { ProfileStore } from "../types/store-types";

export const UNLINKED: LinkedProfile = {
  path: null,
  status: "unlinked",
  error: null,
  profile: null,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  linked: UNLINKED,
  ready: false,
  busy: null,
  status: null,
  setLinked: (linked) => set({ linked }),
  setReady: () => set({ ready: true }),
  setBusy: (busy) => set({ busy }),
  setStatus: (status) => set({ status }),
}));
