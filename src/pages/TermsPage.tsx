import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applySeo, SITE_CONFIG } from '@/lib/seo';

export default function TermsPage() {
  useEffect(() => {
    applySeo({
      path: '/ketentuan-layanan',
      title: 'Ketentuan Layanan | CVMudah',
      description: 'Ketentuan penggunaan layanan CVMudah.',
    });
  }, []);

  return (
    <article className="container-app max-w-3xl py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">Beranda</Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Ketentuan Layanan</span>
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">Ketentuan Layanan</h1>
      <p className="mt-2 text-sm text-ink-500">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-ink-600">
        <section>
          <h2 className="text-xl font-bold text-ink-900">Tentang Layanan</h2>
          <p className="mt-2">
            CVMudah adalah alat bantu penyusunan dokumen (CV dan surat lamaran kerja) yang berjalan di browser. Dengan
            menggunakan CVMudah, kamu dianggap menyetujui ketentuan yang dijelaskan pada halaman ini.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Tanggung Jawab atas Kebenaran Data</h2>
          <p className="mt-2">
            Kamu bertanggung jawab penuh atas kebenaran dan keakuratan data yang kamu masukkan. CVMudah hanya
            membantu menyusun dokumen dari informasi yang kamu berikan. Jangan memasukkan data palsu, mengarang
            pengalaman yang tidak pernah kamu lakukan, atau menggunakan identitas orang lain.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Tidak Ada Jaminan Hasil</h2>
          <p className="mt-2">
            CVMudah adalah alat bantu penyusunan dokumen. Kami tidak memberikan jaminan bahwa CV atau surat lamaran
            yang dibuat melalui CVMudah akan diterima perusahaan mana pun, maupun jaminan mendapatkan pekerjaan.
            Keputusan rekrutmen sepenuhnya wewenang perusahaan tempat kamu melamar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Periksa Dokumen Sebelum Dikirim</h2>
          <p className="mt-2">
            Kamu bertanggung jawab untuk memeriksa kembali dokumen yang dihasilkan - termasuk ejaan, format, dan
            kelengkapan informasi - sebelum mengirimkannya ke pihak mana pun.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Penggunaan yang Wajar</h2>
          <p className="mt-2">
            Gunakan CVMudah untuk keperluan yang sah. Kamu tidak diperbolehkan menggunakan layanan ini untuk
            membuat dokumen yang menyesatkan, menyalahgunakan identitas pihak lain, atau tujuan ilegal apa pun.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Batasan Tanggung Jawab</h2>
          <p className="mt-2">
            CVMudah disediakan "sebagaimana adanya" tanpa jaminan tersurat maupun tersirat. Sepanjang diizinkan oleh
            hukum yang berlaku, pengelola CVMudah tidak bertanggung jawab atas kerugian langsung maupun tidak langsung
            yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan ini, termasuk namun tidak terbatas
            pada hilangnya data di perangkatmu. Kamu bertanggung jawab membuat salinan dokumen penting milikmu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Perubahan Ketentuan</h2>
          <p className="mt-2">
            Ketentuan ini dapat diperbarui seiring berkembangnya layanan. Perubahan akan dipublikasikan pada halaman
            ini.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Kontak</h2>
          <p className="mt-2">
            Pertanyaan tentang ketentuan ini dapat disampaikan melalui halaman{' '}
            <Link to="/kontak" className="font-medium text-brand-700 hover:underline">Kontak</Link>
            {SITE_CONFIG.contactEmail ? ` atau email ${SITE_CONFIG.contactEmail}` : ''}.
          </p>
        </section>
      </div>
    </article>
  );
}
