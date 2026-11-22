// Segmented control: pick one of several options (e.g. Left / Middle / Right).
import type { ChoiceGroupProps } from "../../types/common-props";
import React from 'react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

/** Generic over the option id type; `label` is optional. */
export function ChoiceGroup<T extends string | number>({
  label,
  description,
  icon,
  options,
  value,
  onChange,
  className,
}: ChoiceGroupProps<T>) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {label && (
        <div className="flex items-start gap-2.5 max-w-[45%]">
          {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
          <div>
            <p className="text-sm font-bold text-app-text-primary">{label}</p>
            {description && (
              <label className="font-semibold text-app-text-secondary block leading-relaxed text-xs">
                {description}
              </label>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-0.5 bg-app-bg p-0.5 rounded-lg border border-app-border flex-wrap">
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <Button
              key={String(option.id)}
              type="button"
              onClick={() => onChange(option.id)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all text-xs ${
                isSelected
                  ? "bg-app-red text-white shadow-sm"
                  : "text-app-text-secondary hover:text-app-text-primary bg-transparent hover:bg-app-surface"
              }`}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}