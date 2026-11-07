// Dropdown with the open windows (Boundaries -> Region = Choose window).
import { AppWindow, Check, ChevronDown, RotateCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../common/DropdownMenu";
import { useWindowList } from "../../hooks/useWindowList";
import type { WindowInfo } from "../../types/window-types";

interface ACWindowPickerProps {
  title: string;
  onChoose: (window: WindowInfo) => void;
  isOpen: boolean
}

export const ACWindowPicker: React.FC<ACWindowPickerProps> = ({
  title,
  onChoose,
  isOpen,
}) => {
  const { windows, refresh } = useWindowList();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-full items-center gap-2 cursor-pointer rounded-md border border-app-border bg-app-bg px-3 text-xs font-medium text-app-text-primary transition-colors hover:bg-app-surface-hover focus:outline-none">
        <AppWindow className="size-3.5 shrink-0 text-app-text-muted" />

        <span className="min-w-0 flex-1 truncate text-left">
          {title || "Choose a window"}
        </span>

        <ChevronDown className="size-3.5 shrink-0 text-app-text-muted" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="min-w-(--anchor-width) max-h-72 overflow-y-auto"
      >
        <DropdownMenuGroup className={"px-2 py-1"}>
          {title ? (isOpen ? title : `${title} (closed)`) : "Choose a window"}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {windows.map((window) => {
          const isSelected = window.title === title;

          return (
            <DropdownMenuItem
              key={window.id}
              onClick={() => onChoose(window)}
              className="min-h-11 cursor-pointer"
            >
              <AppWindow className="size-4 shrink-0 text-app-text-muted" />

              <span className="min-w-0 flex-1 truncate">
                {window.title}
              </span>

              {isSelected && (
                <Check className="size-4 shrink-0 text-app-red" />
              )}
            </DropdownMenuItem>
          );
        })}

        {windows.length === 0 && (
          <p className="px-2 py-3 text-xs text-app-text-muted">
            No windows found
          </p>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => void refresh()}
          className="min-h-11 text-app-text-secondary cursor-pointer"
        >
          <RotateCw className="size-3.5" />
          Refresh windows
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};