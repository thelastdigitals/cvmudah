import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applySeo } from '@/lib/seo';
import { AdSlot } from '@/components/ui/AdSlot';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Form';
import { CVDocument } from '@/components/cv/CVDocument';
import { A4Scaler } from '@/components/cv/A4Scaler';
import { cvStorage } from '@/lib/storage';
import type { CVData } from '@/types/cv';

interface ExampleCV {
  id: string;
  title: string;
  description: string;
  data: CVData;
}

function example(id: string, overrides: Partial<CVData>): CVData {
  return {
    personal: {
      fullName: '', headline: '', email: '', phone: '', city: '', province: '',
      linkedin: '', portfolio: '', summary: '', photo: '',
    },
    education: [], experience: [], organizations: [], skills: [], certificates: [],
    languages: [], projects: [], additional: { awards: '', volunteer: '', publications: '', other: '' },
    sectionOrder: ['education', 'experience', 'organizations', 'skills', 'certificates', 'languages', 'projects', 'additional'],
    hiddenSections: [],
    templateId: 'ats-classic',
    ...overrides,
  };
}

const EXAMPLES: ExampleCV[] = [
  {
    id: 'fresh-graduate',
    title: 'Fresh Graduate',
    description: 'Lulusan baru tanpa pengalaman kerja formal. Menonjolkan pendidikan, organisasi, dan magang.',
    data: example('fg', {
      templateId: 'fresh-graduate',
      personal: {
        fullName: 'Dimas Prakoso (contoh)',
        headline: 'Fresh Graduate Teknik Informatika',
        email: 'dimas.prakoso@contoh.email',
        phone: '0813 2211 9090',
        city: 'Surabaya',
        province: 'Jawa Timur',
        linkedin: '',
        portfolio: 'https://github.com/contoh-dimas',
        summary: 'Lulusan Teknik Informatika dengan minat pada pengembangan web. Aktif dalam proyek kampus dan kompetisi pemrograman.',
        photo: '',
      },
      education: [
        { id: 'e1', institution: 'Institut Contoh Teknologi', major: 'Teknik Informatika', degree: 'S1', city: 'Surabaya', startYear: '2020', endYear: '2024', ongoing: false, description: '', gpa: '3.60' },
      ],
      organizations: [
        { id: 'o1', name: 'Unit Kegiatan Pemrograman', role: 'Anggota Divisi Pelatihan', period: '2022 - 2023', description: 'Menjadi asisten pelatihan dasar Python untuk anggota baru.', achievements: '' },
      ],
      skills: [
        { id: 's1', name: 'JavaScript' }, { id: 's2', name: 'Python' }, { id: 's3', name: 'Git' },
      ],
      projects: [
        { id: 'p1', name: 'Sistem Perpustakaan Kampus', description: 'Aplikasi web sederhana untuk peminjaman buku dengan login mahasiswa.', role: 'Backend Developer', url: '' },
      ],
      languages: [
        { id: 'l1', name: 'Bahasa Indonesia', level: 'Bahasa Ibu' },
        { id: 'l2', name: 'Bahasa Inggris', level: 'Menengah' },
      ],
    }),
  },
  {
    id: 'administrasi',
    title: 'Administrasi',
    description: 'Staf administrasi dengan fokus pada pengelolaan dokumen dan data.',
    data: example('adm', {
      templateId: 'ats-classic',
      personal: {
        fullName: 'Siti Rahma (contoh)',
        headline: 'Staf Administrasi',
        email: 'siti.rahma@contoh.email',
        phone: '0812 7788 4545',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        linkedin: '', portfolio: '',
        summary: 'Staf administrasi berpengalaman 3 tahun dalam pengelolaan arsip, input data, dan dukungan operasional kantor.',
        photo: '',
      },
      education: [
        { id: 'e1', institution: 'Universitas Contoh Nusantara', major: 'Manajemen', degree: 'S1', city: 'Jakarta', startYear: '2017', endYear: '2021', ongoing: false, description: '', gpa: '3.40' },
      ],
      experience: [
        { id: 'x1', jobTitle: 'Staf Administrasi', company: 'CV Contoh Mandiri', location: 'Jakarta', startMonth: 'Mar', startYear: '2022', endMonth: '', endYear: '', ongoing: true, description: 'Mengelola surat masuk-keluar, absensi, dan pengarsipan dokumen perusahaan.', achievements: 'Mendigitalisasi 1000+ arsip fisik menjadi sistem digital yang mudah dicari.' },
      ],
      skills: [{ id: 's1', name: 'Microsoft Excel' }, { id: 's2', name: 'Microsoft Word' }, { id: 's3', name: 'Manajemen Arsip' }, { id: 's4', name: 'Komunikasi' }],
      languages: [{ id: 'l1', name: 'Bahasa Indonesia', level: 'Bahasa Ibu' }],
    }),
  },
  {
    id: 'customer-service',
    title: 'Customer Service',
    description: 'Menonjolkan kemampuan komunikasi dan penanganan keluhan pelanggan.',
    data: example('cs', {
      templateId: 'modern-professional',
      personal: {
        fullName: 'Andi Wijaya (contoh)',
        headline: 'Customer Service Officer',
        email: 'andi.wijaya@contoh.email',
        phone: '0856 1919 3434',
        city: 'Bandung',
        province: 'Jawa Barat',
        linkedin: '', portfolio: '',
        summary: 'Customer service dengan pengalaman 2 tahun menangani keluhan pelanggan melalui telepon dan chat.',
        photo: '',
      },
      education: [
        { id: 'e1', institution: 'SMK Contoh 1', major: 'Pemasaran', degree: 'SMA/SMK', city: 'Bandung', startYear: '2016', endYear: '2019', ongoing: false, description: '', gpa: '' },
      ],
      experience: [
        { id: 'x1', jobTitle: 'Customer Service', company: 'PT Contoh Retail', location: 'Bandung', startMonth: 'Jan', startYear: '2022', endMonth: '', endYear: '', ongoing: true, description: 'Menangani pertanyaan dan keluhan pelanggan via telepon dan media sosial.', achievements: 'Mempertahankan rating kepuasan pelanggan di atas 90% selama 4 bulan berturut-turut.' },
      ],
      skills: [{ id: 's1', name: 'Komunikasi' }, { id: 's2', name: 'Penanganan Keluhan' }, { id: 's3', name: 'CRM' }, { id: 's4', name: 'Kerja Tim' }],
      languages: [
        { id: 'l1', name: 'Bahasa Indonesia', level: 'Bahasa Ibu' },
        { id: 'l2', name: 'Bahasa Sunda', level: 'Fasih' },
      ],
    }),
  },
  {
    id: 'desain-grafis',
    title: 'Desain Grafis',
    description: 'Portofolio visual dengan template Creative.',
    data: example('dg', {
      templateId: 'creative',
      personal: {
        fullName: 'Maya Anggraini (contoh)',
        headline: 'Graphic Designer',
        email: 'maya.anggraini@contoh.email',
        phone: '0812 3131 6767',
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        linkedin: '',
        portfolio: 'https://behance.net/contoh-maya',
        summary: 'Desainer grafis dengan fokus pada identitas visual dan media sosial. Terbiasa bekerja dengan klien UMKM.',
        photo: '',
      },
      education: [
        { id: 'e1', institution: 'Universitas Contoh Seni', major: 'Desain Komunikasi Visual', degree: 'S1', city: 'Yogyakarta', startYear: '2018', endYear: '2022', ongoing: false, description: '', gpa: '3.50' },
      ],
      experience: [
        { id: 'x1', jobTitle: 'Graphic Designer (Freelance)', company: 'Berbagai klien UMKM', location: '', startMonth: 'Jun', startYear: '2022', endMonth: '', endYear: '', ongoing: true, description: 'Merancang logo, kemasan, dan konten media sosial untuk usaha kecil.', achievements: 'Menyelesaikan 30+ proyek desain dengan rating klien 4.8/5.' },
      ],
      skills: [{ id: 's1', name: 'Adobe Illustrator' }, { id: 's2', name: 'Adobe Photoshop' }, { id: 's3', name: 'Figma' }, { id: 's4', name: 'Desain Kemasan' }],
      projects: [
        { id: 'p1', name: 'Rebranding Kopi Contoh', description: 'Merancang ulang identitas visual kedai kopi lokal: logo, menu, dan kemasan.', role: 'Lead Designer', url: '' },
      ],
    }),
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Pemasaran digital dengan pencapaian terukur.',
    data: example('mkt', {
      templateId: 'executive',
      personal: {
        fullName: 'Rizky Hakim (contoh)',
        headline: 'Digital Marketing Specialist',
        email: 'rizky.hakim@contoh.email',
        phone: '0878 5252 1212',
        city: 'Semarang',
        province: 'Jawa Tengah',
        linkedin: '', portfolio: '',
        summary: 'Spesialis pemasaran digital dengan pengalaman 4 tahun mengelola kampanye media sosial dan iklan berbayar.',
        photo: '',
      },
      education: [
        { id: 'e1', institution: 'Universitas Contoh Pasti', major: 'Manajemen Pemasaran', degree: 'S1', city: 'Semarang', startYear: '2015', endYear: '2019', ongoing: false, description: '', gpa: '3.45' },
      ],
      experience: [
        { id: 'x1', jobTitle: 'Digital Marketing Specialist', company: 'PT Contoh Niaga', location: 'Semarang', startMonth: 'Feb', startYear: '2021', endMonth: '', endYear: '', ongoing: true, description: 'Mengelola kampanye iklan Meta dan Google Ads dengan budget bulanan Rp50 juta.', achievements: 'Menaikkan konversi toko online 45% dalam 6 bulan.' },
        { id: 'x2', jobTitle: 'Social Media Officer', company: 'CV Contoh Media', location: 'Semarang', startMonth: 'Jul', startYear: '2019', endMonth: 'Jan', endYear: '2021', ongoing: false, description: 'Mengelola konten dan engagement media sosial perusahaan.', achievements: 'Menggandakan jumlah pengikut Instagram dari 5 ribu menjadi 11 ribu.' },
      ],
      skills: [{ id: 's1', name: 'Google Ads' }, { id: 's2', name: 'Meta Ads' }, { id: 's3', name: 'SEO' }, { id: 's4', name: 'Analisis Data' }],
      certificates: [
        { id: 'c1', name: 'Google Ads Certification', issuer: 'Google Skillshop', year: '2023', url: '' },
      ],
    }),
  },
  {
    id: 'it-developer',
    title: 'IT & Developer',
    description: 'Pengembang perangkat lunak dengan proyek dan kontribusi teknis.',
    data: example('it', {
      templateId: 'minimalist',
      personal: {
        fullName: 'Bagas Nugroho (contoh)',
        headline: 'Backend Developer',
        email: 'bagas.nugroho@contoh.email',
        phone: '0895 6060 7878',
        city: 'Depok',
        province: 'Jawa Barat',
        linkedin: '',
        portfolio: 'https://github.com/contoh-bagas',
        summary: 'Backend developer dengan 3 tahun pengalaman membangun REST API dan sistem antrean pesanan.',
        photo: '',
      },
      education: [
        { id: 'e1', institution: 'Universitas Contoh Indonesia', major: 'Ilmu Komputer', degree: 'S1', city: 'Depok', startYear: '2016', endYear: '2020', ongoing: false, description: '', gpa: '3.55' },
      ],
      experience: [
        { id: 'x1', jobTitle: 'Backend Developer', company: 'PT Contoh Teknologi', location: 'Jakarta', startMonth: 'Sep', startYear: '2021', endMonth: '', endYear: '', ongoing: true, description: 'Mengembangkan dan memelihara REST API untuk platform logistik.', achievements: 'Mempercepat waktu respons API utama dari 800ms menjadi 200ms.' },
      ],
      skills: [{ id: 's1', name: 'Node.js' }, { id: 's2', name: 'PostgreSQL' }, { id: 's3', name: 'Docker' }, { id: 's4', name: 'Redis' }],
      projects: [
        { id: 'p1', name: 'Pustaka Open Source Validasi', description: 'Library validasi data berbahasa TypeScript dengan 200+ bintang di GitHub.', role: 'Maintainer', url: '' },
      ],
    }),
  },
];

export default function ExamplesPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<ExampleCV | null>(null);
  const [confirmExample, setConfirmExample] = useState<ExampleCV | null>(null);

  useEffect(() => {
    applySeo({
      path: '/contoh-cv',
      title: 'Contoh CV Profesional | CVMudah',
      description:
        'Contoh CV untuk fresh graduate, administrasi, customer service, desain grafis, marketing, dan IT. Gunakan sebagai inspirasi.',
    });
  }, []);

  const openInEditor = (ex: ExampleCV) => {
    const current = cvStorage.load().data;
    const hasData = current && Object.values(current.personal).some((v) => typeof v === 'string' && v.trim());
    if (hasData) {
      setConfirmExample(ex);
      return;
    }
    applyExample(ex);
  };

  const applyExample = (ex: ExampleCV) => {
    setConfirmExample(null);
    navigate('/buat-cv', { state: { templateId: ex.data.templateId, applyExample: ex.data } });
  };

  return (
    <div className="container-app py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">Beranda</Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Contoh CV</span>
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">Contoh CV Profesional</h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Semua contoh di bawah menggunakan identitas fiktif. Gunakan sebagai referensi struktur dan pilihan kata, lalu
        isi dengan data aslimu di editor.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <div key={ex.id} className="flex flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
            <h2 className="font-bold text-ink-900">{ex.title}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{ex.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setPreview(ex)}>
                Lihat Contoh
              </Button>
              <Button size="sm" variant="ghost" onClick={() => openInEditor(ex)}>
                Gunakan sebagai Inspirasi
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_EXAMPLES as string | undefined} />

      <div className="mt-10 rounded-2xl bg-brand-50 p-8 text-center">
        <h2 className="text-xl font-bold text-ink-900">Mulai Membuat CV Sendiri</h2>
        <p className="mt-2 text-ink-600">Terinspirasi dari contoh di atas? Langsung buat versi kamu sendiri.</p>
        <Link
          to="/buat-cv"
          className="mt-5 inline-flex items-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Mulai Buat CV
        </Link>
      </div>

      <Modal open={preview !== null} onClose={() => setPreview(null)} title={preview ? `Contoh: ${preview.title}` : ''}>
        {preview && (
          <div className="max-h-[65vh] overflow-auto rounded-xl bg-ink-100 p-3">
            <A4Scaler maxWidth={420}>
              <CVDocument cv={preview.data} />
            </A4Scaler>
          </div>
        )}
      </Modal>

      <Modal
        open={confirmExample !== null}
        onClose={() => setConfirmExample(null)}
        title="Gunakan Contoh Ini?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmExample(null)}>Batal</Button>
            <Button onClick={() => confirmExample && applyExample(confirmExample)}>Lanjutkan</Button>
          </>
        }
      >
        <p>
          Draft CV kamu saat ini berisi data. Contoh CV akan menggantikan isi editor setelah kamu konfirmasi -
          pastikan kamu sudah menyimpan data penting sebelumnya, karena draft di perangkat ini akan ditimpa.
        </p>
      </Modal>
    </div>
  );
}
