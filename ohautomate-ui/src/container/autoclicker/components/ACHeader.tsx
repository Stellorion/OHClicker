import React from "react";
import { useAC } from "../hooks/useAC";
import { Button } from "../../../components/common/Button";
import { Separator } from "../../../components/common/Separator";
import { Play, Square } from "lucide-react";

export const ACHeader: React.FC = () => {
  const { settings, stats, toggleExecution } = useAC();

  return (
    <div className="bg-app-surface border border-app-border rounded-xl p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span
              className={`relative inline-flex w-2.5 h-2.5 rounded-full ${
                stats.isRunning
                  ? "bg-app-red after:absolute after:inset-0 after:rounded-full after:bg-app-red after:animate-ping"
                  : "bg-emerald-500"
              }`}
            />
            <span className="text-xs font-semibold tracking-wider text-app-text-secondary">
              {stats.isRunning ? "Clicking..." : "Ready"}
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-app-text-primary tracking-tight">
              {stats.isRunning ? stats.currentCps : settings.cps}
            </span>
            <span className="text-sm font-medium text-app-text-muted">
              clicks / sec
            </span>
          </div>

          <p className="text-xs font-mono text-app-text-muted">
            {((1000 / (stats.isRunning ? stats.currentCps : settings.cps || 1))).toFixed(1)} ms interval
          </p>
        </div>

        <div className="flex flex-col items-end space-y-1.5">
          <Button
            onClick={toggleExecution}
            className={`flex items-center justify-center gap-2 w-36 py-5 rounded-lg font-bold text-sm transition-all shadow-md ${
              stats.isRunning
                ? "bg-app-surface text-app-red border border-app-red hover:bg-app-surface-hover"
                : "bg-app-red text-white hover:bg-app-red-hover active:bg-app-red-active"
            }`}
          >
            {stats.isRunning ? (
              <>
                <Square className="size-4 fill-current" />
                Stop Clicking
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" />
                Start Clicking
              </>
            )}
          </Button>

          <div className="flex items-center space-x-1.5 text-xs text-app-text-muted">
            <span>or press</span>
            <kbd className="px-1.5 py-0.5 font-mono font-semibold text-app-text-primary bg-app-bg border border-app-border rounded">
              {settings.startStopHotkey || "F6"}
            </kbd>
          </div>
        </div>
      </div>

      <Separator className="w-[calc(100%+2rem)] -mx-4" />

      <div className="grid grid-cols-3 text-left">
        <div>
          <p className="text-xs font-medium text-app-text-secondary">Clicks</p>
          <p className="text-xl font-extrabold text-app-text-primary font-mono tracking-tight mt-0.5">
            {stats.totalClicks ?? 0}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-app-text-secondary">Elapsed</p>
          <p className="text-xl font-extrabold text-app-text-primary font-mono tracking-tight mt-0.5">
            {stats.elapsedFormatted ?? "00:00"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-app-text-secondary">Avg. rate</p>
          <p className="text-xl font-extrabold text-app-text-primary font-mono tracking-tight mt-0.5">
            {(stats.avgRate ?? 0).toFixed(1)} <span className="text-xs font-normal text-app-text-muted">CPS</span>
          </p>
        </div>
      </div>
    </div>
  );
};