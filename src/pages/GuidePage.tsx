import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applySeo } from '@/lib/seo';
import { AdSlot } from '@/components/ui/AdSlot';

export default function GuidePage() {
  useEffect(() => {
    applySeo({
      path: '/panduan',
      title: 'Panduan Membuat CV dan Surat Lamaran | CVMudah',
      description:
        'Panduan lengkap membuat CV yang baik, menulis profil profesional, mencapai pencapaian terukur, dan memilih template ATS-friendly.',
    });
  }, []);

  return (
    <article className="container-app max-w-3xl py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">Beranda</Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Panduan</span>
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">Panduan Membuat CV &amp; Surat Lamaran</h1>
      <p className="mt-3 leading-relaxed text-ink-600">
        Kumpulan panduan praktis untuk menyusun CV dan surat lamaran kerja yang meyakinkan, ditulis khusus untuk
        pencari kerja di Indonesia.
      </p>

      <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_GUIDE as string | undefined} />

      <div className="prose-like mt-8 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-ink-900">Cara Membuat CV yang Baik</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            CV yang baik ringkas, relevan, dan mudah dibaca. Batasi panjangnya maksimal dua halaman, gunakan satu jenis
            font profesional, dan pastikan informasi terpenting muncul di sepertiga bagian atas dokumen. Susun bagian
            dengan urutan logis: informasi kontak, profil singkat, pengalaman atau pendidikan, keahlian, lalu
            informasi pendukung.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-600">
            <li>Sesuaikan isi CV dengan posisi yang dilamar - jangan memakai satu CV untuk semua lamaran.</li>
            <li>Gunakan bahasa aktif dan singkat, hindari paragraf panjang.</li>
            <li>Periksa ejaan dan format sebelum mengirim. CV yang asal membuat kesan kurang teliti.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Cara Membuat CV Fresh Graduate</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Tanpa pengalaman kerja penuh waktu, fokuskan CV pada pendidikan, magang, organisasi, proyek, dan
            keahlian. Tempatkan bagian pendidikan di atas, lalu tampilkan pengalaman magang dan kegiatan organisasi
            dengan deskripsi tugas serta hasil nyata yang kamu capai. Template Fresh Graduate di CVMudah disusun
            khusus untuk kebutuhan ini.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Cara Menulis Profil Profesional</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Profil profesional adalah ringkasan 2-3 kalimat di bagian atas CV. Sebutkan latar belakang utamamu,
            keahlian inti, dan apa yang ingin kamu kontribusikan. Hindari kalimat klise seperti "pekerja keras dan
            mampu bekerja dalam tim" tanpa bukti. Bandingkan:
          </p>
          <blockquote className="mt-3 rounded-xl border-l-4 border-brand-500 bg-brand-50 px-5 py-3 text-ink-700">
            <p className="font-medium">Kurang baik:</p>
            <p className="mt-1">Saya pekerja keras, disiplin, dan mampu bekerja dalam tim maupun individu.</p>
            <p className="mt-3 font-medium">Lebih baik:</p>
            <p className="mt-1">
              Lulusan Administrasi Bisnis dengan pengalaman magang 6 bulan di bidang pengelolaan data. Terbiasa
              menggunakan Excel untuk membuat laporan bulanan dan mengelola arsip digital.
            </p>
          </blockquote>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Cara Menulis Pengalaman Kerja</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Untuk setiap pengalaman, tuliskan jabatan, nama perusahaan, periode, dan deskripsi tugas. Gunakan poin
            ringkas yang diawali kata kerja aktif seperti "mengelola", "menyusun", atau "mengembangkan". Fokus pada
            tanggung jawab yang paling relevan dengan posisi yang dilamar, bukan semua tugas yang pernah dilakukan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Menuliskan Pencapaian dengan Angka</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Pencapaian terukur jauh lebih meyakinkan daripada daftar tugas. Gunakan angka bila memungkinkan: jumlah,
            persentase, atau waktu. Contohnya "mengelola arsip 500+ dokumen", "memangkas waktu pembuatan laporan dari
            3 hari menjadi 1 hari", atau "melayani rata-rata 40 pelanggan per hari". Jika tidak punya angka pasti,
            gunakan perkiraan yang jujur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Memilih Template CV yang ATS-friendly</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Sistem pelacakan pelamar (ATS) membaca CV sebagai teks. Template yang ATS-friendly umumnya satu kolom,
            tanpa tabel kompleks, tanpa grafik keahlian berbentuk batang, dan menggunakan judul bagian standar seperti
            "Pengalaman Kerja". Di CVMudah, template ATS Classic dan Minimalist dirancang dengan struktur sederhana
            ini.
          </p>
          <p className="mt-3 leading-relaxed text-ink-600">
            Perlu diingat: tidak ada template yang menjamin lolos semua sistem ATS. Setiap perusahaan menggunakan
            sistem rekrutmen berbeda dengan cara pemindaian yang berbeda pula. Gunakan template sederhana sebagai
            langkah aman, lalu pastikan kata kunci posisi yang kamu lamar memang muncul di isi CV.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Kesalahan Umum saat Membuat CV</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-600">
            <li>Menuliskan data sensitif yang tidak diperlukan, seperti NIK, nomor rekening, atau agama.</li>
            <li>Menggunakan alamat email yang tidak profesional.</li>
            <li>CV terlalu panjang padahal pengalaman masih sedikit.</li>
            <li>Daftar tugas tanpa hasil atau pencapaian.</li>
            <li>Typo dan format yang berantakan.</li>
            <li>Menyertakan foto berkualitas buruk (jika memang diperlukan oleh industri yang dituju).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Cara Membuat Surat Lamaran Kerja</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Surat lamaran yang baik terdiri dari: tempat dan tanggal, alamat tujuan, perihal, paragraf pembuka yang
            menyebut posisi yang dilamar, satu-dua paragraf isi yang menyoroti kualifikasi relevan, paragraf penutup
            yang meminta kesempatan seleksi, dan salam penutup. Panjang idealnya tidak lebih dari satu halaman.
            Kamu bisa menyusunnya otomatis dengan generator surat lamaran CVMudah, lalu mengedit hasilnya sesuai
            gaya bahasamu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Cara Membuat CV Tanpa Pengalaman Kerja</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            Pengalaman tidak selalu berarti pekerjaan formal. Kegiatan organisasi kampus, proyek kuliah, kerja
            sukarela, freelancing kecil, dan tugas kelompok yang relevan semuanya bisa dituliskan. Untuk setiap
            kegiatan, jelaskan peranmu dan hasil nyata yang dihasilkan. Kejujuran penting: jangan mengarang
            pengalaman yang tidak pernah kamu lakukan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Tips Menyesuaikan CV dengan Lowongan</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-600">
            <li>Baca lowongan dengan teliti dan catat kata kunci keahlian yang diminta.</li>
            <li>Ubah profil profesional agar selaras dengan posisi yang dilamar.</li>
            <li>Naikkan urutan pengalaman yang paling relevan ke bagian atas.</li>
            <li>Hilangkan informasi yang tidak relevan agar CV tetap ringkas.</li>
            <li>Gunakan istilah yang sama dengan lowongan bila memang sesuai kemampuanmu.</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 rounded-2xl bg-brand-50 p-8 text-center">
        <h2 className="text-xl font-bold text-ink-900">Siap mempraktikkan?</h2>
        <p className="mt-2 text-ink-600">Buat CV-mu sekarang dengan panduan di atas sebagai rujukan.</p>
        <Link
          to="/buat-cv"
          className="mt-5 inline-flex items-center rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Buat CV Gratis
        </Link>
      </div>
    </article>
  );
}
