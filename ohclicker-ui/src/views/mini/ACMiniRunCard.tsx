// Minimized view, card 2: repeat mode and the start/stop hotkey.
import { Repeat } from "lucide-react";
import { Separator } from "../../components/common/Separator";
import { HotkeyInput } from "../../components/common/HotkeyInput";
import { ACRepeatRow } from "../../components/autoclicker/ACRepeatRow";
import { useHotkeys } from "../../hooks/useHotkeys";
import { CARD, SEPARATOR } from "../../lib/styles";

export const ACMiniRunCard: React.FC = () => {
  const { startStopKey, updateSettings } = useHotkeys();

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2">
        <Repeat className="size-4 text-app-text-muted" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Run
        </h3>
      </div>

      <Separator className={SEPARATOR} />

      <ACRepeatRow />

      <Separator className={SEPARATOR} />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-app-text-primary">Start / stop</p>
        <HotkeyInput
          value={startStopKey}
          onChange={(key) => updateSettings({ startStopHotkey: key })}
        />
      </div>
    </div>
  );
};
