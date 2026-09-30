import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  variant?: 'line' | 'card' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  circle = false,
  variant = 'line',
  className = '',
  style,
  ...props
}) => {
  const inlineStyles: React.CSSProperties = {
    width: width,
    height: height,
    ...style,
  };

  const radiusClass =
    circle || variant === 'circle'
      ? 'rounded-full'
      : variant === 'card'
      ? 'rounded-2xl border border-white/10'
      : 'rounded-md';

  return (
    <div
      aria-hidden="true"
      style={inlineStyles}
      className={`animate-pulse bg-white/10 ${radiusClass} ${className}`}
      {...props}
    />
  );
};
