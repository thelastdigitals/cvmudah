import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
import { applySeo } from '@/lib/seo';
import { Spinner } from '@/components/ui/Spinner';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CVBuilderPage = lazy(() => import('@/pages/CVBuilderPage'));
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'));
const CoverLetterPage = lazy(() => import('@/pages/CoverLetterPage'));
const GuidePage = lazy(() => import('@/pages/GuidePage'));
const ExamplesPage = lazy(() => import('@/pages/ExamplesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const TITLES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'CVMudah — Buat CV dan Surat Lamaran Kerja Gratis',
    description:
      'Buat CV profesional dan surat lamaran kerja gratis dengan template modern. Edit langsung, lihat preview, lalu unduh atau cetak dokumenmu.',
  },
  '/buat-cv': {
    title: 'Buat CV Profesional Gratis | CVMudah',
    description:
      'Editor CV gratis dengan preview langsung. Isi data, pilih template, lalu unduh CV sebagai PDF atau cetak langsung.',
  },
  '/template-cv': {
    title: 'Template CV Profesional Gratis | CVMudah',
    description:
      'Pilih dari enam template CV profesional: ATS-friendly, minimalis, fresh graduate, hingga desain kreatif. Semua gratis.',
  },
  '/surat-lamaran': {
    title: 'Pembuat Surat Lamaran Kerja Gratis | CVMudah',
    description:
      'Buat surat lamaran kerja profesional dalam bahasa Indonesia. Pilih template, isi formulir, lalu salin, unduh, atau cetak suratmu.',
  },
  '/panduan': {
    title: 'Panduan Membuat CV dan Surat Lamaran | CVMudah',
    description:
      'Panduan lengkap membuat CV yang baik, menulis profil profesional, mencapai pencapaian terukur, dan memilih template ATS-friendly.',
  },
  '/contoh-cv': {
    title: 'Contoh CV Profesional | CVMudah',
    description:
      'Contoh CV untuk fresh graduate, administrasi, customer service, desain grafis, marketing, dan IT. Gunakan sebagai inspirasi.',
  },
  '/tentang': {
    title: 'Tentang CVMudah | CVMudah',
    description: 'CVMudah adalah alat gratis untuk membuat CV dan surat lamaran kerja langsung di browser tanpa registrasi.',
  },
  '/kontak': {
    title: 'Kontak | CVMudah',
    description: 'Hubungi pengelola CVMudah untuk pertanyaan, saran, atau laporan masalah.',
  },
  '/kebijakan-privasi': {
    title: 'Kebijakan Privasi | CVMudah',
    description: 'Bagaimana CVMudah memproses dan menyimpan datamu: semuanya di perangkatmu sendiri.',
  },
  '/ketentuan-layanan': {
    title: 'Ketentuan Layanan | CVMudah',
    description: 'Ketentuan penggunaan layanan CVMudah.',
  },
};

function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = TITLES[pathname];
    if (seo) {
      applySeo({ path: pathname, ...seo });
    } else {
      applySeo({
        path: pathname,
        title: 'Halaman Tidak Ditemukan | CVMudah',
        description: 'Halaman yang kamu cari tidak ditemukan.',
      });
    }
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <SeoManager />
        <div id="app-root-shell" className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            <Suspense
              fallback={
                <div className="flex justify-center py-24">
                  <Spinner label="Memuat halaman" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/buat-cv" element={<CVBuilderPage />} />
                <Route path="/template-cv" element={<TemplatesPage />} />
                <Route path="/surat-lamaran" element={<CoverLetterPage />} />
                <Route path="/panduan" element={<GuidePage />} />
                <Route path="/contoh-cv" element={<ExamplesPage />} />
                <Route path="/tentang" element={<AboutPage />} />
                <Route path="/kontak" element={<ContactPage />} />
                <Route path="/kebijakan-privasi" element={<PrivacyPage />} />
                <Route path="/ketentuan-layanan" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
