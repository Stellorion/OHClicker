// One setting: label + optional slider + number input (value is clamped to min..max).
import type { SettingRowProps } from "../../types/common-props";
import React, { useEffect, useId } from 'react';
import { useFieldTextStore } from '../../store/useFieldTextStore';
import { Slider } from './Slider';
import { Input } from './Input';

/** Keeps the typed text separate from the number so half-typed values are allowed. */
export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit,
  showSlider = false,
  onChange,
  className = '',
}) => {
  // The typed text lives in a store, under an id that is unique for this row.
  const id = useId();
  const textValue = useFieldTextStore((s) => s.texts[id] ?? value.toString());
  const { setText, clearText } = useFieldTextStore.getState();

  useEffect(() => {
    setText(id, value.toString()); // the number changed: show it
  }, [id, value, setText]);

  useEffect(() => () => clearText(id), [id, clearText]); // forget the text on unmount

  /** Typing: update the text and send the clamped number. */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(id, raw);

    const num = Number(raw);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      onChange(clamped);
    }
  };

  /** Slider: forward the number. */
  const handleSliderChange = (val: number | readonly number[]) => {
    const newValue = Array.isArray(val) ? val[0] : val;
    onChange(Number(newValue));
  };

  return (
    <div className={`flex items-center justify-between gap-4 text-xs ${className}`}>
      <div className="max-w-[45%]">
        <p className="text-sm font-semibold text-app-text-primary">{label}</p>
        {description && (
          <label className="text-app-text-secondary block leading-relaxed">
            {description}
          </label>
        )}
      </div>

      {showSlider && (
        <div className="flex-1 px-2">
          <Slider
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
      )}

      <div className="relative flex items-center shrink-0">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={textValue}
          onChange={handleInputChange}
          onBlur={() => setText(id, value.toString())}
          className={`font-mono bg-app-bg border-app-border font-bold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            unit ? 'w-20 pr-7' : 'w-16'
          }`}
        />
        {unit && (
          <span className="absolute right-2.5 top-2 text-[12px] font-mono text-app-text-muted pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};