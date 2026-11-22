// "Open on startup" row: starts the app when the PC starts. With "Keep in system
// tray" on, it then starts hidden in the tray (opening the app again shows it).
// Backend: backend-src/commands/options.rs (autostart plugin) + startup.rs
import { clickerService } from "../../../services/clickerService";
import { useOptionSwitch } from "../../../hooks/useOptionSwitch";
import { ACSwitchRow } from "./ACSwitchRow";

export const ACStartupRow: React.FC = () => {
  const { checked, setChecked } = useOptionSwitch(
    "openOnStartup",
    clickerService.setOpenOnStartup,
    "Couldn't change the startup option",
  );

  return (
    <ACSwitchRow
      title="Open on startup"
      description="Start with the PC; hidden in the tray if that option is on"
      checked={checked}
      onChange={setChecked}
    />
  );
};
