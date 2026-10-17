import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applySeo, SITE_CONFIG } from '@/lib/seo';

export default function PrivacyPage() {
  useEffect(() => {
    applySeo({
      path: '/kebijakan-privasi',
      title: 'Kebijakan Privasi | CVMudah',
      description: 'Bagaimana CVMudah memproses dan menyimpan datamu: semuanya di perangkatmu sendiri.',
    });
  }, []);

  return (
    <article className="container-app max-w-3xl py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <Link to="/" className="hover:text-brand-700">Beranda</Link>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Kebijakan Privasi</span>
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">Kebijakan Privasi</h1>
      <p className="mt-2 text-sm text-ink-500">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-ink-600">
        <section>
          <h2 className="text-xl font-bold text-ink-900">Data yang Kamu Masukkan</h2>
          <p className="mt-2">
            Saat menggunakan CVMudah, kamu dapat memasukkan data pribadi seperti nama, email, nomor telepon, riwayat
            pendidikan, pengalaman kerja, keahlian, dan data pendukung lainnya untuk keperluan CV dan surat lamaran.
            Semua data ini masuk dan diproses langsung di browser perangkatmu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Pemrosesan di Browser</h2>
          <p className="mt-2">
            Fitur inti CVMudah berjalan sepenuhnya di browser (sisi klien). Kami tidak memiliki server yang menerima,
            menyimpan, atau memproses data CV dan surat lamaran kamu. Semua penyusunan dokumen terjadi secara lokal
            di perangkatmu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Penyimpanan Lokal (localStorage)</h2>
          <p className="mt-2">
            Draft CV dan draft surat lamaran disimpan otomatis di penyimpanan lokal browser (localStorage) agar tidak
            hilang saat halaman dimuat ulang. Data ini tetap berada di perangkatmu dan tidak pernah dikirim ke
            pihak mana pun, kecuali kamu sendiri yang memilih membagikannya (misalnya mengirim file PDF hasil
            unduhan ke perusahaan).
          </p>
          <p className="mt-2">
            Perlu diketahui: localStorage bukan tempat penyimpanan terenkripsi. Siapa pun yang memiliki akses ke
            perangkat dan browsermu dapat melihat isinya. Kami menyarankan penggunaan perangkat pribadi dan tidak
            menyimpan informasi yang tidak diperlukan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Foto Profil</h2>
          <p className="mt-2">
            Foto profil yang kamu unggah diproses sepenuhnya di perangkatmu (diperkecil ukurannya agar hemat
            penyimpanan) dan tidak pernah diunggah ke server oleh fitur inti aplikasi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Data yang Tidak Kami Minta</h2>
          <p className="mt-2">
            CVMudah tidak pernah meminta kata sandi, NIK, nomor rekening, atau informasi finansial apa pun. Jangan
            memasukkan data sensitif semacam itu ke dalam CV atau surat lamaran.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Menghapus Data Lokal</h2>
          <p className="mt-2">
            Kamu dapat menghapus seluruh data CV kapan saja melalui tombol "Hapus Semua Data" di halaman editor CV,
            dan draft surat lamaran melalui tombol "Hapus Draft" di halaman surat lamaran. Membersihkan data browser
            (clear browsing data) juga akan menghapus draft yang tersimpan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Layanan Pihak Ketiga</h2>
          <p className="mt-2">
            Saat ini CVMudah tidak memasang analitik atau pelacakan apa pun. Jika di kemudian hari website ini
            menggunakan layanan pihak ketiga - misalnya Google AdSense untuk iklan - kebijakan ini akan diperbarui.
            Sebagai gambaran: vendor iklan seperti Google dapat menggunakan cookie atau teknologi terkait untuk
            menayangkan iklan, sesuai pengaturan dan kebijakan yang berlaku. Pembaruan kebijakan akan dilakukan
            ketika fitur baru ditambahkan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink-900">Menghubungi Pengelola</h2>
          <p className="mt-2">
            Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami melalui halaman{' '}
            <Link to="/kontak" className="font-medium text-brand-700 hover:underline">Kontak</Link>
            {SITE_CONFIG.contactEmail ? ` atau langsung ke email ${SITE_CONFIG.contactEmail}` : ''}.
          </p>
        </section>
      </div>
    </article>
  );
}
