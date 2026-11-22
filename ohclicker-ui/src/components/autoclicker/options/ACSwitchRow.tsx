// One option row: title + description on the left, on/off switch on the right.
import type { ACSwitchRowProps } from "../../../types/options-props";
import { Switch } from "../../common/Switch";

export const ACSwitchRow: React.FC<ACSwitchRowProps> = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-app-text-primary">{title}</p>
      <p className="text-xs text-app-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);
