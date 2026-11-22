// Outlined button that shows a spinner while its action is running.
import type { ACBusyButtonProps } from "../../../types/options-props";
import { Loader2 } from "lucide-react";
import { Button } from "../../common/Button";
import { OUTLINE_BUTTON } from "../../../lib/styles";

export const ACBusyButton: React.FC<ACBusyButtonProps> = ({
  icon,
  busy,
  disabled,
  onClick,
  children,
}) => (
  <Button className={OUTLINE_BUTTON} onClick={onClick} disabled={disabled}>
    {busy ? <Loader2 className="size-3.5 animate-spin" /> : icon}
    {children}
  </Button>
);
