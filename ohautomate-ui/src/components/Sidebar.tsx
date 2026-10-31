import React from "react";
import { useNav } from "../hooks/useNav";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarFooter } from "./sidebar/SidebarFooter";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useNav();

  return (
    <aside className="w-64 bg-app-surface border-r border-app-border flex flex-col justify-between h-screen p-4 shrink-0 transition-all duration-200 ease-in-out">
      <div className="space-y-3">
        <SidebarHeader />
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <SidebarFooter activeTab={activeTab} setActiveTab={setActiveTab} />
    </aside>
  );
};