export type CoverLetterTemplateId =
  | 'formal'
  | 'fresh-graduate'
  | 'experienced'
  | 'internship'
  | 'email';

export interface CoverLetterForm {
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  date: string; // yyyy-mm-dd
  companyName: string;
  recipientName: string;
  position: string;
  vacancySource: string;
  education: string;
  experience: string;
  skills: string;
  reason: string;
  closing: string;
  body: string; // editable generated result
  templateId: CoverLetterTemplateId;
}

export const COVER_LETTER_TEMPLATES: { id: CoverLetterTemplateId; name: string; description: string }[] = [
  { id: 'formal', name: 'Formal', description: 'Surat lamaran formal standar untuk perusahaan.' },
  { id: 'fresh-graduate', name: 'Fresh Graduate', description: 'Menonjolkan pendidikan dan semangat belajar.' },
  { id: 'experienced', name: 'Berpengalaman', description: 'Menonjolkan pengalaman dan pencapaian.' },
  { id: 'internship', name: 'Magang', description: 'Untuk melamar posisi magang atau intern.' },
  { id: 'email', name: 'Email Lamaran', description: 'Versi ringkas untuk dikirim melalui email.' },
];
