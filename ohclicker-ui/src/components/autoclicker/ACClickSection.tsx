import { Separator } from "../common/Separator";
import { Mouse } from "lucide-react";
import { ChoiceGroup } from "../common/ChoiceGroup";
import { useClick } from "../../hooks/useClick";

export const ACClickSection: React.FC = () => {
  const {
    mouseButton,
    clickType,
    mouseButtonOptions,
    clickTypeOptions,
    updateSettings,
  } = useClick();

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 pb-3 space-y-3">
      <div className="flex items-center gap-1.5">
        <Mouse className="size-4 text-app-text-muted shrink-0" />
        <h3 className="text-sm font-bold text-app-text-primary uppercase tracking-wide">
          Click Options
        </h3>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div className="space-y-3 text-xs">
        <ChoiceGroup
          label="Mouse Button"
          options={mouseButtonOptions}
          value={mouseButton}
          onChange={(val) => updateSettings({ mouseButton: val })}
        />

        <Separator className="w-[calc(100%+2rem)] -mx-4" />

        <ChoiceGroup
          label="Click type"
          options={clickTypeOptions}
          value={clickType}
          onChange={(typeId) => updateSettings({ clickType: typeId })}
        />
      </div>
    </div>
  );
};