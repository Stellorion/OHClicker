// Props of the Options section rows (components/autoclicker/options/).
import type { ReactNode } from "react";
import type { LinkedProfile } from "./profile-types";

/** Which profile action is running (the other buttons are disabled meanwhile). */
export type BusyAction = "import" | "export" | "link" | "unlink" | null;

export interface ACSwitchRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface ACLinkedPathButtonProps {
  path: string;
  onReveal: () => void;
}

export interface ACLinkedProfileRowProps {
  linked: LinkedProfile;
  busy: BusyAction;
  onLink: () => void;
  onUnlink: () => void;
  onReveal: () => void;
}

export interface ACBusyButtonProps {
  /** Icon shown while idle. */
  icon: ReactNode;
  /** true = show the spinner instead of the icon. */
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

export interface ACProfileRowProps {
  busy: BusyAction;
  onImport: () => void;
  onExport: () => void;
}
