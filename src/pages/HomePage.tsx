import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, ChevronDown, Download, Eye, FileText, Layers, Lock, Mail, PenLine, Sparkles, UserX,
} from 'lucide-react';
import { TEMPLATE_CATALOG } from '@/types/cv';
import { TemplateThumb } from '@/components/cv/TemplateGallery';
import { AdSlot } from '@/components/ui/AdSlot';
import { applySeo } from '@/lib/seo';
import { useEffect } from 'react';

const BENEFITS = [
  { icon: Check, title: 'Gratis untuk fitur utama', desc: 'Buat CV dan surat lamaran tanpa biaya, tanpa fitur penting yang terkunci.' },
  { icon: UserX, title: 'Tanpa registrasi', desc: 'Tidak perlu membuat akun atau mengisi data login. Langsung mulai menulis.' },
  { icon: Eye, title: 'Preview langsung', desc: 'Lihat hasil CV seketika saat kamu mengetik, persis seperti hasil cetaknya.' },
  { icon: Layers, title: 'Template profesional', desc: 'Enam desain CV untuk berbagai profesi dan jenjang karier.' },
  { icon: Download, title: 'Unduh sebagai PDF', desc: 'Ekspor lewat dialog cetak browser menjadi PDF yang rapi dan siap dikirim.' },
  { icon: Lock, title: 'Data di perangkatmu', desc: 'Semua data tersimpan di browser kamu sendiri, bukan di server kami.' },
];

const STEPS = [
  { title: 'Isi informasi diri', desc: 'Lengkapi data pribadi, pendidikan, pengalaman, dan keahlian lewat formulir sederhana.' },
  { title: 'Pilih desain CV', desc: 'Coba enam template profesional dan lihat perubahannya seketika pada preview.' },
  { title: 'Periksa hasil preview', desc: 'Pastikan semua informasi tampil rapi pada dokumen berukuran A4.' },
  { title: 'Unduh atau cetak', desc: 'Simpan sebagai PDF atau cetak langsung dari browser.' },
];

const AUDIENCES = [
  { title: 'Fresh Graduate', desc: 'Belum punya pengalaman kerja? Template Fresh Graduate menonjolkan pendidikan, organisasi, dan proyekmu.' },
  { title: 'Mahasiswa & Pelajar', desc: 'Susun CV untuk magang atau beasiswa dengan struktur yang benar dan bahasa profesional.' },
  { title: 'Pekerja Berpengalaman', desc: 'Tampilkan pengalaman dan pencapaian terukur dengan template Executive yang formal dan elegan.' },
  { title: 'Pencari Kerja', desc: 'Siapkan CV dan surat lamaran yang konsisten untuk melamar berbagai posisi dengan cepat.' },
];

const FAQS = [
  { q: 'Apakah CVMudah gratis?', a: 'Ya. Seluruh fitur inti - membuat CV, memilih template, membuat surat lamaran, mengunduh, dan mencetak - dapat digunakan gratis tanpa langganan.' },
  { q: 'Apakah harus membuat akun?', a: 'Tidak. CVMudah tidak memerlukan registrasi atau login. Buka website, isi formulir, dan langsung unduh hasilnya.' },
  { q: 'Bagaimana cara mengunduh CV?', a: 'Klik tombol "Unduh / Cetak CV" pada halaman editor, lalu pilih opsi "Save as PDF" (atau "Simpan sebagai PDF") di dialog cetak browser. Kamu juga bisa memilih printer untuk mencetak langsung.' },
  { q: 'Apakah data pribadi dikirim ke server?', a: 'Tidak. Data CV dan surat lamaran diproses serta disimpan di browser perangkatmu sendiri (localStorage). Kami tidak mengirim datamu ke server.' },
  { q: 'Apakah CV dapat digunakan untuk melamar pekerjaan?', a: 'Tentu. Hasil CV berformat A4 profesional dan siap dilampirkan ke lamaran kerja atau dikirim melalui email.' },
  { q: 'Apakah saya bisa membuat CV tanpa pengalaman kerja?', a: 'Bisa. Gunakan template Fresh Graduate yang menonjolkan pendidikan, organisasi, magang, proyek, dan keahlian. Isi bagian pengalaman kerja dengan magang atau kegiatan organisasi bila relevan.' },
  { q: 'Apakah CVMudah bisa digunakan di HP?', a: 'Ya. CVMudah dirancang responsif untuk HP, tablet, dan desktop. Pada HP, gunakan tombol "Lihat Preview" untuk berpindah antara formulir dan preview.' },
  { q: 'Apakah hasil CV dapat diedit lagi?', a: 'Ya. Draft CV tersimpan otomatis di perangkatmu, sehingga kamu bisa membuka kembali dan melanjutkan mengedit kapan saja.' },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-50"
        >
          {q}
          <ChevronDown className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </h3>
      {open && <div className="px-5 pb-4 text-sm leading-relaxed text-ink-600">{a}</div>}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    applySeo({
      path: '/',
      title: 'CVMudah — Buat CV dan Surat Lamaran Kerja Gratis',
      description:
        'Buat CV profesional dan surat lamaran kerja gratis dengan template modern. Edit langsung, lihat preview, lalu unduh atau cetak dokumenmu.',
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/60 to-ink-50">
        <div className="container-app grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> 100% gratis, tanpa registrasi
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-[42px]">
              Buat CV Profesional Gratis dalam Beberapa Menit
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Buat CV dan surat lamaran kerja dengan template profesional. Isi data, lihat hasilnya secara langsung,
              lalu unduh dokumenmu.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/buat-cv"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                <PenLine className="h-5 w-5" aria-hidden /> Buat CV Gratis
              </Link>
              <Link
                to="/template-cv"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-6 py-3.5 text-base font-semibold text-ink-800 transition-colors hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <Layers className="h-5 w-5" aria-hidden /> Lihat Template
              </Link>
            </div>
          </div>
          {/* HTML/CSS CV mockup */}
          <div className="mx-auto w-full max-w-sm" aria-hidden>
            <div className="rotate-1 rounded-2xl bg-white p-1.5 shadow-doc transition-transform duration-300 hover:rotate-0">
              <div className="overflow-hidden rounded-xl border border-ink-100">
                <div className="bg-brand-600 px-6 py-7 text-white">
                  <div className="h-3.5 w-36 rounded bg-white/90" />
                  <div className="mt-2 h-2.5 w-24 rounded bg-white/50" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-2 w-20 rounded bg-white/40" />
                    <div className="h-2 w-16 rounded bg-white/40" />
                  </div>
                </div>
                <div className="space-y-4 px-6 py-6">
                  <div>
                    <div className="h-2.5 w-20 rounded bg-brand-200" />
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2 w-full rounded bg-ink-100" />
                      <div className="h-2 w-5/6 rounded bg-ink-100" />
                    </div>
                  </div>
                  <div>
                    <div className="h-2.5 w-24 rounded bg-brand-200" />
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2 w-full rounded bg-ink-100" />
                      <div className="h-2 w-2/3 rounded bg-ink-100" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-6 w-16 rounded-full border border-ink-200" />
                    <div className="h-6 w-20 rounded-full border border-ink-200" />
                    <div className="h-6 w-14 rounded-full border border-ink-200" />
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-6 ml-auto w-56 -rotate-2 rounded-xl border border-ink-100 bg-white p-3 shadow-lift transition-transform duration-300 hover:rotate-0">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-50">
                  <Check className="h-4 w-4 text-success-600" aria-hidden />
                </span>
                <div>
                  <div className="h-2 w-24 rounded bg-ink-200" />
                  <div className="mt-1 h-2 w-16 rounded bg-ink-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-app py-14" aria-labelledby="benefits-title">
        <h2 id="benefits-title" className="section-title text-center">Keunggulan CVMudah</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-ink-500">
          Semua yang kamu butuhkan untuk membuat dokumen lamaran yang meyakinkan.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition-shadow hover:shadow-lift">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <b.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-bold text-ink-900">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14" aria-labelledby="how-title">
        <div className="container-app">
          <h2 id="how-title" className="section-title text-center">Cara Kerjanya</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border border-ink-200 bg-ink-50 p-6">
                <span className="absolute -top-3.5 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-2 font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Templates */}
      <section className="container-app py-14" aria-labelledby="tpl-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="tpl-title" className="section-title">Pilihan Template</h2>
            <p className="mt-2 text-ink-500">Enam desain profesional untuk berbagai kebutuhan karier.</p>
          </div>
          <Link to="/template-cv" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Lihat semua template →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_CATALOG.map((t) => (
            <Link
              key={t.id}
              to="/template-cv"
              className="group overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card transition-shadow hover:shadow-lift"
            >
              <TemplateThumb templateId={t.id} />
              <div className="p-5">
                <h3 className="font-bold text-ink-900 group-hover:text-brand-700">{t.name}</h3>
                <p className="mt-1 text-xs text-ink-500">{t.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="container-app">
        <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_HOME as string | undefined} />
      </div>

      {/* Cover letter feature */}
      <section className="bg-ink-900 py-14 text-white" aria-labelledby="letter-title">
        <div className="container-app grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="letter-title" className="mt-4 text-2xl font-bold sm:text-3xl">Surat Lamaran yang Sempurna</h2>
            <p className="mt-3 leading-relaxed text-ink-300">
              Lengkapi CV-mu dengan surat lamaran profesional. Pilih format formal, fresh graduate, magang, atau versi
              email. Hasilnya bisa kamu edit bebas sebelum dikirim.
            </p>
            <ul className="mt-5 space-y-2.5">
              {['Lima format surat sesuai situasi', 'Preview langsung saat mengisi formulir', 'Salin teks, unduh PDF, atau cetak', 'Draft tersimpan otomatis di perangkatmu'].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/surat-lamaran"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FileText className="h-5 w-5" aria-hidden /> Buat Surat Lamaran
            </Link>
          </div>
          <div className="rounded-2xl bg-white p-6 text-ink-800 shadow-doc" aria-hidden>
            <div className="rounded-xl bg-ink-50 p-5 text-sm leading-relaxed">
              <p className="font-semibold">Jakarta, 1 Januari 2026</p>
              <p className="mt-1">Yth. Human Capital Department</p>
              <p className="mt-4 font-bold">Perihal: Permohonan Lamaran Posisi Staf Administrasi</p>
              <div className="mt-4 space-y-2">
                <div className="h-2 w-full rounded bg-ink-200" />
                <div className="h-2 w-11/12 rounded bg-ink-200" />
                <div className="h-2 w-full rounded bg-ink-200" />
                <div className="h-2 w-4/5 rounded bg-ink-200" />
              </div>
              <p className="mt-4 font-semibold">Hormat saya,</p>
              <div className="mt-1 h-2 w-24 rounded bg-ink-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="container-app py-14" aria-labelledby="who-title">
        <h2 id="who-title" className="section-title text-center">Untuk Siapa CVMudah?</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h3 className="font-bold text-ink-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14" aria-labelledby="faq-title">
        <div className="container-app max-w-3xl">
          <h2 id="faq-title" className="section-title text-center">Pertanyaan yang Sering Diajukan</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-app py-16">
        <div className="rounded-3xl bg-brand-600 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Siap Membuat CV Profesional?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Mulai sekarang, tanpa akun, tanpa biaya. CV-mu bisa jadi tiket ke pekerjaan impianmu.
          </p>
          <Link
            to="/buat-cv"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-sm transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PenLine className="h-5 w-5" aria-hidden /> Buat CV Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
