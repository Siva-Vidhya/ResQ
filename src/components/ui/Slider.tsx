import React from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = '',
  disabled = false,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full space-y-2 select-none ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-bold text-slate-200">{label}</span>}
          <span className="font-mono font-bold text-aqua">
            {value} {unit}
          </span>
        </div>
      )}

      <div className="relative flex items-center h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua accent-aqua"
          style={{
            background: `linear-gradient(to right, #22D3EE 0%, #6366F1 ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
