// "Click limits" card: repeat count and maximum duration.
import { Separator } from "../common/Separator";
import { Timer } from "lucide-react";
import { Input } from "../common/Input";
import { Switch } from "../common/Switch";
import { useLimits } from "../../hooks/useLimit";
import { ACRepeatRow } from "./ACRepeatRow";
import { CARD, NUMBER_INPUT, SEPARATOR } from "../../lib/styles";

export const ACLimitsSection: React.FC = () => {
  const { maxDurationEnabled, maxDurationSec, updateSettings } = useLimits();

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2">
        <Timer className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Click Limits
        </h3>
      </div>

      <Separator className={SEPARATOR} />

      <div className="space-y-3">
        <ACRepeatRow />

        <Separator className={SEPARATOR} />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">Maximum Duration</p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Stop after a fixed amount of time
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className={`relative flex items-center transition-opacity duration-200 ${maxDurationEnabled ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
              <Input
                type="number"
                value={maxDurationSec}
                disabled={!maxDurationEnabled}
                onChange={(e) => updateSettings({ maxDurationSec: Number(e.target.value) })}
                className={`w-24 pr-7 pl-3 ${NUMBER_INPUT}`}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-app-text-muted pointer-events-none select-none">
                s
              </span>
            </div>

            <Switch
              checked={maxDurationEnabled}
              onCheckedChange={(checked) => updateSettings({ maxDurationEnabled: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
