import { useMemo, type CSSProperties } from 'react';
import type { CVData, TemplateId } from '@/types/cv';
import { buildSections } from './sections';
import { commaJoin } from './sections';
import { isSafeHttpUrl } from '@/lib/sanitize';
/*
 * All six templates render inside a fixed A4-proportioned page (210mm x 297mm).
 * Layouts differ genuinely: single column, sidebar, serif executive, accent bars, etc.
 */

const A4_STYLE: CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
};

function ContactLine({ cv, className = '' }: { cv: CVData; className?: string }) {
  const items: string[] = [];
  if (cv.personal.email) items.push(cv.personal.email);
  if (cv.personal.phone) items.push(cv.personal.phone);
  const loc = commaJoin([cv.personal.city, cv.personal.province]);
  if (loc) items.push(loc);
  if (!items.length) return null;
  return <p className={className}>{items.join('  •  ')}</p>;
}

function LinksLine({ cv, className = '' }: { cv: CVData; className?: string }) {
  const links = [
    { label: 'LinkedIn', url: cv.personal.linkedin },
    { label: 'Portofolio', url: cv.personal.portfolio },
  ].filter((l) => l.url && isSafeHttpUrl(l.url));
  if (!links.length) return null;
  return (
    <p className={className}>
      {links.map((l, i) => (
        <span key={l.label}>
          {i > 0 && '  •  '}
          {l.url}
        </span>
      ))}
    </p>
  );
}

function Photo({ cv, className = '' }: { cv: CVData; className?: string }) {
  if (!cv.personal.photo) return null;
  return (
    <img
      src={cv.personal.photo}
      alt={`Foto ${cv.personal.fullName || 'profil'}`}
      className={className}
    />
  );
}

/* ---------------- Template 1: ATS Classic ---------------- */
function ATSClassic({ cv }: { cv: CVData }) {
  const sections = buildSections(cv);
  return (
    <div style={A4_STYLE} className="cv-page bg-white px-14 py-12 font-sans text-[12.5px] leading-relaxed text-ink-800">
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink-900">
          {cv.personal.fullName || 'Nama Lengkap'}
        </h1>
        {cv.personal.headline && <p className="mt-1 text-sm text-ink-600">{cv.personal.headline}</p>}
        <ContactLine cv={cv} className="mt-2 text-xs text-ink-600" />
        <LinksLine cv={cv} className="text-xs text-ink-600" />
      </header>
      {cv.personal.summary && (
        <section className="mb-5">
          <h2 className="mb-1.5 border-b border-ink-300 pb-1 text-sm font-bold uppercase tracking-wide text-ink-900">
            Profil
          </h2>
          <p className="whitespace-pre-line">{cv.personal.summary}</p>
        </section>
      )}
      {sections.map((s) => (
        <section key={s.id} className="cv-section mb-5 break-inside-avoid">
          <h2 className="mb-1.5 border-b border-ink-300 pb-1 text-sm font-bold uppercase tracking-wide text-ink-900">
            {s.label}
          </h2>
          {s.node}
        </section>
      ))}
    </div>
  );
}

/* ---------------- Template 2: Modern Professional ---------------- */
function ModernProfessional({ cv }: { cv: CVData }) {
  const sections = buildSections(cv);
  return (
    <div style={A4_STYLE} className="cv-page bg-white font-sans text-[12.5px] leading-relaxed text-ink-800">
      <header className="bg-brand-600 px-14 py-10 text-white">
        <div className="flex items-center gap-6">
          <Photo cv={cv} className="h-24 w-24 shrink-0 rounded-full border-4 border-white/40 object-cover" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{cv.personal.fullName || 'Nama Lengkap'}</h1>
            {cv.personal.headline && <p className="mt-1 text-sm font-medium text-brand-100">{cv.personal.headline}</p>}
            <ContactLine cv={cv} className="mt-3 text-xs text-brand-100" />
            <LinksLine cv={cv} className="text-xs text-brand-100" />
          </div>
        </div>
      </header>
      <div className="px-14 py-8">
        {cv.personal.summary && (
          <section className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-700">Profil</h2>
            <p className="whitespace-pre-line">{cv.personal.summary}</p>
          </section>
        )}
        {sections.map((s) => (
          <section key={s.id} className="cv-section mb-5 break-inside-avoid">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-700">{s.label}</h2>
            {s.node}
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Template 3: Minimalist ---------------- */
function Minimalist({ cv }: { cv: CVData }) {
  const sections = buildSections(cv);
  return (
    <div style={A4_STYLE} className="cv-page bg-white px-16 py-14 font-sans text-[12.5px] leading-relaxed text-ink-700">
      <header className="mb-8 text-center">
        <h1 className="text-[26px] font-light tracking-[0.2em] text-ink-900">
          {(cv.personal.fullName || 'Nama Lengkap').toUpperCase()}
        </h1>
        {cv.personal.headline && <p className="mt-1.5 text-xs tracking-wide text-ink-500">{cv.personal.headline}</p>}
        <div className="mx-auto mt-4 h-px w-16 bg-ink-300" />
        <ContactLine cv={cv} className="mt-4 text-xs text-ink-500" />
        <LinksLine cv={cv} className="text-xs text-ink-500" />
      </header>
      {cv.personal.summary && (
        <section className="mb-6 text-center">
          <p className="mx-auto max-w-prose whitespace-pre-line">{cv.personal.summary}</p>
        </section>
      )}
      {sections.map((s) => (
        <section key={s.id} className="cv-section mb-6 break-inside-avoid">
          <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">{s.label}</h2>
          {s.node}
        </section>
      ))}
    </div>
  );
}

/* ---------------- Template 4: Fresh Graduate ---------------- */
function FreshGraduate({ cv }: { cv: CVData }) {
  // Education-first section order for entry-level candidates
  const preferred: CVData['sectionOrder'] = [
    'education',
    'organizations',
    'projects',
    'skills',
    'certificates',
    'experience',
    'languages',
    'additional',
  ];
  const ordered: CVData = useMemo(
    () => ({
      ...cv,
      sectionOrder: [...cv.sectionOrder].sort(
        (a, b) => preferred.indexOf(a) - preferred.indexOf(b),
      ),
    }),
    [cv],
  );
  const sections = buildSections(ordered);
  return (
    <div style={A4_STYLE} className="cv-page flex bg-white font-sans text-[12.5px] leading-relaxed text-ink-800">
      <div className="w-[30%] bg-emerald-700 px-7 py-10 text-white">
        <Photo cv={cv} className="mb-6 h-28 w-28 rounded-full border-4 border-white/30 object-cover" />
        <h1 className="text-xl font-bold leading-snug">{cv.personal.fullName || 'Nama Lengkap'}</h1>
        {cv.personal.headline && <p className="mt-1 text-xs text-emerald-100">{cv.personal.headline}</p>}
        <div className="mt-6 space-y-1.5 text-xs">
          {cv.personal.email && <p className="break-all">{cv.personal.email}</p>}
          {cv.personal.phone && <p>{cv.personal.phone}</p>}
          {commaJoin([cv.personal.city, cv.personal.province]) && (
            <p>{commaJoin([cv.personal.city, cv.personal.province])}</p>
          )}
        </div>
        <div className="mt-6 space-y-1.5 text-xs">
          {cv.personal.linkedin && <p className="break-all">{cv.personal.linkedin}</p>}
          {cv.personal.portfolio && <p className="break-all">{cv.personal.portfolio}</p>}
        </div>
        {cv.skills.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-100">Keahlian</h2>
            <ul className="space-y-1 text-xs">
              {cv.skills.map((s) => (
                <li key={s.id} className="border-b border-white/15 pb-1">
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {cv.languages.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-100">Bahasa</h2>
            <ul className="space-y-1 text-xs">
              {cv.languages.map((l) => (
                <li key={l.id}>
                  {l.name}
                  {l.level ? ` — ${l.level}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex-1 px-9 py-10">
        {cv.personal.summary && (
          <section className="mb-5">
            <h2 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-emerald-700">Profil</h2>
            <p className="whitespace-pre-line">{cv.personal.summary}</p>
          </section>
        )}
        {sections
          .filter((s) => s.id !== 'skills' && s.id !== 'languages')
          .map((s) => (
            <section key={s.id} className="cv-section mb-5 break-inside-avoid">
              <h2 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-emerald-700">{s.label}</h2>
              {s.node}
            </section>
          ))}
      </div>
    </div>
  );
}

/* ---------------- Template 5: Executive ---------------- */
function Executive({ cv }: { cv: CVData }) {
  const sections = buildSections(cv);
  return (
    <div style={A4_STYLE} className="cv-page bg-white font-serif text-[12.5px] leading-relaxed text-ink-800">
      <header className="border-b-4 border-ink-900 px-14 py-10 text-center">
        <h1 className="text-[28px] font-bold tracking-wide text-ink-900">
          {cv.personal.fullName || 'Nama Lengkap'}
        </h1>
        {cv.personal.headline && <p className="mt-1 text-sm italic text-ink-600">{cv.personal.headline}</p>}
        <div className="mt-3 flex items-center justify-center gap-4">
          <Photo cv={cv} className="h-20 w-20 rounded-full border-2 border-ink-300 object-cover" />
        </div>
        <ContactLine cv={cv} className="mt-3 text-xs text-ink-600" />
        <LinksLine cv={cv} className="text-xs text-ink-600" />
      </header>
      <div className="px-14 py-8">
        {cv.personal.summary && (
          <section className="mb-6">
            <h2 className="mb-1.5 text-sm font-bold uppercase tracking-[0.15em] text-ink-900">Profil Eksekutif</h2>
            <p className="whitespace-pre-line">{cv.personal.summary}</p>
          </section>
        )}
        {sections.map((s) => (
          <section key={s.id} className="cv-section mb-6 break-inside-avoid">
            <h2 className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em] text-ink-900">
              {s.label}
              <span className="h-px flex-1 bg-ink-300" />
            </h2>
            {s.node}
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Template 6: Creative ---------------- */
function Creative({ cv }: { cv: CVData }) {
  const sections = buildSections(cv);
  return (
    <div style={A4_STYLE} className="cv-page bg-white font-sans text-[12.5px] leading-relaxed text-ink-800">
      <div className="h-3 w-full bg-orange-500" />
      <div className="flex gap-8 px-12 py-10">
        <div className="w-[34%] shrink-0">
          <Photo cv={cv} className="mb-5 h-28 w-28 rounded-2xl object-cover shadow" />
          <h1 className="text-2xl font-black leading-tight text-ink-900">
            {cv.personal.fullName || 'Nama Lengkap'}
          </h1>
          {cv.personal.headline && <p className="mt-1 text-sm font-semibold text-orange-600">{cv.personal.headline}</p>}
          <div className="mt-5 space-y-1.5 text-xs text-ink-600">
            {cv.personal.email && <p className="break-all">{cv.personal.email}</p>}
            {cv.personal.phone && <p>{cv.personal.phone}</p>}
            {commaJoin([cv.personal.city, cv.personal.province]) && (
              <p>{commaJoin([cv.personal.city, cv.personal.province])}</p>
            )}
            {cv.personal.linkedin && <p className="break-all">{cv.personal.linkedin}</p>}
            {cv.personal.portfolio && <p className="break-all">{cv.personal.portfolio}</p>}
          </div>
          {cv.personal.summary && (
            <div className="mt-6">
              <h2 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">Profil</h2>
              <p className="whitespace-pre-line">{cv.personal.summary}</p>
            </div>
          )}
        </div>
        <div className="flex-1 border-l-2 border-orange-100 pl-8">
          {sections.map((s) => (
            <section key={s.id} className="cv-section mb-5 break-inside-avoid">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-900">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-orange-500" aria-hidden />
                {s.label}
              </h2>
              {s.node}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const RENDERERS: Record<TemplateId, (props: { cv: CVData }) => JSX.Element> = {
  'ats-classic': ATSClassic,
  'modern-professional': ModernProfessional,
  minimalist: Minimalist,
  'fresh-graduate': FreshGraduate,
  executive: Executive,
  creative: Creative,
};

export function CVDocument({ cv, templateId }: { cv: CVData; templateId?: TemplateId }) {
  const id = templateId ?? cv.templateId;
  const Renderer = RENDERERS[id] ?? ATSClassic;
  return (
    <div className="origin-top" style={{ transform: 'scale(var(--cv-scale, 1))' }}>
      <Renderer cv={cv} />
    </div>
  );
}
