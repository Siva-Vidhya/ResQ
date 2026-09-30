import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-bold font-sans transition-all duration-200 select-none rounded-subtle active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px]';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'btn-gradient shadow-neon-aqua',
      secondary:
        'bg-navy-900 hover:bg-navy-800 text-slate-100 border border-white/15 hover:border-aqua/40 shadow-sm',
      ghost:
        'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white',
      danger:
        'bg-crimson hover:bg-crimson-dark text-white border border-crimson/50 shadow-neon-crimson',
      outline:
        'bg-transparent border border-aqua/60 hover:bg-aqua/10 text-aqua',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
