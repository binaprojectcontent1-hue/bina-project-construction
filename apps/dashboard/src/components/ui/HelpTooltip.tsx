import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  label?: string;
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ content, label, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label={label || 'Petunjuk Bantuan'}
        className="inline-flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors ml-1 p-0.5 rounded-full hover:bg-slate-100"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-2.5 bg-[#0D192B] text-white text-xs rounded-lg shadow-xl border border-[#17202A] animate-in fade-in-0 zoom-in-95 leading-relaxed pointer-events-auto"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-[11px] text-slate-200">
              {content}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 sm:hidden"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#0D192B]" />
        </div>
      )}
    </div>
  );
};
