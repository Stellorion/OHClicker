// Window list types. Mirrors backend-src/clicker/os_windows/mod.rs (`WindowInfo`).

/** One open window of another program that Boundaries can follow. */
export interface WindowInfo {
  /** Window handle; only valid while that window stays open. */
  id: number;
  title: string;
}
