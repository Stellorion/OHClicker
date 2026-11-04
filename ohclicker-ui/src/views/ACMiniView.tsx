// Minimized layout: header + the two compact cards.
import React from "react";
import { ACHeader } from "../components/autoclicker/ACHeader";
import { ACMiniClickCard } from "./mini/ACMiniClickCard";
import { ACMiniRunCard } from "./mini/ACMiniRunCard";

export const ACMinimizedView: React.FC = () => (
  <div className="space-y-6 max-w-4xl mx-auto">
    <ACHeader />
    <ACMiniClickCard />
    <ACMiniRunCard />
  </div>
);
