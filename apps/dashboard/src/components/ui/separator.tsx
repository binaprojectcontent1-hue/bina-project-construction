import React from 'react';

export const Separator: React.FC<{ className?: string; orientation?: 'horizontal' | 'vertical' }> = ({
  className = '',
  orientation = 'horizontal',
}) => {
  return (
    <div
      className={`shrink-0 bg-slate-200 ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className}`}
    />
  );
};
