// "Repeat: until stopped / fixed count [n]" row. Used by Click limits and the minimized view.
import { ChoiceGroup } from "../common/ChoiceGroup";
import { Input } from "../common/Input";
import { useLimits } from "../../hooks/useLimit";
import { NUMBER_INPUT } from "../../lib/styles";

export const ACRepeatRow: React.FC = () => {
  const { repeatType, fixedCountLimit, repeatTypeOptions, updateSettings } = useLimits();
  const isFixedRepeat = repeatType === "fixed_count";

  return (
    <div className="flex items-center justify-between gap-4">
      <ChoiceGroup
        label="Repeat"
        options={repeatTypeOptions}
        value={repeatType}
        onChange={(val) => updateSettings({ repeatType: val })}
        className="w-full"
      />

      {/* The count only matters in "fixed count" mode */}
      <div className={`relative flex items-center transition-opacity ${isFixedRepeat ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
        <Input
          type="number"
          value={fixedCountLimit}
          disabled={!isFixedRepeat}
          onChange={(e) => updateSettings({ fixedCountLimit: Number(e.target.value) })}
          className={`w-24 pl-3 ${NUMBER_INPUT}`}
        />
      </div>
    </div>
  );
};
