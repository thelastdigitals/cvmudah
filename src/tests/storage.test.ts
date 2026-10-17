import { describe, it, expect, beforeEach } from 'vitest';
import { cvStorage, letterStorage, clearAllLocalData } from '@/lib/storage';
import { emptyCV } from '@/lib/cvData';

describe('cvStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('menyimpan dan memulihkan draft', () => {
    const cv = emptyCV();
    cv.personal.fullName = 'Budi';
    cvStorage.save(cv);
    const loaded = cvStorage.load();
    expect(loaded.data?.personal.fullName).toBe('Budi');
  });

  it('mengembalikan data null saat belum ada draft', () => {
    expect(cvStorage.load().data).toBeNull();
  });

  it('menandai data JSON rusak sebagai corrupted', () => {
    window.localStorage.setItem('cvmudah:cv', '{bukan json!!!');
    const loaded = cvStorage.load();
    expect(loaded.data).toBeNull();
    expect(loaded.corrupted).toBe(true);
  });

  it('menghapus draft', () => {
    cvStorage.save(emptyCV());
    cvStorage.remove();
    expect(cvStorage.load().data).toBeNull();
  });

  it('menangani localStorage tidak tersedia', () => {
    const original = window.localStorage;
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: blocked, setItem: blocked, removeItem: blocked, clear: blocked },
      configurable: true,
    });
    const res = cvStorage.save(emptyCV());
    expect(res.ok).toBe(false);
    expect(res.quota).toBe(false);
    Object.defineProperty(window, 'localStorage', { value: original, configurable: true });
  });

  it('menandai kuota penuh', () => {
    const original = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: {
        // probe key (cvmudah:test) must succeed so save() proceeds; real key throws quota
        getItem: () => null,
        setItem: (key: string) => {
          if (!key.includes('test')) throw new DOMException('full', 'QuotaExceededError');
        },
        removeItem: () => {},
        clear: () => {},
      },
      configurable: true,
    });
    const res = cvStorage.save(emptyCV());
    expect(res.ok).toBe(false);
    expect(res.quota).toBe(true);
    Object.defineProperty(window, 'localStorage', { value: original, configurable: true });
  });
});

describe('letterStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('menyimpan dan memulihkan draft surat secara terpisah dari CV', () => {
    letterStorage.save({
      applicantName: 'Ani', email: '', phone: '', city: 'Jakarta', date: '2026-01-01',
      companyName: 'PT X', recipientName: '', position: 'Admin', vacancySource: '',
      education: '', experience: '', skills: '', reason: '', closing: '', body: '',
      templateId: 'formal',
    });
    cvStorage.save(emptyCV());
    expect(letterStorage.load().data?.applicantName).toBe('Ani');
    expect(cvStorage.load().data?.personal.fullName).toBe('');
  });

  it('clearAllLocalData menghapus semua draft', () => {
    cvStorage.save(emptyCV());
    letterStorage.save({
      applicantName: 'Ani', email: '', phone: '', city: '', date: '', companyName: '',
      recipientName: '', position: '', vacancySource: '', education: '', experience: '',
      skills: '', reason: '', closing: '', body: '', templateId: 'formal',
    });
    clearAllLocalData();
    expect(cvStorage.load().data).toBeNull();
    expect(letterStorage.load().data).toBeNull();
  });
});
