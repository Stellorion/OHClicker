// Dropdown to choose which display the screen map and overlays use.
import { Check, ChevronDown, Monitor, RotateCw } from "lucide-react";
import type { DisplayInfo } from "../../../types/ac-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../common/DropdownMenu";
import {
  countNames,
  friendlyName,
  relativePosition,
  scaleLabel,
} from "../../../lib/displayUtil";

interface DisplaySelectorProps {
  displays: DisplayInfo[];
  selectedDisplay?: DisplayInfo;
  onSelect: (id: string) => void;
  onRefresh: () => void;
}

/** Duplicate display names get their coordinates appended. */
export const DisplaySelector: React.FC<DisplaySelectorProps> = ({
  displays,
  selectedDisplay,
  onSelect,
  onRefresh,
}) => {
  const nameCounts = countNames(displays);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-full items-center gap-2 rounded-md border border-app-border bg-app-bg px-3 text-xs font-medium text-app-text-primary transition-colors hover:bg-app-surface-hover focus:outline-none">
        <Monitor className="size-3.5 shrink-0 text-app-text-muted" />
        <span className="min-w-0 flex-1 truncate text-left">
          {selectedDisplay
            ? `${friendlyName(selectedDisplay)} · ${selectedDisplay.width} × ${selectedDisplay.height}`
            : "Select display"}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-app-text-muted" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="min-w-(--anchor-width)"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Choose display</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {displays.map((display) => {
          const isSelected = display.id === selectedDisplay?.id;
          const name = friendlyName(display);
          return (
            <DropdownMenuItem
              key={display.id}
              onClick={() => onSelect(display.id)}
              className="min-h-11"
            >
              <Monitor
                className={`size-4 shrink-0 ${
                  isSelected ? "text-app-red" : "text-app-text-muted"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-app-text-primary">
                  {name}
                  {nameCounts[name] > 1
                    ? ` (${display.originX}, ${display.originY})`
                    : ""}
                </span>
                <span className="block truncate text-[11px] text-app-text-muted">
                  {display.width} × {display.height} · {scaleLabel(display)} ·{" "}
                  {relativePosition(display)}
                </span>
              </span>
              {isSelected && <Check className="size-4 shrink-0 text-app-red" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onRefresh}
          className="text-app-text-secondary"
        >
          <RotateCw className="size-3.5" /> Refresh displays
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};