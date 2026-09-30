import React, { useEffect, useState, useId } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatTileProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: 'aqua' | 'crimson' | 'amber' | 'mint' | 'indigo';
  sparkline?: number[];
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  trend,
  trendLabel,
  subtitle,
  icon,
  accentColor = 'aqua',
  sparkline,
  compact = false,
  onClick,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const gradientId = useId();

  // Smooth number interpolation on value changes
  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = displayValue;
    const endVal = value;
    const duration = 550; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = startVal + (endVal - startVal) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  const borderAccent = {
    aqua: 'border-l-4 border-l-aqua',
    crimson: 'border-l-4 border-l-crimson',
    amber: 'border-l-4 border-l-amber-400',
    mint: 'border-l-4 border-l-mint',
    indigo: 'border-l-4 border-l-indigo-500',
  }[accentColor];

  const iconBg = {
    aqua: 'bg-aqua/15 text-aqua',
    crimson: 'bg-crimson/15 text-crimson',
    amber: 'bg-amber-400/15 text-amber-300',
    mint: 'bg-mint/15 text-mint',
    indigo: 'bg-indigo-500/15 text-indigo-300',
  }[accentColor];

  const strokeHex = {
    aqua: '#22D3EE',
    crimson: '#EF4444',
    amber: '#FBBF24',
    mint: '#34D399',
    indigo: '#6366F1',
  }[accentColor];

  // Compute SVG sparkline path if sparkline data is provided
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const width = compact ? 76 : 96;
    const height = compact ? 24 : 30;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - 3 - ((val - min) / range) * (height - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
    const lastPt = points[points.length - 1].split(',');

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeHex} stopOpacity="0.38" />
            <stop offset="100%" stopColor={strokeHex} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={strokeHex}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={lastPt[0]}
          cy={lastPt[1]}
          r="2.5"
          fill={strokeHex}
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card ${compact ? 'p-3' : 'p-5'} ${borderAccent} ${
        onClick ? 'cursor-pointer hover:border-white/30 hover:scale-[1.01]' : ''
      } transition-all ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`${
            compact ? 'text-[10px]' : 'text-xs'
          } font-mono font-bold text-slate-400 uppercase tracking-wider truncate`}
        >
          {label}
        </span>
        {icon && (
          <span className={`${compact ? 'p-1.5' : 'p-2'} rounded-lg ${iconBg} shrink-0`}>
            {icon}
          </span>
        )}
      </div>

      <div className={`${compact ? 'mt-1.5' : 'mt-3'} flex items-end justify-between gap-2`}>
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span
            className={`${
              compact ? 'text-xl sm:text-2xl' : 'text-3xl'
            } font-extrabold font-display text-white tracking-tight truncate`}
          >
            {prefix}
            {displayValue.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
            {suffix}
          </span>

          {trend && (
            <span
              className={`text-[10px] font-mono font-bold flex items-center gap-0.5 shrink-0 ${
                trend === 'up'
                  ? 'text-crimson'
                  : trend === 'down'
                  ? 'text-mint'
                  : 'text-slate-400'
              }`}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              {trendLabel}
            </span>
          )}
        </div>

        {renderSparkline()}
      </div>

      {subtitle && (
        <p className={`${compact ? 'mt-1 text-[10px]' : 'mt-2 text-xs'} text-slate-400 truncate`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

