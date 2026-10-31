import React from "react";

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isExpanded,
  onToggle,
}) => (
    <div className="flex items-center px-2 h-13.75 space-x-3">

      <button
        onClick={!isExpanded ? onToggle : undefined}
        className="relative w-8 h-8 shrink-0 rounded bg-app-red flex items-center justify-center font-bold text-white shadow-lg group overflow-hidden"
        title={!isExpanded ? "Expand sidebar" : undefined}
      >
        <span className="transition-opacity duration-200 group-hover:opacity-100">
          OH
        </span>

        {!isExpanded && (
          <span className="absolute inset-0 flex items-center justify-center bg-app-red opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-white">
              ☰
            </span>
          </span>
        )}
      </button>

      {isExpanded && (
        <h1 className="font-bold text-app-text-primary tracking-wide text-md">
          Automate
        </h1>
      )}
    </div>
);