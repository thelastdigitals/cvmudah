import type { CVData, CVSectionId, TemplateId } from '@/types/cv';

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDateID(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function monthYearLabel(month: string, year: string): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const idx = months.indexOf(month);
  const m = idx >= 0 ? months[idx] : month;
  if (!m && !year) return '';
  if (!m) return year;
  if (!year) return m;
  return `${m} ${year}`;
}

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const SECTION_LABELS: Record<CVSectionId, string> = {
  education: 'Pendidikan',
  experience: 'Pengalaman Kerja',
  organizations: 'Magang & Organisasi',
  skills: 'Keahlian',
  certificates: 'Sertifikat & Pelatihan',
  languages: 'Bahasa',
  projects: 'Proyek & Portofolio',
  additional: 'Informasi Tambahan',
};

export const DEFAULT_SECTION_ORDER: CVSectionId[] = [
  'education',
  'experience',
  'organizations',
  'skills',
  'certificates',
  'languages',
  'projects',
  'additional',
];

export function emptyCV(templateId: TemplateId = 'ats-classic'): CVData {
  return {
    personal: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      city: '',
      province: '',
      linkedin: '',
      portfolio: '',
      summary: '',
      photo: '',
    },
    education: [],
    experience: [],
    organizations: [],
    skills: [],
    certificates: [],
    languages: [],
    projects: [],
    additional: { awards: '', volunteer: '', publications: '', other: '' },
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    hiddenSections: [],
    templateId,
  };
}

export const SKILL_SUGGESTIONS = [
  'Microsoft Excel',
  'Komunikasi',
  'Desain Grafis',
  'Kerja Tim',
  'Microsoft Word',
  'Manajemen Waktu',
  'Google Workspace',
  'Public Speaking',
  'Pemasaran Digital',
  'Problem Solving',
];

export const LANG_LEVELS = [
  'Pemula',
  'Menengah',
  'Mahir',
  'Fasih',
  'Bahasa Ibu',
];

export const DEMO_CV: CVData = {
  personal: {
    fullName: 'Rina Kartika',
    headline: 'Administrasi & Pengelolaan Data',
    email: 'rina.kartika@contoh.email',
    phone: '0812 3456 7890',
    city: 'Bandung',
    province: 'Jawa Barat',
    linkedin: 'https://linkedin.com/in/contoh-rina',
    portfolio: '',
    summary:
      'Lulusan Administrasi dengan pengalaman magang di bidang pengelolaan dokumen dan data. Terbiasa bekerja dengan Microsoft Excel dan teliti dalam pekerjaan administratif.',
    photo: '',
  },
  education: [
    {
      id: 'edu-demo-1',
      institution: 'Universitas Contoh Indonesia',
      major: 'Administrasi Bisnis',
      degree: 'S1',
      city: 'Bandung',
      startYear: '2019',
      endYear: '2023',
      ongoing: false,
      description: '',
      gpa: '3.55',
    },
  ],
  experience: [
    {
      id: 'exp-demo-1',
      jobTitle: 'Staf Administrasi (Magang)',
      company: 'PT Contoh Sejahtera',
      location: 'Bandung',
      startMonth: 'Jul',
      startYear: '2022',
      endMonth: 'Des',
      endYear: '2022',
      ongoing: false,
      description:
        'Membantu pengelolaan arsip dokumen dan input data penjualan bulanan ke sistem internal perusahaan.',
      achievements: 'Membuat sistem arsip digital yang memangkas waktu pencarian dokumen hingga 30%.',
    },
  ],
  organizations: [
    {
      id: 'org-demo-1',
      name: 'Himpunan Mahasiswa Administrasi',
      role: 'Sekretaris',
      period: '2021 - 2022',
      description: 'Mengelola surat-menyurat dan notulensi rapat rutin himpunan.',
      achievements: '',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Microsoft Excel' },
    { id: 'sk-2', name: 'Komunikasi' },
    { id: 'sk-3', name: 'Google Workspace' },
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'Pelatihan Microsoft Excel Tingkat Lanjut',
      issuer: 'Contoh Akademi Digital',
      year: '2023',
      url: '',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Bahasa Indonesia', level: 'Bahasa Ibu' },
    { id: 'lang-2', name: 'Bahasa Inggris', level: 'Menengah' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Digitalisasi Arsip Kampus',
      description:
        'Proyek merancang sistem pencatatan arsip digital untuk unit kegiatan mahasiswa selama kuliah.',
      role: 'Koordinator Tim',
      url: '',
    },
  ],
  additional: { awards: '', volunteer: '', publications: '', other: '' },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: [],
  templateId: 'ats-classic',
};
