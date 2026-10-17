# CVMudah

Website gratis pembuat **CV** dan **surat lamaran kerja** profesional untuk pengguna Indonesia. Tanpa registrasi, tanpa backend, tanpa API berbayar - seluruh fitur inti berjalan di browser dan data tersimpan lokal di perangkat pengguna.

**Tagline:** "Buat CV Profesional, Lamar Kerja Lebih Percaya Diri."

## Fitur

- Editor CV lengkap: informasi pribadi, pendidikan, pengalaman kerja, magang & organisasi, keahlian, sertifikat, bahasa, proyek, dan informasi tambahan.
- Enam template CV yang benar-benar berbeda: ATS Classic, Modern Professional, Minimalist, Fresh Graduate, Executive, Creative.
- Preview langsung berukuran A4 yang sama persis dengan hasil cetak.
- Autosave ke localStorage dengan indikator status, pemulihan draft, dan penghapusan data dengan konfirmasi.
- Generator surat lamaran dengan lima format (formal, fresh graduate, berpengalaman, magang, email) yang hasilnya bisa diedit bebas.
- Ekspor PDF dan cetak melalui dialog cetak browser (teks tetap bisa dipilih).
- Galeri template, panduan membuat CV, contoh CV, halaman privasi & ketentuan, SEO per halaman, dan komponen AdSense nonaktif secara default.

## Menjalankan Proyek

### Persyaratan dasar

- Node.js 18 atau lebih baru dan npm.

### Perintah utama

```bash
npm install        # pasang dependency
npm run dev        # jalankan server pengembangan
npm run build      # build produksi (hasil di folder dist/)
npm run preview    # pratinjau hasil build secara lokal
npm run test       # jalankan pengujian (Vitest)
npm run typecheck  # periksa tipe TypeScript
```

### Membuka proyek di Bolt.new

Buka [bolt.new](https://bolt.new), impor repositori ini (atau lanjutkan dari proyek Bolt yang sudah ada), lalu terminal Bolt otomatis menjalankan `npm run dev`.

## Memperbaiki Error Umum

- **Build gagal karena tipe**: jalankan `npm run typecheck` untuk melihat daftar error.
- **Halaman kosong setelah deploy**: pastikan hosting mendukung SPA routing (lihat bagian deployment).
- **Draft hilang**: draft tersimpan di localStorage per browser/perangkat. Membersihkan data browser menghapus draft.
- **Foto tidak bisa diunggah**: gunakan JPEG/PNG/WebP maksimal 2 MB.

## Deployment Gratis

Aplikasi ini adalah SPA statis - semua route harus diarahkan ke `index.html` (fallback routing).

**Netlify**: build `npm run build`, folder publikasi `dist/`. SPA fallback otomatis. Buat file `public/_redirects` berisi `/* /index.html 200` bila diperlukan.

**Vercel**: impor repositori, framework Vite terdeteksi otomatis. SPA rewrite otomatis.

**GitHub Pages**: gunakan action atau `gh-pages` untuk mempublikasikan folder `dist/`. Tambahkan file `404.html` yang menyalin `index.html` sebagai fallback routing. Perhatikan bahwa base URL perlu disesuaikan (`base: '/nama-repo/'` di `vite.config.ts`).

Kuota dan ketentuan paket gratis dapat berubah sewaktu-waktu - periksa dokumentasi penyedia hosting.

## Konfigurasi

Semua konfigurasi opsional lewat environment variables (buat file `.env` atau atur di panel hosting):

| Variabel | Kegunaan |
| --- | --- |
| `VITE_SITE_URL` | Domain produksi, misal `https://cvmudah.example.com`. Dipakai untuk canonical URL dan Open Graph. |
| `VITE_CONTACT_EMAIL` | Email kontak resmi yang tampil di halaman Kontak. |
| `VITE_ADSENSE_CLIENT_ID` | ID penerbit AdSense (`ca-pub-...`). Kosong = iklan tidak tampil. |
| `VITE_ADSENSE_SLOT_HOME` / `_GUIDE` / `_TEMPLATES` / `_EXAMPLES` | Slot ID iklan per halaman. |

### Mengatur domain dan SITE_URL

Setelah domain siap, set `VITE_SITE_URL` lalu build ulang. Sitemap (`public/sitemap.xml`) dan robots.txt perlu disunting manual: ganti `https://example.com` dengan domain produksimu.

### Mengaktifkan AdSense

1. Daftar dan disetujui di Google AdSense (website harus sudah memenuhi persyaratan Google).
2. Set `VITE_ADSENSE_CLIENT_ID` dan slot ID yang relevan.
3. Tambahkan script AdSense resmi di `index.html` (jangan gunakan ID contoh).
4. Periksa kebijakan consent/privasi untuk wilayah pengunamu - satu banner buatan sendiri tidak otomatis memenuhi semua persyaratan Google.

Selama konfigurasi belum ada, komponen `AdSlot` tidak merender apa pun dan tidak menulis error ke console.

### Menambahkan favicon

Favicon ada di `public/favicon.svg`. Ganti file tersebut dengan logomu, biarkan nama filenya sama.

## Memeriksa Sebelum Publikasi

- [ ] Halaman `/kontak` menampilkan email resmi (set `VITE_CONTACT_EMAIL`).
- [ ] Halaman `/kebijakan-privasi` dan `/ketentuan-layanan` sesuai implementasi sebenarnya.
- [ ] `public/sitemap.xml` dan `public/robots.txt` memakai domain produksi.
- [ ] `VITE_SITE_URL` sudah diset agar canonical URL benar.

## Menguji PDF

1. Buka `/buat-cv`, isi data, klik **Unduh / Cetak CV**.
2. Di dialog cetak, pilih **Save as PDF** (desktop) atau **Simpan sebagai PDF** (Android Chrome via menu Berbagi > Cetak).
3. Buka hasil PDF: teks harus bisa dipilih, dan dokumen beberapa halaman tidak boleh terpotong di tengah bagian.
4. Ulangi pada browser berbeda (Chrome, Firefox, Safari) karena tampilan dialog cetak bisa berbeda.

## Struktur Proyek

```
src/
  components/
    layout/      Header, Footer
    ui/          Button, Input, Modal, Toast, AdSlot, Spinner
    cv/          CVEditor, CVSections, CVDocument (6 template), TemplateGallery, A4Scaler, sections
  pages/         Semua halaman publik (home, builder, templates, cover letter, guide, ...)
  lib/           storage, validation, sanitize, exportPdf, print, coverLetterGenerator, seo, cvData
  types/         Model data CV & surat lamaran
  tests/         Pengujian Vitest (validasi, penyimpanan, generator, util inti)
public/          favicon, robots.txt, sitemap.xml
```
