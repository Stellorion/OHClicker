// Helpers for errors coming back from the profile commands (backend: clicker/profile/error.rs).
import { useUIStore } from "../store/useUIStore";
import type { ProfileError, ProfileErrorKind } from "../types/profile-types";

/** Dialog title for each kind of profile error. */
const ERROR_TITLES: Record<ProfileErrorKind, string> = {
  invalid_json: "Invalid JSON file",
  wrong_format: "Profile doesn't match",
  invalid_values: "Invalid profile values",
  hotkey: "Hotkeys couldn't be applied",
  busy: "Autoclicker is running",
  read: "Couldn't read file",
  write: "Couldn't save file",
  unknown: "Something went wrong",
};

/** Normalizes whatever `invoke` rejected with into a ProfileError. */
export const toProfileError = (error: unknown): ProfileError => {
  if (typeof error === "string") {
    return { kind: "unknown", message: error, details: [] };
  }
  if (error && typeof error === "object") {
    const e = error as Partial<ProfileError> & { message?: unknown };
    return {
      kind: e.kind ?? "unknown",
      message: typeof e.message === "string" ? e.message : "Something went wrong.",
      details: Array.isArray(e.details) ? e.details.map(String) : [],
    };
  }
  return { kind: "unknown", message: "Something went wrong.", details: [] };
};

/** One-line text version (message + details), for small notices. */
export const errorMessage = (error: unknown): string => {
  const { message, details } = toProfileError(error);
  return details.length ? `${message} ${details.join(" ")}` : message;
};

/** Opens the error dialog (NoticeDialog) for a failed profile command. */
export const reportProfileError = (error: unknown): void => {
  const { kind, message, details } = toProfileError(error);
  useUIStore.getState().showNotice({ title: ERROR_TITLES[kind], message, details });
};
