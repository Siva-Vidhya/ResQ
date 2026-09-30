import { forwardRef, type HTMLAttributes } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'interactive' | 'crimson' | 'aqua';
  noPadding?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, variant = 'base', noPadding = false, className = '', ...props }, ref) => {
    let variantStyles = 'glass-card';

    if (variant === 'elevated') {
      variantStyles = 'glass-card-elevated shadow-glass';
    } else if (variant === 'interactive') {
      variantStyles = 'glass-card-interactive';
    } else if (variant === 'crimson') {
      variantStyles = 'glass-card border-crimson/40 bg-crimson/5 shadow-neon-crimson';
    } else if (variant === 'aqua') {
      variantStyles = 'glass-card border-aqua/40 bg-aqua/5 shadow-neon-aqua';
    }

    const paddingStyles = noPadding ? '' : 'p-5 sm:p-6';

    return (
      <div
        ref={ref}
        className={`${variantStyles} ${paddingStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
