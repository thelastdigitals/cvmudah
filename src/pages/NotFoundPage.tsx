import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { applySeo } from '@/lib/seo';

export default function NotFoundPage() {
  useEffect(() => {
    applySeo({
      path: '/',
      title: 'Halaman Tidak Ditemukan | CVMudah',
      description: 'Halaman yang kamu cari tidak ditemukan.',
    });
  }, []);

  return (
    <div className="container-app flex flex-col items-center py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <FileQuestion className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-bold text-ink-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 max-w-md text-ink-500">
        Halaman yang kamu cari mungkin sudah dipindahkan atau alamatnya salah.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Kembali ke Beranda
        </Link>
        <Link
          to="/buat-cv"
          className="rounded-xl border border-ink-200 bg-white px-6 py-3 font-semibold text-ink-800 transition-colors hover:bg-ink-50"
        >
          Buat CV
        </Link>
      </div>
    </div>
  );
}
