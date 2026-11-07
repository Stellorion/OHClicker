// Linked-profile info (the profile file that loads automatically on start).
import { create } from "zustand";
import type { LinkedProfile } from "../types/profile-types";

interface ProfileStore {
  linked: LinkedProfile;
  /** false until the startup profile was read and applied (see hooks/useStartup.ts). */
  ready: boolean;
  setLinked: (linked: LinkedProfile) => void;
  setReady: () => void;
}

export const UNLINKED: LinkedProfile = {
  path: null,
  status: "unlinked",
  error: null,
  profile: null,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  linked: UNLINKED,
  ready: false,
  setLinked: (linked) => set({ linked }),
  setReady: () => set({ ready: true }),
}));
