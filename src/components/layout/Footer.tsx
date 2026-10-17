import { Link } from 'react-router-dom';
import { FileCheck2 } from 'lucide-react';

const GROUPS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Fitur',
    links: [
      { to: '/buat-cv', label: 'Buat CV' },
      { to: '/template-cv', label: 'Template CV' },
      { to: '/surat-lamaran', label: 'Surat Lamaran' },
      { to: '/contoh-cv', label: 'Contoh CV' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { to: '/panduan', label: 'Panduan Membuat CV' },
      { to: '/kontak', label: 'Kontak' },
      { to: '/tentang', label: 'Tentang CVMudah' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
      { to: '/ketentuan-layanan', label: 'Ketentuan Layanan' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="app-footer border-t border-ink-200 bg-white">
      <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <FileCheck2 className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-ink-900">
              CV<span className="text-brand-600">Mudah</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">
            Buat CV profesional dan surat lamaran kerja gratis, langsung dari browser. Data tersimpan di perangkatmu.
          </p>
        </div>
        {GROUPS.map((g) => (
          <nav key={g.title} aria-label={`Tautan ${g.title}`}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">{g.title}</h2>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ink-500 transition-colors hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink-100">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="text-xs text-ink-500">&copy; {new Date().getFullYear()} CVMudah. Dibuat untuk pencari kerja Indonesia.</p>
          <p className="text-xs text-ink-400">Tanpa registrasi. Tanpa biaya.</p>
        </div>
      </div>
    </footer>
  );
}
