import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { RiskLevel } from '../../types';

export interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  label?: string;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showPulse = false,
  label,
  className = '',
}) => {
  const config = {
    CRITICAL: {
      badgeClass: 'badge-critical',
      icon: <ShieldAlert className="shrink-0" />,
      defaultLabel: 'CRITICAL',
      pulseColor: 'bg-crimson',
    },
    WARNING: {
      badgeClass: 'badge-warning',
      icon: <AlertTriangle className="shrink-0" />,
      defaultLabel: 'WARNING',
      pulseColor: 'bg-coral',
    },
    WATCH: {
      badgeClass: 'badge-watch',
      icon: <Info className="shrink-0" />,
      defaultLabel: 'WATCH',
      pulseColor: 'bg-amber-400',
    },
    SAFE: {
      badgeClass: 'badge-safe',
      icon: <CheckCircle className="shrink-0" />,
      defaultLabel: 'SAFE',
      pulseColor: 'bg-mint',
    },
  }[level];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 [&>svg]:w-3 [&>svg]:h-3',
    md: 'text-xs px-2.5 py-1 gap-1.5 [&>svg]:w-3.5 [&>svg]:h-3.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 [&>svg]:w-4 [&>svg]:h-4',
  }[size];

  const text = label || config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center font-mono font-bold rounded-md select-none transition-colors ${config.badgeClass} ${sizeClasses} ${className}`}
    >
      {showPulse && level === 'CRITICAL' && (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson"></span>
        </span>
      )}
      {config.icon}
      <span>{text}</span>
    </span>
  );
};
