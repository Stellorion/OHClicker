import React from "react";
import { Input } from "./Input";

interface LabeledInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  position?: "prefix" | "suffix";
  disabled?: boolean;
  widthClass?: string;
  min?: number;
  max?: number;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  position = "prefix",
  disabled = false,
  widthClass = "w-20",
  min,
  max,
}) => {
  const isPrefix = position === "prefix";

  return (
    <div
      className={`relative flex items-center transition-opacity ${
        disabled ? "opacity-30 pointer-events-none select-none" : "opacity-100"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-app-text-muted pointer-events-none select-none ${
          isPrefix ? "left-2.5" : "right-2.5"
        }`}
      >
        {label}
      </span>

      {/* Input */}
      <Input
        type="number"
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${widthClass} text-xs font-bold border border-app-border bg-app-bg text-app-text-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-lg py-1.5 ${
          isPrefix ? "pl-6 pr-2 text-right" : "pl-3 pr-7 text-right"
        }`}
      />
    </div>
  );
};