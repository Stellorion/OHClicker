// "Hotkeys" card: start/stop and toggle overlay.
import { Separator } from "../common/Separator";
import { Keyboard } from "lucide-react";
import { HotkeyInput } from "../common/HotkeyInput";
import { useHotkeys } from "../../hooks/useHotkeys";

/** A hotkey the OS refuses is reverted with a dialog (hooks/ac/pushHotkeys.ts). */
export const ACHotkeysSection: React.FC = () => {
  const { startStopKey, toggleOverlayKey, updateSettings } = useHotkeys();

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Keyboard className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Hotkeys
        </h3>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-app-text-primary">
            Start / stop
          </p>
          <HotkeyInput
            value={startStopKey}
            onChange={(key) => updateSettings({ startStopHotkey: key })}
          />
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-app-text-primary">
            Toggle overlay
          </p>
          <HotkeyInput
            value={toggleOverlayKey}
            onChange={(key) => updateSettings({ toggleOverlayHotkey: key })}
          />
        </div>
      </div>
    </div>
  );
};
