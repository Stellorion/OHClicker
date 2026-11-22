// "Keep in system tray" row. When on, the close button hides the window to the tray
// icon instead of quitting (hotkeys and a running clicker keep working).
// Backend: backend-src/commands/options.rs + backend-src/tray/
import { clickerService } from "../../../services/clickerService";
import { useOptionSwitch } from "../../../hooks/useOptionSwitch";
import { ACSwitchRow } from "./ACSwitchRow";

export const ACTrayRow: React.FC = () => {
  const { checked, setChecked } = useOptionSwitch(
    "keepInTray",
    clickerService.setKeepInTray,
    "Couldn't change the tray option",
  );

  return (
    <ACSwitchRow
      title="Keep in system tray"
      description="Closing the window hides it to the tray; hotkeys keep working"
      checked={checked}
      onChange={setChecked}
    />
  );
};
