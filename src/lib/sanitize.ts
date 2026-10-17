export function sanitizeFileName(name: string): string {
  return (
    name
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'dokumen'
  );
}

const DANGEROUS_URL = /^(javascript|data|vbscript|file):/i;

export function isSafeHttpUrl(value: string): boolean {
  if (!value) return false;
  if (DANGEROUS_URL.test(value.trim())) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Read a user-uploaded image file into a resized data URL (max dimension 600px, JPEG). */
export function readImageFile(file: File, maxSizeBytes = 2 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('FORMAT'));
      return;
    }
    if (file.size > maxSizeBytes) {
      reject(new Error('SIZE'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('READ'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('BROKEN'));
      img.onload = () => {
        const maxDim = 600;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof reader.result === 'string' ? reader.result : '');
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  });
}
