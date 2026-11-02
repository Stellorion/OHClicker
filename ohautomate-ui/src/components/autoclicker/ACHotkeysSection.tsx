import React from "react";
import { Separator } from "../common/Separator";
import { Keyboard } from "lucide-react";
import { HotkeyInput } from "../common/HotkeyInput";
import { useHotkeys } from "../../hooks/useHotkeys";

export const ACHotkeysSection: React.FC = () => {
  const { startStopKey, pickPositionKey, toggleOverlayKey, updateSettings } =
    useHotkeys();

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Keyboard className="size-4 text-app-text-muted shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
            Hotkeys
          </h3>
          <p className="text-xs text-app-text-secondary leading-relaxed">
            Global shortcuts
          </p>
        </div>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-app-text-primary">Start / stop</p>
          <HotkeyInput
            value={startStopKey}
            onChange={(key) => updateSettings({ startStopHotkey: key })}
          />
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-app-text-primary">
              Pick position
            </p>
            <label className="text-xs text-app-text-secondary block leading-relaxed">
              Capture the cursor location as the target
            </label>
          </div>
          <HotkeyInput
            value={pickPositionKey}
            onChange={(key) => updateSettings({ pickPositionHotkey: key })}
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