import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#22416D] focus:ring-offset-2';

  const variants = {
    default: 'border-transparent bg-[#22416D] text-white shadow-xs',
    secondary: 'border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200/80',
    destructive: 'border-transparent bg-rose-500 text-white shadow-xs',
    outline: 'text-slate-800 border-slate-200 bg-white',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 font-medium',
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
};
