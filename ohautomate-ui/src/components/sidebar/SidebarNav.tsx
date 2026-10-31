import React from "react";
import { MousePointerClick, Workflow } from "lucide-react";
import { Button } from "../common/Button";
import type { SidebarNavProps } from "../../types/ui-state";

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
}) => {
  const navItems = [
    {
      id: "clicker",
      label: "Auto Clicker",
      icon: MousePointerClick,
      shortcut: ["Alt", "1"],
    },
    {
      id: "macro",
      label: "Macro Editor",
      icon: Workflow,
      shortcut: ["Alt", "2"],
    },
  ] as const;

  return (
    <div className="space-y-2">
      <nav className="space-y-2">
        {navItems.map(({ id, label, icon: Icon, shortcut }) => {
          const isActive = activeTab === id;
          return (
            <Button
              key={id}
              onClick={() => setActiveTab(id)}
              title={!isExpanded ? label : undefined}
              className={`group relative w-full flex items-center ${
                isExpanded ? "justify-between px-3" : "justify-center px-0"
              } h-10 py-2.5 rounded-md text-sm font-medium border-0 border-l-2 transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-app-surface-hover text-app-red border-app-red translate-x-1"
                  : "border-transparent text-app-text-secondary hover:text-app-red hover:bg-app-surface-hover hover:translate-x-1"
              }`}
            >
              <div className={`flex items-center ${isExpanded ? "space-x-3" : "justify-center"}`}>
                <Icon className="size-4 shrink-0" />
                {isExpanded && <span>{label}</span>}
              </div>

              {isExpanded && shortcut && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {shortcut.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-1.5 py-0.5 text-sm font-mono bg-app-bg border border-app-border rounded text-app-text-muted shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};