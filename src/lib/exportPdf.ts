import { sanitizeFileName } from './sanitize';

/**
 * Renders a DOM node to a paginated A4 PDF and triggers the browser
 * download. jspdf + html2canvas are lazy-loaded so they stay out of
 * the initial bundle.
 */
export async function exportNodeToPdf(node: HTMLElement, filename: string): Promise<void> {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  if (document.fonts?.ready) await document.fonts.ready;
  await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

  const width = Math.max(node.scrollWidth, node.getBoundingClientRect().width);
  const height = Math.max(node.scrollHeight, node.getBoundingClientRect().height);
  if (!width || !height) throw new Error('EMPTY_NODE');

  const canvas = await html2canvas(node, {
    scale: Math.min(3, Math.max(2, window.devicePixelRatio || 1)),
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
  });
  if (!canvas.width || !canvas.height) throw new Error('EMPTY_CANVAS');

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const pxPerMm = canvas.width / pageW;

  if (canvas.height <= pageH * pxPerMm) {
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageW, canvas.height / pxPerMm);
  } else {
    const sliceH = Math.floor(pageH * pxPerMm);
    let y = 0;
    while (y < canvas.height) {
      const h = Math.min(sliceH, canvas.height - y);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = h;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) throw new Error('CANVAS_2D_UNAVAILABLE');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, -y);
      if (y > 0) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageW, h / pxPerMm);
      y += h;
    }
  }
  pdf.save(filename);
}

export function triggerPrint(): void {
  window.print();
}

export function buildFileName(prefix: string, name: string): string {
  const safe = sanitizeFileName(name);
  return safe ? `${prefix}-${safe}.pdf` : `${prefix}.pdf`;
}
