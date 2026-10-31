import React, { useState, useEffect } from 'react';
import { Slider } from './Slider';
import { Input } from './Input';

interface SettingRowProps {
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
  const [textValue, setTextValue] = useState(value.toString());

  useEffect(() => {
    setTextValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTextValue(raw);

    const num = Number(raw);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      onChange(clamped);
    }
  };

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
          onBlur={() => setTextValue(value.toString())}
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