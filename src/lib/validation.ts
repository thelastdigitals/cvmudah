import type { CVData } from '@/types/cv';

export interface CVErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  education: Record<string, string>;
  experience: Record<string, string>;
}

export interface ValidationResult {
  valid: boolean;
  errors: CVErrors;
  blocking: string[]; // messages that block export
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  if (!value) return undefined;
  return EMAIL_RE.test(value.trim()) ? undefined : 'Format email tidak valid.';
}

export function validatePhone(value: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^0-9+()\-\s]/g, '');
  if (value !== digits) return 'Nomor telepon berisi karakter yang tidak sesuai.';
  const digitCount = digits.replace(/[^0-9]/g, '').length;
  if (digitCount < 8 || digitCount > 16) return 'Nomor telepon harus terdiri dari 8-16 digit.';
  return undefined;
}

export function validateHttpUrl(value: string): string | undefined {
  if (!value) return undefined;
  try {
    const u = new URL(value.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return 'URL harus dimulai dengan http:// atau https://';
    }
    return undefined;
  } catch {
    return 'URL tidak valid. Contoh: https://linkedin.com/in/namakamu';
  }
}

export function isNumericYear(value: string): boolean {
  return /^\d{4}$/.test(value.trim());
}

export function validateCV(cv: CVData): ValidationResult {
  const errors: CVErrors = { education: {}, experience: {} };
  const blocking: string[] = [];

  if (!cv.personal.fullName.trim()) {
    errors.fullName = 'Nama lengkap wajib diisi sebelum mengunduh atau mencetak.';
    blocking.push('Nama lengkap wajib diisi.');
  }

  const emailErr = validateEmail(cv.personal.email);
  if (emailErr) {
    errors.email = emailErr;
    blocking.push(emailErr);
  }

  const phoneErr = validatePhone(cv.personal.phone);
  if (phoneErr) {
    errors.phone = phoneErr;
    blocking.push(phoneErr);
  }

  const liErr = validateHttpUrl(cv.personal.linkedin);
  if (liErr) {
    errors.linkedin = liErr;
    blocking.push(liErr);
  }

  const pfErr = validateHttpUrl(cv.personal.portfolio);
  if (pfErr) {
    errors.portfolio = pfErr;
    blocking.push(pfErr);
  }

  for (const edu of cv.education) {
    if (!edu.institution.trim() && !edu.major.trim()) continue; // skip empty rows
    if (isNumericYear(edu.startYear) && isNumericYear(edu.endYear) && !edu.ongoing) {
      if (Number(edu.endYear) < Number(edu.startYear)) {
        errors.education[edu.id] = 'Tahun selesai tidak boleh lebih awal dari tahun mulai.';
        blocking.push(`Pendidikan "${edu.institution}": tahun selesai lebih awal dari tahun mulai.`);
      }
    }
    if ((edu.startYear && !isNumericYear(edu.startYear)) || (!edu.ongoing && edu.endYear && !isNumericYear(edu.endYear))) {
      errors.education[edu.id] = 'Tahun harus berupa 4 angka, misalnya 2023.';
      blocking.push(`Pendidikan "${edu.institution}": tahun tidak valid.`);
    }
  }

  for (const exp of cv.experience) {
    if (!exp.jobTitle.trim() && !exp.company.trim()) continue;
    if (isNumericYear(exp.startYear) && isNumericYear(exp.endYear) && !exp.ongoing) {
      if (Number(exp.endYear) < Number(exp.startYear)) {
        errors.experience[exp.id] = 'Tahun selesai tidak boleh lebih awal dari tahun mulai.';
        blocking.push(`Pengalaman "${exp.jobTitle}": tahun selesai lebih awal dari tahun mulai.`);
      }
    }
  }

  return { valid: blocking.length === 0, errors, blocking };
}

export function hasAnyContent(cv: CVData): boolean {
  const p = cv.personal;
  if (p.fullName || p.headline || p.email || p.phone || p.city || p.summary) return true;
  return (
    cv.education.length > 0 ||
    cv.experience.length > 0 ||
    cv.organizations.length > 0 ||
    cv.skills.length > 0 ||
    cv.certificates.length > 0 ||
    cv.languages.length > 0 ||
    cv.projects.length > 0 ||
    Object.values(cv.additional).some((v) => v.trim())
  );
}
