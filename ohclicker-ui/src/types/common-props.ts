// Props of the shared building blocks in components/common/.
import type { ReactNode } from "react";

export interface ChoiceOption<T extends string | number> {
  id: T;
  label: string;
}

export interface ChoiceGroupProps<T extends string | number> {
  label?: string;
  description?: string;
  icon?: ReactNode;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export interface HotkeyInputProps {
  value: string;
  onChange?: (key: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface LabeledInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  position?: "prefix" | "suffix";
  disabled?: boolean;
  widthClass?: string;
  min?: number;
  max?: number;
}

export interface SettingRowProps {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showSlider?: boolean;
  onChange: (value: number) => void;
  className?: string;
}
