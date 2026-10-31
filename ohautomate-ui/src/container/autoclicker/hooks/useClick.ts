import { useAC } from "./useAC";
import type { ACMouseButton, ACClickType } from "../types/ac-types";
import type { ChoiceOption } from "../../../components/common/ChoiceGroup";

const MOUSE_BUTTON_OPTIONS: ChoiceOption<ACMouseButton>[] = [
  { id: "left", label: "Left" },
  { id: "middle", label: "Middle" },
  { id: "right", label: "Right" },
];

const CLICK_TYPE_OPTIONS: ChoiceOption<ACClickType>[] = [
  { id: "single", label: "Single" },
  { id: "double", label: "Double" },
  { id: "hold", label: "Hold" },
];

export const useClick = () => {
  const { settings, updateSettings } = useAC();

  return {
    cps: settings.cps,
    mouseButton: settings.mouseButton,
    clickType: settings.clickType,
    mouseButtonOptions: MOUSE_BUTTON_OPTIONS,
    clickTypeOptions: CLICK_TYPE_OPTIONS,
    updateSettings,
  };
};