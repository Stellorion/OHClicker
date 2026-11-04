// Minimized view, card 1: speed, mouse button and click type.
import { MousePointerClick } from "lucide-react";
import { SettingRow } from "../../components/common/SettingRow";
import { Separator } from "../../components/common/Separator";
import { ChoiceGroup } from "../../components/common/ChoiceGroup";
import { useClick } from "../../hooks/useClick";
import { CARD, SEPARATOR } from "../../lib/styles";

export const ACMiniClickCard: React.FC = () => {
  const { cps, mouseButton, clickType, mouseButtonOptions, clickTypeOptions, updateSettings } = useClick();

  return (
    <div className={CARD}>
      <div className="flex items-center gap-2">
        <MousePointerClick className="size-4 text-app-text-muted" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Click settings
        </h3>
      </div>

      <Separator className={SEPARATOR} />

      <SettingRow
        label="Speed"
        description="Clicks per second"
        min={1}
        max={100}
        value={cps}
        unit="CPS"
        showSlider={true}
        onChange={(newCps) => updateSettings({ cps: newCps })}
      />

      <Separator className={SEPARATOR} />

      <ChoiceGroup
        label="Mouse Button"
        options={mouseButtonOptions}
        value={mouseButton}
        onChange={(val) => updateSettings({ mouseButton: val })}
      />

      <Separator className={SEPARATOR} />

      <ChoiceGroup
        label="Click type"
        options={clickTypeOptions}
        value={clickType}
        onChange={(typeId) => updateSettings({ clickType: typeId })}
      />
    </div>
  );
};
