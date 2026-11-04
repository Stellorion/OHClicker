// Text helpers for the display dropdown (DisplaySelector).
import type { DisplayInfo } from "../types/ac-types";

/** "\\.\\DISPLAY2" -> "Display 2". */
export const friendlyName = (display: DisplayInfo): string => {
  const match = /DISPLAY(\d+)/i.exec(display.name);
  return match ? `Display ${match[1]}` : display.name;
};

/** Windows scaling, e.g. "125%". */
export const scaleLabel = (display: DisplayInfo): string =>
  `${Math.round(display.scaleFactor * 100)}%`;

/** Where the display is compared to the primary one ("Left of primary"). */
export const relativePosition = (display: DisplayInfo): string => {
  if (display.isPrimary) return "Primary";
  const directions = [
    display.originX < 0 ? "Left" : display.originX > 0 ? "Right" : undefined,
    display.originY < 0 ? "Above" : display.originY > 0 ? "Below" : undefined,
  ].filter(Boolean);
  return directions.length
    ? `${directions.join(" / ")} of primary`
    : "Aligned with primary";
};

/** How often each friendly name occurs (to add coordinates to duplicates). */
export const countNames = (displays: DisplayInfo[]): Record<string, number> =>
  displays.reduce<Record<string, number>>((counts, display) => {
    const name = friendlyName(display);
    counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});