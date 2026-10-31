import { useAC } from "./useAC";
import type { ChoiceOption } from "../../../components/common/ChoiceGroup";

export type RepeatType = "until_stopped" | "fixed_count";

const REPEAT_TYPE_OPTIONS: ChoiceOption<RepeatType>[] = [
  { id: "until_stopped", label: "Until stopped" },
  { id: "fixed_count", label: "Fixed count" },
];

export const useLimits = () => {
  const { settings, updateSettings } = useAC();

  return {
    repeatType: settings.repeatType ?? "until_stopped",
    fixedCountLimit: settings.fixedCountLimit ?? 100,
    maxDurationEnabled: settings.maxDurationEnabled ?? false,
    maxDurationSec: settings.maxDurationSec ?? 60,
    repeatTypeOptions: REPEAT_TYPE_OPTIONS,
    updateSettings,
  };
};