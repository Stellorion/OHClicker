import type { ACDisplay } from "../types/ac-types";

export const friendlyName = (display: ACDisplay): string => {
  const match = /DISPLAY(\d+)/i.exec(display.name);
  return match ? `Display ${match[1]}` : display.name;
};

export const scaleLabel = (display: ACDisplay): string =>
  `${Math.round(display.scaleFactor * 100)}%`;

export const relativePosition = (display: ACDisplay): string => {
  if (display.isPrimary) return "Primary";
  const directions = [
    display.originX < 0 ? "Left" : display.originX > 0 ? "Right" : undefined,
    display.originY < 0 ? "Above" : display.originY > 0 ? "Below" : undefined,
  ].filter(Boolean);
  return directions.length
    ? `${directions.join(" / ")} of primary`
    : "Aligned with primary";
};

/** How many displays share each friendly name (to disambiguate duplicates). */
export const countNames = (displays: ACDisplay[]): Record<string, number> =>
  displays.reduce<Record<string, number>>((counts, display) => {
    const name = friendlyName(display);
    counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});