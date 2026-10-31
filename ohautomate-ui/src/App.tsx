import { Sidebar } from "./components/Sidebar";
import { useNav } from "./hooks/useNav";
import { ACPage } from "./container/autoclicker/ACPage";
import { Button } from "./components/common/Button";
import { Minimize2, Maximize2, MousePointerClick, Workflow, Settings } from "lucide-react";

export default function App() {
  const { activeTab, currentMode, setPageMode } = useNav();

  // Map active tab titles and icons
  const tabConfig = {
    clicker: { label: "Auto Clicker", icon: MousePointerClick },
    macro: { label: "Macro Editor", icon: Workflow },
    settings: { label: "Settings", icon: Settings },
  };

  const currentTabInfo = tabConfig[activeTab as keyof typeof tabConfig] || {
    label: activeTab,
    icon: Settings,
  };
  const ActiveIcon = currentTabInfo.icon;

  return (
    <div className="flex h-screen bg-app-bg text-app-text-primary antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 border-b border-app-border px-6 flex items-center justify-between bg-app-surface">
          <div className="flex items-center space-x-2.5">
            <ActiveIcon className="size-4 text-app-text-muted shrink-0" />
            <h2 className="font-semibold text-sm capitalize text-app-text-primary">
              {currentTabInfo.label}
            </h2>
          </div>

          <div className="flex bg-app-bg p-1 rounded-lg border border-app-border text-xs font-medium gap-1">
            <Button
              onClick={() => setPageMode(activeTab, "minimized")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all border-0 ${
                currentMode === "minimized"
                  ? "bg-app-red text-white shadow-sm"
                  : "text-app-text-muted hover:text-app-text-primary"
              }`}
            >
              <Minimize2 className="size-3.5" />
              <span>Minimized</span>
            </Button>
            <Button
              onClick={() => setPageMode(activeTab, "advanced")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all border-0 ${
                currentMode === "advanced"
                  ? "bg-app-red text-white shadow-sm"
                  : "text-app-text-muted hover:text-app-text-primary"
              }`}
            >
              <Maximize2 className="size-3.5" />
              <span>Advanced</span>
            </Button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6">
          {activeTab === "clicker" && <ACPage />}
          {activeTab !== "clicker" && (
            <div className="p-4 rounded-lg bg-app-surface border border-app-border text-sm text-app-text-muted">
              {currentTabInfo.label} module workspace coming up next.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}