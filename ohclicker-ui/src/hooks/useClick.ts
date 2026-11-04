// Logic for the click options (mouse button, click type).
import { useAC } from "./useAC";
import type { MouseButton, ClickType } from "../types/ac-types";
import type { ChoiceOption } from "../components/common/ChoiceGroup";

const MOUSE_BUTTON_OPTIONS: ChoiceOption<MouseButton>[] = [
  { id: "left", label: "Left" },
  { id: "middle", label: "Middle" },
  { id: "right", label: "Right" },
];

const CLICK_TYPE_OPTIONS: ChoiceOption<ClickType>[] = [
  { id: "single", label: "Single" },
  { id: "hold", label: "Hold" },
];

/** Settings + the option lists for the ChoiceGroups. */
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