import React from 'react';

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 72,
  strokeWidth = 6,
  color,
  label,
  showPercent = true,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  // Auto-color if not provided based on value
  const strokeColor =
    color ||
    (clampedValue >= 75
      ? '#EF4444'
      : clampedValue >= 50
      ? '#FB7185'
      : clampedValue >= 25
      ? '#FBBF24'
      : '#34D399');

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Value */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        {showPercent && (
          <span className="font-display font-extrabold text-sm text-white leading-none">
            {Math.round(clampedValue)}%
          </span>
        )}
        {label && <span className="text-[9px] font-mono text-slate-400 mt-0.5">{label}</span>}
      </div>
    </div>
  );
};
