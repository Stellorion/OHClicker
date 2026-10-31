import React from "react";
import { Settings, Keyboard } from "lucide-react";
import type { SidebarNavProps } from "../../types/ui-state";

export const SidebarFooter: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab, isExpanded }) => {
  const isSettingsActive = activeTab === "settings";

  return (
    <div className="space-y-2">
      {isExpanded && (
        <div className="bg-app-bg/60 border border-app-border rounded-xl p-3 space-y-2.5 shadow-sm text-xs">
          <div className="flex items-center space-x-2 text-app-text-muted font-medium">
            <Keyboard className="size-3.5 shrink-0" />
            <span>Global hotkeys</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {[
              { label: "Click", key: "F6" },
              { label: "Record", key: "F9" },
              { label: "Play", key: "F10" },
            ].map((hotkey) => (
              <div
                key={hotkey.label}
                className="flex items-center justify-between text-app-text-secondary"
              >
                <span>{hotkey.label}</span>
                <kbd className="px-2 py-0.5 bg-app-surface border border-app-border rounded text-app-text-primary shadow-sm">
                  {hotkey.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setActiveTab("settings")}
        title={!isExpanded ? "Settings" : undefined}
        className={`group relative w-full flex items-center ${
          isExpanded ? "justify-between px-3" : "justify-center px-0"
        } h-10 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
          isSettingsActive
            ? "bg-app-surface-hover text-app-red border-l-2 border-app-red translate-x-1"
            : "border-l-2 border-transparent text-app-text-secondary hover:text-app-red hover:bg-app-surface-hover hover:translate-x-1"
        }`}
      >
        <div className={`flex items-center ${isExpanded ? "space-x-3" : "justify-center"}`}>
          <Settings className="size-4 shrink-0" />
          {isExpanded && <span>Settings</span>}
        </div>

        {isExpanded && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-app-bg border border-app-border rounded text-app-text-muted shadow-sm">
              Alt
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-app-bg border border-app-border rounded text-app-text-muted shadow-sm">
              `
            </kbd>
          </div>
        )}
      </button>
    </div>
  );
};