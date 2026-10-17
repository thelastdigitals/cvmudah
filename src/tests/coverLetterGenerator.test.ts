import { describe, it, expect } from 'vitest';
import { generateCoverLetter } from '@/lib/coverLetterGenerator';
import type { CoverLetterForm } from '@/types/coverLetter';

function baseForm(overrides: Partial<CoverLetterForm> = {}): CoverLetterForm {
  return {
    applicantName: 'Rina Kartika',
    email: 'rina@contoh.email',
    phone: '0812 3456 7890',
    city: 'Bandung',
    date: '2026-01-05',
    companyName: 'PT Maju Jaya',
    recipientName: '',
    position: 'Staf Administrasi',
    vacancySource: 'LinkedIn',
    education: 'S1 Administrasi Bisnis',
    experience: 'Magang 6 bulan sebagai staf administrasi.',
    skills: 'Excel, komunikasi',
    reason: 'Saya tertarik dengan budaya kerja perusahaan.',
    closing: '',
    body: '',
    templateId: 'formal',
    ...overrides,
  };
}

describe('generateCoverLetter - formal', () => {
  const out = generateCoverLetter(baseForm());

  it('memuat tanggal, tujuan, perihal, dan nama', () => {
    expect(out.content).toContain('Bandung,');
    expect(out.content).toContain('Yth.');
    expect(out.content).toContain('Staf Administrasi');
    expect(out.content).toContain('PT Maju Jaya');
    expect(out.content).toContain('Rina Kartika');
  });

  it('menyebut sumber lowongan', () => {
    expect(out.content).toContain('LinkedIn');
  });

  it('tidak mengarang klaim pengalaman di luar input', () => {
    expect(out.content).toContain('Magang 6 bulan sebagai staf administrasi.');
  });
});

describe('generateCoverLetter - fresh graduate', () => {
  const out = generateCoverLetter(baseForm({ templateId: 'fresh-graduate', experience: '' }));
  it('menyebut pendidikan dan tidak mengarang pengalaman', () => {
    expect(out.content).toContain('S1 Administrasi Bisnis');
    expect(out.content).not.toContain('Magang 6 bulan');
  });
});

describe('generateCoverLetter - email', () => {
  const out = generateCoverLetter(baseForm({ templateId: 'email' }));
  it('menghasilkan subjek dan teks ringkas', () => {
    expect(out.subject).toContain('Permohonan Lamaran');
    expect(out.content).toContain('Kepada Tim Rekrutmen');
  });
});

describe('generateCoverLetter - magang', () => {
  const out = generateCoverLetter(baseForm({ templateId: 'internship' }));
  it('menyebut permohonan magang', () => {
    expect(out.content).toContain('Permohonan Magang');
  });
});

describe('generateCoverLetter - field opsional kosong', () => {
  const out = generateCoverLetter(
    baseForm({
      vacancySource: '',
      education: '',
      experience: '',
      skills: '',
      reason: '',
      recipientName: '',
    }),
  );
  it('tidak menyebut sumber lowongan yang tidak ada', () => {
    expect(out.content).not.toContain('melalui undefined');
    expect(out.content).not.toContain('undefined');
  });

  it('menggunakan salam default tanpa nama perekrut', () => {
    expect(out.content).toContain('Human Capital Department');
  });
});
