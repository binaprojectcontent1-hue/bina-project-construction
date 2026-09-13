import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  pill?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type, pill = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex ${pill ? 'h-11 rounded-full px-5' : 'h-10 rounded-xl px-3.5'} w-full border border-slate-200 bg-white py-2 text-sm text-slate-900 shadow-xs transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#22416D]/15 focus-visible:border-[#22416D] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[100px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#22416D]/15 focus-visible:border-[#22416D] disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed transition-all ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
