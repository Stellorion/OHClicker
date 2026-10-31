
import React from "react";
import { useUIStore } from "../store/useUIStore";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { Separator } from "./common/Separator";
import { Menu } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isExpanded, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-app-surface border-r border-app-border flex flex-col justify-between h-screen px-4 pb-3 shrink-0 transition-all duration-200 ease-in-out`}
    >
      <div>
        <div className="flex items-center justify-between">
          <SidebarHeader
            isExpanded={isExpanded}
            onToggle={toggleSidebar}
          />

          {isExpanded && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-app-surface-hover text-app-text-secondary transition-colors"
              aria-label="Collapse sidebar"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <Separator className="w-[calc(100%+2rem)] -mx-4 mb-3" />

        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isExpanded={isExpanded}
        />
      </div>

      <SidebarFooter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isExpanded={isExpanded}
      />
    </aside>
  );
};
