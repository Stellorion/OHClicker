// "Window" row of the Boundaries card (only shown for Region = Choose window).
import { ACWindowPicker } from "./ACWindowPicker";
import type { WindowInfo } from "../../types/window-types";

interface ACWindowRowProps {
  title: string;
  onChoose: (window: WindowInfo) => void;
  isOpen: boolean
}

export const ACWindowRow: React.FC<ACWindowRowProps> = ({ title, onChoose, isOpen }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-bold text-app-text-primary">Window</p>
      <label className="text-xs text-app-text-secondary block leading-relaxed">
        Clicks only inside this window
      </label>
    </div>
    <ACWindowPicker title={title} onChoose={onChoose} isOpen={isOpen} />
  </div>
);
