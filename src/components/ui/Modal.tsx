import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lift focus:outline-none"
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
            aria-label="Tutup dialog"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="text-sm text-ink-600">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
