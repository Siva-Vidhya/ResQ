import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const switchSizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  }[size];

  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none min-h-[44px] ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 ${
          switchSizes.track
        } ${checked ? 'bg-gradient-to-r from-aqua to-indigo-500 shadow-neon-aqua' : 'bg-white/20'}`}
      >
        <span
          className={`inline-block transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
            switchSizes.thumb
          } ${checked ? switchSizes.translate : 'translate-x-0.5'}`}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs sm:text-sm font-bold text-white">{label}</span>}
          {description && <span className="text-[11px] text-slate-400">{description}</span>}
        </div>
      )}
    </label>
  );
};
