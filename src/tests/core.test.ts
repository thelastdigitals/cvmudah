import { describe, it, expect } from 'vitest';
import { sanitizeFileName, isSafeHttpUrl, readImageFile } from '@/lib/sanitize';
import { buildFileName } from '@/lib/exportPdf';
import { monthYearLabel, formatDateID, emptyCV } from '@/lib/cvData';
import { buildSections } from '@/components/cv/sections';
import { TEMPLATE_CATALOG } from '@/types/cv';

describe('sanitizeFileName', () => {
  it('menghapus karakter ilegal', () => {
    expect(sanitizeFileName('Rina/Kartika: CV*2026?')).toBe('RinaKartika-CV2026');
  });
  it('fallback untuk nama kosong', () => {
    expect(sanitizeFileName('   ')).toBe('dokumen');
  });
});

describe('buildFileName', () => {
  it('menghasilkan nama file CV yang aman', () => {
    expect(buildFileName('CV', 'Budi Santoso')).toBe('CV-Budi-Santoso.pdf');
  });
});

describe('isSafeHttpUrl', () => {
  it('menerima http/https', () => {
    expect(isSafeHttpUrl('https://example.com')).toBe(true);
    expect(isSafeHttpUrl('http://example.com')).toBe(true);
  });
  it('menolak protokol berbahaya', () => {
    expect(isSafeHttpUrl('javascript:void(0)')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,x')).toBe(false);
  });
});

describe('date helpers', () => {
  it('format tanggal Indonesia', () => {
    expect(formatDateID('2026-01-05')).toBe('5 Januari 2026');
  });
  it('label bulan-tahun', () => {
    expect(monthYearLabel('Jan', '2024')).toBe('Jan 2024');
  });
});

describe('buildSections', () => {
  it('bagian kosong tidak ditampilkan', () => {
    const sections = buildSections(emptyCV());
    expect(sections).toHaveLength(0);
  });

  it('menghormati urutan dan penyembunyian bagian', () => {
    const cv = emptyCV();
    cv.skills.push({ id: 's1', name: 'Excel' });
    cv.languages.push({ id: 'l1', name: 'Indonesia', level: 'Ibu' });
    cv.hiddenSections = ['languages'];
    const sections = buildSections(cv);
    expect(sections.map((s) => s.id)).toEqual(['skills']);
  });
});

describe('TEMPLATE_CATALOG', () => {
  it('memuat tepat enam template unik', () => {
    expect(TEMPLATE_CATALOG).toHaveLength(6);
    expect(new Set(TEMPLATE_CATALOG.map((t) => t.id)).size).toBe(6);
  });
});

describe('readImageFile', () => {
  it('menolak format tidak didukung', async () => {
    const file = new File(['x'], 'x.gif', { type: 'image/gif' });
    await expect(readImageFile(file)).rejects.toThrow('FORMAT');
  });
  it('menolak file terlalu besar', async () => {
    const file = new File([new ArrayBuffer(3 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    await expect(readImageFile(file)).rejects.toThrow('SIZE');
  });
});
