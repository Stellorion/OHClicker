// Backend calls for profile files. Rust side: backend-src/commands/profile/{export,import,link}.rs
import { invoke } from "@tauri-apps/api/core";
import type { ConfigProfile, LinkedProfile } from "../types/profile-types";

export const profileService = {
  /** true = file written, false = user cancelled. Rejects with a ProfileError. */
  exportProfile: () => invoke<boolean>("export_profile"),
  /** One-time import. null = user cancelled. Rejects with a ProfileError. */
  importProfile: () => invoke<ConfigProfile | null>("import_profile"),
  /** Pick a file that is loaded automatically on every start. null = cancelled. */
  linkProfile: () => invoke<ConfigProfile | null>("link_profile"),
  /** Forget the linked file (the file itself is not deleted). */
  unlinkProfile: () => invoke<void>("unlink_profile"),
  /** Linked file info (path, status, loaded settings); called once at startup. */
  getLinkedProfile: () => invoke<LinkedProfile>("get_linked_profile"),
  /** Open the file manager with the linked file selected. */
  revealLinkedProfile: () => invoke<void>("reveal_linked_profile"),
};
