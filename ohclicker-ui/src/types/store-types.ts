// Shapes of the zustand stores (the stores themselves are in frontend-src/store/).
// More store shapes: ui-state.ts (view mode, dialog), state-types.ts (settings + stats),
// overlay-store-types.ts, input-store-types.ts and status-types.ts.
import type { AppOptions } from "./options-types";
import type { BusyAction } from "./options-props";
import type { DisplayInfo } from "./display-types";
import type { LinkedProfile } from "./profile-types";

/** Options section switches (store/useOptionsStore.ts). */
export interface OptionsStore {
  options: AppOptions;
  /** Replaces all options (used once at startup). */
  setOptions: (options: AppOptions) => void;
  /** Changes one option. */
  setOption: (key: keyof AppOptions, value: boolean) => void;
}

/** Linked profile + the running Options-section file action (store/useProfileStore.ts). */
export interface ProfileStore {
  linked: LinkedProfile;
  /** false until the startup profile was read and applied (see hooks/useStartup.ts). */
  ready: boolean;
  /** Which import/export/link/unlink is running right now (null = none). */
  busy: BusyAction;
  /** Result text of the last file action ("Profile imported."), null = nothing to show. */
  status: string | null;
  setLinked: (linked: LinkedProfile) => void;
  setReady: () => void;
  setBusy: (busy: BusyAction) => void;
  setStatus: (status: string | null) => void;
}

/** Connected monitors (store/useDisplayStore.ts). */
export interface DisplayStore {
  displays: DisplayInfo[];
  setDisplays: (displays: DisplayInfo[]) => void;
}

/** Position picker: is it armed, and for which sequence point (store/usePickStore.ts). */
export interface PickStore {
  isPicking: boolean;
  /** Sequence point being picked; null = the fixed target. */
  pickingPointId: string | null;
  setPicking: (picking: boolean, pointId?: string | null) => void;
}
