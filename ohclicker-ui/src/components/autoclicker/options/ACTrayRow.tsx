// "Keep in system tray" row. When on, the close button hides the window to the tray
// icon instead of quitting (hotkeys and a running clicker keep working).
// Backend: backend-src/commands/options.rs + backend-src/tray/
import { Switch } from "../../common/Switch";
import { useKeepInTray } from "../../../hooks/useKeepInTray";

export const ACTrayRow: React.FC = () => {
  const { keepInTray, setKeepInTray } = useKeepInTray();

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-app-text-primary">
          Keep in system tray
        </p>
        <p className="text-xs text-app-text-secondary leading-relaxed">
          Closing the window hides it to the tray; hotkeys keep working
        </p>
      </div>
      <Switch checked={keepInTray} onCheckedChange={setKeepInTray} />
    </div>
  );
};
