import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'pill';
  pill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', pill, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B365D]/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer active:scale-[0.99]';

    const variants = {
      default: 'bg-[#1B365D] text-white shadow-xs hover:bg-[#132845] border border-[#1B365D]',
      destructive: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 border border-rose-600',
      outline: 'border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200/80 border border-transparent',
      ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
      link: 'text-[#1B365D] underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-xs md:text-sm',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-11 px-6 text-sm',
      pill: 'h-9 px-4 text-xs',
      icon: 'h-9 w-9 p-0',
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
