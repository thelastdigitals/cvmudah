import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { applySeo, SITE_CONFIG } from '@/lib/seo';

export default function ContactPage() {
  useEffect(() => {
    applySeo({
      path: '/kontak',
      title: 'Kontak | CVMudah',
      description: 'Hubungi pengelola CVMudah untuk pertanyaan, saran, atau laporan masalah.',
    });
  }, []);

  const email = SITE_CONFIG.contactEmail;

  return (
    <div className="container-app max-w-3xl py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">Beranda</Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Kontak</span>
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">Kontak</h1>
      <p className="mt-3 leading-relaxed text-ink-600">
        Ada pertanyaan, saran, atau menemukan masalah di CVMudah? Hubungi kami melalui email.
      </p>

      <div className="mt-8 rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
        {email ? (
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Mail className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-500">Email pengelola</p>
              <a
                href={`mailto:${email}`}
                className="text-lg font-bold text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {email}
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Mail className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-ink-900">Alamat email belum diatur</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                Alamat email kontak resmi belum dikonfigurasi. Jika kamu pengelola website ini, atur email kontak
                melalui pengaturan lingkungan (variabel <code className="rounded bg-ink-100 px-1.5 py-0.5 text-xs">VITE_CONTACT_EMAIL</code>)
                sebelum mempublikasikan halaman ini.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-500">
        Untuk pertanyaan tentang cara penggunaan, cek terlebih dahulu halaman{' '}
        <Link to="/panduan" className="font-medium text-brand-700 hover:underline">Panduan</Link> dan bagian FAQ di{' '}
        <Link to="/" className="font-medium text-brand-700 hover:underline">Beranda</Link>.
      </p>
    </div>
  );
}
