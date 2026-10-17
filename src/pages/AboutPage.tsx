import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, FileCheck2, Lock, ServerCrash, Wallet } from 'lucide-react';
import { applySeo } from '@/lib/seo';

export default function AboutPage() {
  useEffect(() => {
    applySeo({
      path: '/tentang',
      title: 'Tentang CVMudah | CVMudah',
      description: 'CVMudah adalah alat gratis untuk membuat CV dan surat lamaran kerja langsung di browser tanpa registrasi.',
    });
  }, []);

  return (
    <div className="container-app max-w-3xl py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">Beranda</Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Tentang</span>
      </nav>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <FileCheck2 className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold text-ink-900">Tentang CVMudah</h1>
      </div>

      <p className="mt-6 leading-relaxed text-ink-600">
        CVMudah adalah alat bantu gratis untuk menyusun CV dan surat lamaran kerja dalam bahasa Indonesia. Tujuannya
        sederhana: siapa pun - pelajar, fresh graduate, atau pekerja berpengalaman - harus bisa membuat dokumen
        lamaran yang rapi dan profesional tanpa perlu belajar desain, membuat akun, atau membayar langganan.
      </p>

      <h2 className="mt-10 text-xl font-bold text-ink-900">Apa yang Gratis?</h2>
      <ul className="mt-4 space-y-3">
        {[
          { icon: Check, text: 'Membuat CV lengkap dengan enam template profesional.' },
          { icon: Check, text: 'Membuat surat lamaran dengan lima format siap pakai.' },
          { icon: Check, text: 'Preview langsung, unduh sebagai PDF, dan cetak dokumen.' },
          { icon: Check, text: 'Autosave draft di perangkatmu sendiri.' },
        ].map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-ink-600">
            <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-success-600" aria-hidden />
            {f.text}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold text-ink-900">Data Kamu Tetap di Perangkatmu</h2>
      <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
          <div className="space-y-2 text-sm leading-relaxed text-ink-600">
            <p>
              CVMudah bekerja sepenuhnya di browser. Data yang kamu masukkan diproses di perangkatmu dan disimpan di
              penyimpanan lokal browser (localStorage) agar draft tidak hilang saat halaman dimuat ulang.
            </p>
            <p>
              Kami tidak mengirim data CV atau surat lamaran ke server mana pun. Foto profil juga tidak pernah
              diunggah - hanya disimpan sementara di perangkatmu.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-ink-900">Tanpa Backend, Tanpa Biaya</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <ServerCrash className="h-5 w-5 text-ink-400" aria-hidden />
          <h3 className="mt-2 font-bold text-ink-900">Tanpa server</h3>
          <p className="mt-1 text-sm text-ink-500">Seluruh fitur inti berjalan lokal. Tidak ada server yang menyimpan datamu.</p>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
          <Wallet className="h-5 w-5 text-ink-400" aria-hidden />
          <h3 className="mt-2 font-bold text-ink-900">Tanpa biaya tersembunyi</h3>
          <p className="mt-1 text-sm text-ink-500">Tidak ada langganan, paywall, atau fitur inti yang terkunci.</p>
        </div>
      </div>

      <p className="mt-10 leading-relaxed text-ink-600">
        CVMudah adalah proyek independen. Jika ada saran, koreksi, atau laporan masalah, silakan hubungi kami
        melalui halaman <Link to="/kontak" className="font-medium text-brand-700 hover:underline">Kontak</Link>.
      </p>
    </div>
  );
}
