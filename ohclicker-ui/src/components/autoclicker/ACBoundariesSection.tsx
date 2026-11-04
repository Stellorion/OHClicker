// "Boundaries" card: only click while the cursor is inside a region.
// Backend: clicker/engine/session/cycle/boundaries.rs (check) + clicker/overlay/boundary_state.rs (drawing).
import { Separator } from "../common/Separator";
import { Scan } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { Switch } from "../common/Switch";
import { useBoundaries } from "../../hooks/useBoundaries";
import { ACBoundaryRect } from "./ACBoundaryRect";
import { CARD, SEPARATOR } from "../../lib/styles";

export const ACBoundariesSection: React.FC = () => {
  const b = useBoundaries();

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <Scan className="size-4 text-app-text-muted shrink-0 mt-0.5" />
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Boundaries
          </h3>
        </div>
        <Switch
          checked={b.boundariesEnabled}
          onCheckedChange={(checked) => b.updateSettings({ boundariesEnabled: checked })}
        />
      </div>

      <Separator className={SEPARATOR} />

      {/* Everything below is dimmed while Boundaries are off */}
      <div className={`space-y-4 transition-opacity duration-200 ${b.boundariesEnabled ? "opacity-100" : "opacity-30 pointer-events-none select-none"}`}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-app-text-primary">Region</p>
          <ChoiceGroup
            options={b.regionModeOptions}
            value={b.regionMode}
            onChange={(mode) => b.updateSettings({ regionMode: mode })}
          />
        </div>

        <Separator className={SEPARATOR} />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">Rectangle</p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Origin and size in pixels
            </label>
          </div>
          <ACBoundaryRect
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            disabled={b.regionMode !== "custom"}
            onChange={b.setRectField}
          />
        </div>

        <Separator className={SEPARATOR} />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">Stop when cursor leaves</p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Safety stop if you move outside the region
            </label>
          </div>
          <Switch
            checked={b.stopWhenCursorLeaves}
            onCheckedChange={(checked) => b.updateSettings({ stopWhenCursorLeaves: checked })}
          />
        </div>
      </div>
    </div>
  );
};
