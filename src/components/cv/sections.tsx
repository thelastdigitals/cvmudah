import type { CVData, CVSectionId } from '@/types/cv';
import { SECTION_LABELS, monthYearLabel } from '@/lib/cvData';

export interface SectionContent {
  id: CVSectionId;
  label: string;
  node: React.ReactNode;
}

function commaJoin(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(', ');
}

function eduText(cv: CVData, id: string): string {
  const e = cv.education.find((x) => x.id === id);
  return e ? `${e.institution} ${e.major}` : '';
}

function contactParts(cv: CVData): string[] {
  return [
    [cv.personal.email, cv.personal.phone].filter(Boolean).join(' | '),
    commaJoin([cv.personal.city, cv.personal.province]),
  ].filter((s): s is string => !!s);
}

/** Split ordered + visible sections into rendered content blocks shared by templates. */
export function buildSections(cv: CVData): SectionContent[] {
  const visible = cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id));
  const sections: SectionContent[] = [];

  for (const id of visible) {
    switch (id) {
      case 'education': {
        if (!cv.education.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-3">
              {cv.education.map((e) => (
                <li key={e.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <p className="font-semibold">
                      {e.institution || '[Institusi]'}
                      {e.gpa ? ` — IPK ${e.gpa}` : ''}
                    </p>
                    <span className="text-xs opacity-75">
                      {e.ongoing ? `${e.startYear || ''} - sekarang` : [e.startYear, e.endYear].filter(Boolean).join(' - ')}
                    </span>
                  </div>
                  <p className="text-sm opacity-85">
                    {[e.degree, e.major].filter(Boolean).join(' - ')}
                    {e.city ? ` — ${e.city}` : ''}
                  </p>
                  {e.description && <p className="mt-1 text-sm">{e.description}</p>}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
      case 'experience': {
        if (!cv.experience.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-3">
              {cv.experience.map((x) => (
                <li key={x.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <p className="font-semibold">{x.jobTitle || '[Jabatan]'}</p>
                    <span className="text-xs opacity-75">
                      {x.ongoing
                        ? `${monthYearLabel(x.startMonth, x.startYear)} - sekarang`
                        : [monthYearLabel(x.startMonth, x.startYear), monthYearLabel(x.endMonth, x.endYear)]
                            .filter(Boolean)
                            .join(' - ')}
                    </span>
                  </div>
                  <p className="text-sm opacity-85">{commaJoin([x.company, x.location])}</p>
                  {x.description && <p className="mt-1 text-sm">{x.description}</p>}
                  {x.achievements && <p className="mt-0.5 text-sm">Pencapaian: {x.achievements}</p>}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
      case 'organizations': {
        if (!cv.organizations.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-3">
              {cv.organizations.map((o) => (
                <li key={o.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <p className="font-semibold">{o.name || '[Organisasi]'}</p>
                    <span className="text-xs opacity-75">{o.period}</span>
                  </div>
                  {o.role && <p className="text-sm opacity-85">{o.role}</p>}
                  {o.description && <p className="mt-1 text-sm">{o.description}</p>}
                  {o.achievements && <p className="mt-0.5 text-sm">Pencapaian: {o.achievements}</p>}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
      case 'skills': {
        if (!cv.skills.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <p className="text-sm">{cv.skills.map((s) => s.name.trim()).filter(Boolean).join(', ')}</p>
          ),
        });
        break;
      }
      case 'certificates': {
        if (!cv.certificates.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-1.5">
              {cv.certificates.map((c) => (
                <li key={c.id} className="text-sm">
                  <span className="font-medium">{c.name}</span>
                  {c.issuer ? ` — ${c.issuer}` : ''}
                  {c.year ? ` (${c.year})` : ''}
                  {c.url && <span className="block break-all opacity-75">{c.url}</span>}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
      case 'languages': {
        if (!cv.languages.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-1">
              {cv.languages.map((l) => (
                <li key={l.id} className="text-sm">
                  {l.name}
                  {l.level ? ` — ${l.level}` : ''}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
      case 'projects': {
        if (!cv.projects.length) break;
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-3">
              {cv.projects.map((p) => (
                <li key={p.id}>
                  <p className="font-semibold">
                    {p.name || '[Nama proyek]'}
                    {p.role ? ` — ${p.role}` : ''}
                  </p>
                  {p.description && <p className="mt-0.5 text-sm">{p.description}</p>}
                  {p.url && <p className="mt-0.5 break-all text-sm opacity-75">{p.url}</p>}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
      case 'additional': {
        const rows = Object.entries(cv.additional).filter(([, v]) => v.trim());
        if (!rows.length) break;
        const labels: Record<string, string> = {
          awards: 'Penghargaan',
          volunteer: 'Kegiatan Sukarela',
          publications: 'Publikasi',
          other: 'Lainnya',
        };
        sections.push({
          id,
          label: SECTION_LABELS[id],
          node: (
            <ul className="space-y-2">
              {rows.map(([k, v]) => (
                <li key={k} className="text-sm">
                  <span className="font-semibold">{labels[k] ?? k}: </span>
                  {v}
                </li>
              ))}
            </ul>
          ),
        });
        break;
      }
    }
  }
  return sections;
}

export { commaJoin, contactParts, eduText };
