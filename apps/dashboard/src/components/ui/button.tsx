import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'pill';
  pill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', pill = false, ...props }, ref) => {
    const isPill = pill || size === 'pill';
    const baseStyles =
      `inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22416D]/30 disabled:pointer-events-none disabled:opacity-50 select-none ${
        isPill ? 'rounded-full' : 'rounded-xl'
      }`;

    const variants = {
      default: 'bg-[#22416D] text-white shadow-xs hover:bg-[#1A3356] active:scale-[0.98]',
      destructive: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:scale-[0.98]',
      outline: 'border border-slate-200 bg-white shadow-xs hover:bg-slate-50 hover:text-slate-900 text-slate-800',
      secondary: 'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80',
      ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
      link: 'text-[#22416D] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: isPill ? 'h-11 px-5 py-2' : 'h-11 px-4 py-2',
      sm: isPill ? 'h-9 px-4 text-xs' : 'h-9 px-3 text-xs',
      lg: isPill ? 'h-12 px-8' : 'h-12 px-8',
      pill: 'h-11 px-6 text-sm',
      icon: 'h-11 w-11',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
