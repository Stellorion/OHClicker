import React from "react";
import { Separator } from "../common/Separator";

export const SidebarHeader: React.FC = () => (
  <div className="space-y-3">
    <div className="flex items-center space-x-3 px-2">
      <div className="w-8 h-8 rounded bg-app-red flex items-center justify-center font-bold text-white shadow-lg">
        OH
      </div>
      <h1 className="font-bold text-app-text-primary tracking-wide text-md">
        Automate
      </h1>
    </div>
    <Separator className="w-[calc(100%+2rem)] -mx-4" />
  </div>
);