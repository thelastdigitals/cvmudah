import type { CVData } from '@/types/cv';
import type { CoverLetterForm } from '@/types/coverLetter';

const PREFIX = 'cvmudah:';
const CV_KEY = `${PREFIX}cv`;
const LETTER_KEY = `${PREFIX}cover-letter`;

function available(): boolean {
  try {
    const k = `${PREFIX}test`;
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function storageAvailable(): boolean {
  return available();
}

interface LoadResult<T> {
  data: T | null;
  corrupted: boolean;
  quota: boolean;
}

function load<T>(key: string): LoadResult<T> {
  if (!available()) return { data: null, corrupted: false, quota: false };
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { data: null, corrupted: false, quota: false };
    return { data: JSON.parse(raw) as T, corrupted: false, quota: false };
  } catch {
    return { data: null, corrupted: true, quota: false };
  }
}

function save<T>(key: string, value: T): { ok: boolean; quota: boolean } {
  if (!available()) return { ok: false, quota: false };
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true, quota: false };
  } catch (e) {
    const quota =
      e instanceof DOMException &&
      (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014);
    return { ok: false, quota };
  }
}

function remove(key: string): void {
  if (!available()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const cvStorage: {
  load: () => LoadResult<CVData>;
  save: (cv: CVData) => { ok: boolean; quota: boolean };
  remove: () => void;
} = {
  load: () => load<CVData>(CV_KEY),
  save: (cv) => save(CV_KEY, cv),
  remove: () => remove(CV_KEY),
};

export const letterStorage: {
  load: () => LoadResult<CoverLetterForm>;
  save: (value: CoverLetterForm) => { ok: boolean; quota: boolean };
  remove: () => void;
} = {
  load: () => load<CoverLetterForm>(LETTER_KEY),
  save: (value) => save(LETTER_KEY, value),
  remove: () => remove(LETTER_KEY),
};

export function clearAllLocalData(): void {
  remove(CV_KEY);
  remove(LETTER_KEY);
}
