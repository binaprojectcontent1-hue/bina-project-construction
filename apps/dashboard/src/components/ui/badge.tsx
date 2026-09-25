import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide transition-colors border';

  const variants = {
    default: 'border-[#1B365D]/20 bg-[#1B365D]/10 text-[#1B365D]',
    secondary: 'border-slate-200 bg-slate-100 text-slate-700',
    destructive: 'border-rose-200 bg-rose-50 text-rose-700',
    outline: 'border-slate-300 bg-white text-slate-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-200 bg-blue-50 text-blue-700',
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
};
