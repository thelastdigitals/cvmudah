import { describe, it, expect } from 'vitest';
import {
  validateCV,
  validateEmail,
  validatePhone,
  validateHttpUrl,
  hasAnyContent,
} from '@/lib/validation';
import { emptyCV, DEMO_CV } from '@/lib/cvData';

describe('validateEmail', () => {
  it('menerima email valid', () => {
    expect(validateEmail('nama@email.com')).toBeUndefined();
  });
  it('menolak email tanpa @', () => {
    expect(validateEmail('nama.email.com')).toBeDefined();
  });
  it('kosong dianggap tidak error (opsional di banyak konteks)', () => {
    expect(validateEmail('')).toBeUndefined();
  });
});

describe('validatePhone', () => {
  it('menerima nomor wajar', () => {
    expect(validatePhone('0812 3456 7890')).toBeUndefined();
  });
  it('menolak karakter aneh', () => {
    expect(validatePhone('0812abc!!')).toBeDefined();
  });
  it('menolak nomor terlalu pendek', () => {
    expect(validatePhone('123')).toBeDefined();
  });
});

describe('validateHttpUrl', () => {
  it('menerima https', () => {
    expect(validateHttpUrl('https://linkedin.com/in/abc')).toBeUndefined();
  });
  it('menolak javascript: URL', () => {
    expect(validateHttpUrl('javascript:alert(1)')).toBeDefined();
  });
  it('menolak teks biasa', () => {
    expect(validateHttpUrl('bukan url')).toBeDefined();
  });
});

describe('validateCV', () => {
  it('nama kosong menjadi error pemblokir', () => {
    const cv = emptyCV();
    const res = validateCV(cv);
    expect(res.valid).toBe(false);
    expect(res.errors.fullName).toBeDefined();
    expect(res.blocking.length).toBeGreaterThan(0);
  });
  it('CV demo valid', () => {
    const res = validateCV(DEMO_CV);
    expect(res.valid).toBe(true);
    expect(res.blocking).toHaveLength(0);
  });
  it('tahun selesai lebih awal dari tahun mulai ditolak', () => {
    const cv = emptyCV();
    cv.personal.fullName = 'Budi';
    cv.education.push({
      id: 'e1', institution: 'Universitas X', major: 'Ilkom', degree: 'S1', city: '',
      startYear: '2020', endYear: '2019', ongoing: false, description: '', gpa: '',
    });
    const res = validateCV(cv);
    expect(res.valid).toBe(false);
    expect(res.errors.education['e1']).toBeDefined();
  });
  it('pendidikan yang masih berlangsung tidak butuh tahun selesai', () => {
    const cv = emptyCV();
    cv.personal.fullName = 'Budi';
    cv.education.push({
      id: 'e2', institution: 'Universitas Y', major: 'Akuntansi', degree: 'S1', city: '',
      startYear: '2022', endYear: '', ongoing: true, description: '', gpa: '',
    });
    const res = validateCV(cv);
    expect(res.valid).toBe(true);
  });
  it('email tidak valid memblokir ekspor', () => {
    const cv = emptyCV();
    cv.personal.fullName = 'Budi';
    cv.personal.email = 'salah-format';
    const res = validateCV(cv);
    expect(res.valid).toBe(false);
    expect(res.errors.email).toBeDefined();
  });
});

describe('hasAnyContent', () => {
  it('CV kosong tidak punya konten', () => {
    expect(hasAnyContent(emptyCV())).toBe(false);
  });
  it('CV dengan nama dianggap berkonten', () => {
    const cv = emptyCV();
    cv.personal.fullName = 'Budi';
    expect(hasAnyContent(cv)).toBe(true);
  });
});
