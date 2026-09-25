import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, RefreshCw, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'loading';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string, duration?: number) => string;
    error: (title: string, description?: string, duration?: number) => string;
    info: (title: string, description?: string, duration?: number) => string;
    loading: (title: string, description?: string) => string;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (variant: ToastVariant, title: string, description?: string, duration: number = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (variant !== 'loading' && duration > 0) {
        const timer = setTimeout(() => {
          dismiss(id);
        }, duration);
        timeoutsRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  const toastMethods = {
    success: (title: string, description?: string, duration?: number) =>
      addToast('success', title, description, duration),
    error: (title: string, description?: string, duration?: number) =>
      addToast('error', title, description, duration),
    info: (title: string, description?: string, duration?: number) =>
      addToast('info', title, description, duration),
    loading: (title: string, description?: string) =>
      addToast('loading', title, description, 0),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.variant === 'success';
          const isError = t.variant === 'error';
          const isInfo = t.variant === 'info';
          const isLoading = t.variant === 'loading';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 transform translate-y-0 opacity-100 ${
                isSuccess
                  ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
                  : isError
                  ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10'
                  : isInfo
                  ? 'bg-blue-50/95 border-blue-200 text-blue-900 shadow-blue-500/10'
                  : 'bg-slate-900/95 border-slate-700 text-white shadow-slate-900/20'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
                {isInfo && <Info className="w-4 h-4 text-blue-600" />}
                {isLoading && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-semibold leading-tight">{t.title}</p>
                {t.description && (
                  <p
                    className={`text-[11px] mt-0.5 leading-relaxed ${
                      isSuccess
                        ? 'text-emerald-700'
                        : isError
                        ? 'text-rose-700'
                        : isInfo
                        ? 'text-blue-700'
                        : 'text-slate-300'
                    }`}
                  >
                    {t.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className={`p-1 -mr-1 -mt-1 rounded-md shrink-0 transition-colors ${
                  isLoading
                    ? 'hidden'
                    : isSuccess
                    ? 'text-emerald-600 hover:bg-emerald-100'
                    : isError
                    ? 'text-rose-600 hover:bg-rose-100'
                    : isInfo
                    ? 'text-blue-600 hover:bg-blue-100'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
