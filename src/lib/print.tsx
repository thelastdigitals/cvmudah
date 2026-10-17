import { createPortal } from 'react-dom';

/**
 * Portal target for printable documents. CSS `@media print` shows only
 * #print-root and hides the app shell, so what the user previews is
 * exactly what gets printed / saved as PDF.
 */
export function PrintPortal({ children }: { children: React.ReactNode }) {
  let host = document.getElementById('print-root');
  if (!host) {
    host = document.createElement('div');
    host.id = 'print-root';
    document.body.appendChild(host);
  }
  return createPortal(<div className="print-doc">{children}</div>, host);
}
