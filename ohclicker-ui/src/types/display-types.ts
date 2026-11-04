// Display (monitor) types.
// `DisplayInfo` mirrors backend-src/clicker/display.rs.

/** One physical monitor, in physical pixels. */
export interface DisplayInfo {
  id: string;
  name: string;
  width: number;
  height: number;
  originX: number;
  originY: number;
  scaleFactor: number;
  isPrimary: boolean;
}

/** Props of the display dropdown (components/autoclicker/screen-map/DisplaySelector.tsx). */
export interface DisplaySelectorProps {
  displays: DisplayInfo[];
  selectedDisplay?: DisplayInfo;
  onSelect: (id: string) => void;
  onRefresh: () => void;
}
