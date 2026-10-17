export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  photo: string; // data URL, optional
}

export interface Education {
  id: string;
  institution: string;
  major: string;
  degree: string;
  city: string;
  startYear: string;
  endYear: string;
  ongoing: boolean;
  description: string;
  gpa: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  ongoing: boolean;
  description: string;
  achievements: string;
}

export interface OrganizationExperience {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
  achievements: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url: string;
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  url: string;
}

export interface AdditionalInfo {
  awards: string;
  volunteer: string;
  publications: string;
  other: string;
}

export type CVSectionId =
  | 'education'
  | 'experience'
  | 'organizations'
  | 'skills'
  | 'certificates'
  | 'languages'
  | 'projects'
  | 'additional';

export interface CVData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  organizations: OrganizationExperience[];
  skills: Skill[];
  certificates: Certificate[];
  languages: LanguageSkill[];
  projects: Project[];
  additional: AdditionalInfo;
  sectionOrder: CVSectionId[];
  hiddenSections: CVSectionId[];
  templateId: TemplateId;
}

export type TemplateId =
  | 'ats-classic'
  | 'modern-professional'
  | 'minimalist'
  | 'fresh-graduate'
  | 'executive'
  | 'creative';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  atsFriendly: boolean;
}

export const TEMPLATE_CATALOG: TemplateMeta[] = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    description:
      'Satu kolom, tipografi bersih, tanpa elemen dekoratif. Cocok untuk sistem rekrutmen yang membaca teks CV secara otomatis.',
    category: 'Formal',
    atsFriendly: true,
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description:
      'Nama besar di bagian atas dengan aksen biru profesional dan hierarki tipografi yang jelas. Pilihan aman untuk berbagai industri.',
    category: 'Formal',
    atsFriendly: false,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description:
      'Desain sederhana dengan banyak ruang kosong dan garis tipis. Fokus pada pengalaman dan pencapaian.',
    category: 'Minimalis',
    atsFriendly: true,
  },
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate',
    description:
      'Menonjolkan pendidikan, proyek, organisasi, magang, dan keahlian. Tetap rapi meski belum ada pengalaman kerja.',
    category: 'Fresh Graduate',
    atsFriendly: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    description:
      'Desain formal dan elegan dengan fokus pada pengalaman, kepemimpinan, dan pencapaian. Cocok untuk kandidat berpengalaman.',
    category: 'Formal',
    atsFriendly: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    description:
      'Aksen warna terkendali dengan struktur visual modern, tanpa mengorbankan keterbacaan. Cocok untuk industri kreatif.',
    category: 'Kreatif',
    atsFriendly: false,
  },
];
