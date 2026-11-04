import { ACPage } from "./views/ACPage";
import { Button } from "./components/common/Button";
import { Minimize2, Maximize2, MousePointerClick } from "lucide-react";
import { useUIStore } from "./store/useUIStore";
import { NoticeDialog } from "./components/common/NoticeDialog";

export default function App() {
  const currentMode = useUIStore((state) => state.clickerMode);
  const setClickerMode = useUIStore((state) => state.setClickerMode);

  return (
    <div className="flex h-screen bg-app-bg text-app-text-primary antialiased">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 border-b border-app-border px-6 flex items-center justify-between bg-app-surface">
          <div className="flex items-center space-x-2.5">
            <MousePointerClick className="size-4 text-app-text-muted shrink-0" />
            <h2 className="font-semibold text-sm capitalize text-app-text-primary">
              Auto Clicker
            </h2>
          </div>

          <div className="flex bg-app-bg p-1 rounded-lg border border-app-border text-xs font-medium gap-1">
            <Button
              onClick={() => setClickerMode("minimized")}
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
              onClick={() => setClickerMode("advanced")}
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
          <ACPage />
        </section>
      </main>
      <NoticeDialog />
    </div>
  );
}