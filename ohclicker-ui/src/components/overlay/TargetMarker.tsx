// One red dot on the position overlay (with jitter circle and optional sequence number).
// Position and size are percentages of the display, so DPI scaling does not matter.
import type { TargetMarkerProps } from "../../types/overlay-types";


export const TargetMarker = ({ x, y, order, jitter, screenWidth, screenHeight }: TargetMarkerProps) => {
  const w = Math.max(screenWidth, 1);
  const h = Math.max(screenHeight, 1);
  const circleSize = `max(2px, ${((jitter * 2) / w) * 100}vw)`;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(x / w) * 100}%`, top: `${(y / h) * 100}%` }}
    >
      {jitter > 0 && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500"
          style={{ width: circleSize, height: circleSize }}
        />
      )}
      <div className="size-2 rounded-full bg-red-500 ring-2 ring-white/80" />
      {order !== undefined && (
        <span className="absolute left-3 top-0 rounded bg-red-600 px-1 text-[10px] font-bold text-white">
          {order}
        </span>
      )}
    </div>
  );
};
