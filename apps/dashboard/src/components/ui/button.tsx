import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#22416D] disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      default: 'bg-[#22416D] text-white shadow-xs hover:bg-[#1A3356] active:scale-[0.98]',
      destructive: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:scale-[0.98]',
      outline: 'border border-slate-200 bg-white shadow-xs hover:bg-slate-50 hover:text-slate-900 text-slate-800',
      secondary: 'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80',
      ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
      link: 'text-[#22416D] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-11 px-4 py-2',
      sm: 'h-9 rounded-md px-3 text-xs',
      lg: 'h-12 rounded-md px-8',
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
