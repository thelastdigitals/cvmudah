import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FileCheck2, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Beranda' },
  { to: '/buat-cv', label: 'Buat CV' },
  { to: '/template-cv', label: 'Template CV' },
  { to: '/surat-lamaran', label: 'Surat Lamaran' },
  { to: '/panduan', label: 'Panduan' },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="CVMudah - kembali ke beranda">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
        <FileCheck2 className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-ink-900">
        CV<span className="text-brand-600">Mudah</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
    }`;

  return (
    <header className="app-header sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkCls}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link
            to="/buat-cv"
            className="inline-flex items-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Buat CV Gratis
          </Link>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-ink-700 transition hover:bg-ink-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Navigasi seluler" className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-app flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkCls}>
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/buat-cv"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Buat CV Gratis
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
