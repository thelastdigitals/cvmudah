import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<number[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = nextId++;
    setItems((prev) => [...prev.slice(-3), { id, kind, message }]);
    const timer = window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
    timers.current.push(timer);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lift transition-opacity ${
              t.kind === 'success'
                ? 'border-success-100 bg-success-50 text-success-700'
                : t.kind === 'error'
                  ? 'border-error-100 bg-error-50 text-error-700'
                  : 'border-ink-200 bg-white text-ink-800'
            }`}
          >
            {t.kind === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            ) : t.kind === 'error' ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            )}
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 opacity-60 transition hover:opacity-100"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
