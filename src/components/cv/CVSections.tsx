import { MONTHS, createId } from '@/lib/cvData';
import type { CVData, CVSectionId, Education, Experience, OrganizationExperience, Certificate, LanguageSkill, Project, Skill } from '@/types/cv';
import { Input, Select, Textarea, Fieldset, Button } from '@/components/ui/Form';
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

export interface EditorSectionProps {
  cv: CVData;
  setCV: React.Dispatch<React.SetStateAction<CVData>>;
  errors?: import('@/lib/validation').CVErrors;
  hidden: boolean;
  onToggleVisibility: (id: CVSectionId) => void;
  onMoveSection: (id: CVSectionId, dir: -1 | 1) => void;
}

type Patch<T> = (id: string, patch: Partial<T>) => void;

function update<T extends { id: string }>(list: T[], id: string, patch: Partial<T>): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function MoveButtons({
  onUp, onDown, label, upDisabled, downDisabled,
}: {
  onUp: () => void;
  onDown: () => void;
  label: string;
  upDisabled?: boolean;
  downDisabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        disabled={upDisabled}
        aria-label={`Naikkan urutan ${label}`}
        className="rounded-lg p-1.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={downDisabled}
        aria-label={`Turunkan urutan ${label}`}
        className="rounded-lg p-1.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowDown className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function EntryCard({ title, onRemove, move, children }: {
  title: string;
  onRemove: () => void;
  move?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-800">{title}</p>
        <div className="flex items-center gap-1">
          {move}
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Hapus ${title}`}
            className="rounded-lg p-1.5 text-ink-500 transition hover:bg-error-50 hover:text-error-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

const MONTH_OPTS = MONTHS.map((m) => ({ value: m, label: m }));

export function EducationSection({ cv, setCV, errors, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const items = cv.education;
  const patch: Patch<Education> = (id, p) => setCV((c) => ({ ...c, education: update(c.education, id, p) }));
  const add = () =>
    setCV((c) => ({
      ...c,
      education: [...c.education, { id: createId(), institution: '', major: '', degree: 'S1', city: '', startYear: '', endYear: '', ongoing: false, description: '', gpa: '' }],
    }));
  const move = (idx: number, dir: -1 | 1) =>
    setCV((c) => {
      const next = [...c.education];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return c;
      [next[idx], next[j]] = [next[j], next[idx]];
      return { ...c, education: next };
    });

  return (
    <SectionShell id="education" title="Pendidikan" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="space-y-4">
        {items.map((e, i) => (
          <EntryCard
            key={e.id}
            title={e.institution || `Pendidikan ${i + 1}`}
            onRemove={() => setCV((c) => ({ ...c, education: c.education.filter((x) => x.id !== e.id) }))}
            move={<MoveButtons label={e.institution || `pendidikan ${i + 1}`} onUp={() => move(i, -1)} onDown={() => move(i, 1)} upDisabled={i === 0} downDisabled={i === items.length - 1} />}
          >
            <Input label="Nama institusi" name={`edu-inst-${e.id}`} value={e.institution} onChange={(ev) => patch(e.id, { institution: ev.target.value })} placeholder="Universitas Indonesia" />
            <Input label="Jurusan" name={`edu-major-${e.id}`} value={e.major} onChange={(ev) => patch(e.id, { major: ev.target.value })} placeholder="Administrasi Bisnis" />
            <Select
              label="Jenjang"
              name={`edu-degree-${e.id}`}
              value={e.degree}
              onChange={(ev) => patch(e.id, { degree: ev.target.value })}
              options={[
                { value: 'SMA/SMK', label: 'SMA/SMK' },
                { value: 'D3', label: 'D3' },
                { value: 'D4', label: 'D4' },
                { value: 'S1', label: 'S1' },
                { value: 'S2', label: 'S2' },
                { value: 'S3', label: 'S3' },
                { value: 'Lainnya', label: 'Lainnya' },
              ]}
            />
            <Input label="Kota" name={`edu-city-${e.id}`} optional value={e.city} onChange={(ev) => patch(e.id, { city: ev.target.value })} placeholder="Depok" />
            <Input
              label="Tahun mulai"
              name={`edu-start-${e.id}`}
              value={e.startYear}
              onChange={(ev) => patch(e.id, { startYear: ev.target.value.replace(/[^0-9]/g, '').slice(0, 4) })}
              inputMode="numeric"
              placeholder="2019"
              error={errors?.education[e.id]}
              errorId={`edu-err-${e.id}`}
            />
            <Input
              label="Tahun selesai"
              name={`edu-end-${e.id}`}
              optional
              value={e.ongoing ? '' : e.endYear}
              onChange={(ev) => patch(e.id, { endYear: ev.target.value.replace(/[^0-9]/g, '').slice(0, 4) })}
              inputMode="numeric"
              placeholder={e.ongoing ? 'Masih berlangsung' : '2023'}
              disabled={e.ongoing}
              error={errors?.education[e.id]}
              errorId={`edu-err-${e.id}`}
            />
            <label className="flex items-center gap-2 text-sm text-ink-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={e.ongoing}
                onChange={(ev) => patch(e.id, { ongoing: ev.target.checked })}
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              Masih berlangsung
            </label>
            <Input label="IPK" name={`edu-gpa-${e.id}`} optional value={e.gpa} onChange={(ev) => patch(e.id, { gpa: ev.target.value.slice(0, 5) })} placeholder="3.55" />
            <Textarea label="Deskripsi" name={`edu-desc-${e.id}`} optional value={e.description} onChange={(ev) => patch(e.id, { description: ev.target.value.slice(0, 500) })} className="sm:col-span-2" />
          </EntryCard>
        ))}
      </div>
      <Button variant="outline" onClick={add} className="mt-4 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden /> Tambah Pendidikan
      </Button>
    </SectionShell>
  );
}

export function ExperienceSection({ cv, setCV, errors, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const items = cv.experience;
  const patch: Patch<Experience> = (id, p) => setCV((c) => ({ ...c, experience: update(c.experience, id, p) }));
  const add = () =>
    setCV((c) => ({
      ...c,
      experience: [...c.experience, { id: createId(), jobTitle: '', company: '', location: '', startMonth: 'Jan', startYear: '', endMonth: 'Jan', endYear: '', ongoing: false, description: '', achievements: '' }],
    }));
  const move = (idx: number, dir: -1 | 1) =>
    setCV((c) => {
      const next = [...c.experience];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return c;
      [next[idx], next[j]] = [next[j], next[idx]];
      return { ...c, experience: next };
    });

  return (
    <SectionShell id="experience" title="Pengalaman Kerja" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="space-y-4">
        {items.map((x, i) => (
          <EntryCard
            key={x.id}
            title={x.jobTitle || `Pengalaman ${i + 1}`}
            onRemove={() => setCV((c) => ({ ...c, experience: c.experience.filter((e) => e.id !== x.id) }))}
            move={<MoveButtons label={x.jobTitle || `pengalaman ${i + 1}`} onUp={() => move(i, -1)} onDown={() => move(i, 1)} upDisabled={i === 0} downDisabled={i === items.length - 1} />}
          >
            <Input label="Jabatan" name={`exp-title-${x.id}`} value={x.jobTitle} onChange={(ev) => patch(x.id, { jobTitle: ev.target.value })} placeholder="Staf Administrasi" />
            <Input label="Nama perusahaan" name={`exp-company-${x.id}`} value={x.company} onChange={(ev) => patch(x.id, { company: ev.target.value })} placeholder="PT Contoh Sejahtera" />
            <Input label="Lokasi" name={`exp-loc-${x.id}`} optional value={x.location} onChange={(ev) => patch(x.id, { location: ev.target.value })} placeholder="Jakarta" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Bulan mulai" name={`exp-sm-${x.id}`} value={x.startMonth} onChange={(ev) => patch(x.id, { startMonth: ev.target.value })} options={MONTH_OPTS} />
              <Input label="Tahun mulai" name={`exp-sy-${x.id}`} value={x.startYear} onChange={(ev) => patch(x.id, { startYear: ev.target.value.replace(/[^0-9]/g, '').slice(0, 4) })} inputMode="numeric" placeholder="2022" error={errors?.experience[x.id]} errorId={`exp-err-${x.id}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Bulan selesai" name={`exp-em-${x.id}`} value={x.endMonth} onChange={(ev) => patch(x.id, { endMonth: ev.target.value })} options={MONTH_OPTS} disabled={x.ongoing} />
              <Input label="Tahun selesai" name={`exp-ey-${x.id}`} optional value={x.ongoing ? '' : x.endYear} onChange={(ev) => patch(x.id, { endYear: ev.target.value.replace(/[^0-9]/g, '').slice(0, 4) })} inputMode="numeric" placeholder={x.ongoing ? 'Masih bekerja' : '2023'} disabled={x.ongoing} error={errors?.experience[x.id]} errorId={`exp-err-${x.id}`} />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-700 sm:col-span-2">
              <input type="checkbox" checked={x.ongoing} onChange={(ev) => patch(x.id, { ongoing: ev.target.checked })} className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
              Masih bekerja di sini
            </label>
            <Textarea label="Deskripsi tanggung jawab" name={`exp-desc-${x.id}`} optional value={x.description} onChange={(ev) => patch(x.id, { description: ev.target.value.slice(0, 800) })} className="sm:col-span-2" hint="Deskripsikan tugas utama secara ringkas." />
            <Textarea label="Pencapaian terukur" name={`exp-ach-${x.id}`} optional value={x.achievements} onChange={(ev) => patch(x.id, { achievements: ev.target.value.slice(0, 400) })} className="sm:col-span-2" hint="Contoh: memangkas waktu proses 20%." />
          </EntryCard>
        ))}
      </div>
      <Button variant="outline" onClick={add} className="mt-4 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden /> Tambah Pengalaman
      </Button>
    </SectionShell>
  );
}

export function OrganizationsSection({ cv, setCV, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const items = cv.organizations;
  const patch: Patch<OrganizationExperience> = (id, p) => setCV((c) => ({ ...c, organizations: update(c.organizations, id, p) }));
  const add = () =>
    setCV((c) => ({
      ...c,
      organizations: [...c.organizations, { id: createId(), name: '', role: '', period: '', description: '', achievements: '' }],
    }));
  const move = (idx: number, dir: -1 | 1) =>
    setCV((c) => {
      const next = [...c.organizations];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return c;
      [next[idx], next[j]] = [next[j], next[idx]];
      return { ...c, organizations: next };
    });

  return (
    <SectionShell id="organizations" title="Magang & Organisasi" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="space-y-4">
        {items.map((o, i) => (
          <EntryCard
            key={o.id}
            title={o.name || `Organisasi ${i + 1}`}
            onRemove={() => setCV((c) => ({ ...c, organizations: c.organizations.filter((x) => x.id !== o.id) }))}
            move={<MoveButtons label={o.name || `organisasi ${i + 1}`} onUp={() => move(i, -1)} onDown={() => move(i, 1)} upDisabled={i === 0} downDisabled={i === items.length - 1} />}
          >
            <Input label="Nama organisasi / perusahaan" name={`org-name-${o.id}`} value={o.name} onChange={(ev) => patch(o.id, { name: ev.target.value })} placeholder="BEM Universitas" />
            <Input label="Jabatan / peran" name={`org-role-${o.id}`} value={o.role} onChange={(ev) => patch(o.id, { role: ev.target.value })} placeholder="Sekretaris" />
            <Input label="Periode" name={`org-period-${o.id}`} value={o.period} onChange={(ev) => patch(o.id, { period: ev.target.value })} placeholder="2021 - 2022" />
            <Textarea label="Deskripsi kegiatan" name={`org-desc-${o.id}`} optional value={o.description} onChange={(ev) => patch(o.id, { description: ev.target.value.slice(0, 500) })} />
            <Textarea label="Pencapaian" name={`org-ach-${o.id}`} optional value={o.achievements} onChange={(ev) => patch(o.id, { achievements: ev.target.value.slice(0, 400) })} className="sm:col-span-2" />
          </EntryCard>
        ))}
      </div>
      <Button variant="outline" onClick={add} className="mt-4 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden /> Tambah Magang / Organisasi
      </Button>
    </SectionShell>
  );
}

export function SkillsSection({ cv, setCV, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const inputId = 'skill-input';
  const addSkill = (raw: string) => {
    const name = raw.trim().slice(0, 40);
    if (!name) return;
    setCV((c) => {
      if (c.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return c;
      const skill: Skill = { id: createId(), name };
      return { ...c, skills: [...c.skills, skill] };
    });
  };

  return (
    <SectionShell id="skills" title="Keahlian" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const input = document.getElementById(inputId) as HTMLInputElement | null;
          if (input) {
            addSkill(input.value);
            input.value = '';
          }
        }}
      >
        <input
          id={inputId}
          type="text"
          className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Contoh: Microsoft Excel, Komunikasi"
          aria-label="Tambah keahlian"
          maxLength={60}
        />
        <Button type="submit" variant="outline">
          <Plus className="h-4 w-4" aria-hidden /> Tambah
        </Button>
      </form>
      {cv.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {cv.skills.map((s, i) => (
            <li key={s.id} className="flex items-center gap-1 rounded-full border border-ink-200 bg-white py-1 pl-3 pr-1 text-sm">
              <span>{s.name}</span>
              <div className="flex items-center">
                <MoveButtons
                  label={`keahlian ${s.name}`}
                  onUp={() => setCV((c) => {
                    if (i === 0) return c;
                    const next = [...c.skills];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    return { ...c, skills: next };
                  })}
                  onDown={() => setCV((c) => {
                    if (i === c.skills.length - 1) return c;
                    const next = [...c.skills];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    return { ...c, skills: next };
                  })}
                />
                <button
                  type="button"
                  onClick={() => setCV((c) => ({ ...c, skills: c.skills.filter((x) => x.id !== s.id) }))}
                  aria-label={`Hapus keahlian ${s.name}`}
                  className="rounded-full p-1 text-ink-400 transition hover:bg-error-50 hover:text-error-600"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}

export function CertificatesSection({ cv, setCV, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const items = cv.certificates;
  const patch: Patch<Certificate> = (id, p) => setCV((c) => ({ ...c, certificates: update(c.certificates, id, p) }));
  const add = () =>
    setCV((c) => ({
      ...c,
      certificates: [...c.certificates, { id: createId(), name: '', issuer: '', year: '', url: '' }],
    }));

  return (
    <SectionShell id="certificates" title="Sertifikat & Pelatihan" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="space-y-4">
        {items.map((c, i) => (
          <EntryCard
            key={c.id}
            title={c.name || `Sertifikat ${i + 1}`}
            onRemove={() => setCV((cv2) => ({ ...cv2, certificates: cv2.certificates.filter((x) => x.id !== c.id) }))}
          >
            <Input label="Nama sertifikat" name={`cert-name-${c.id}`} value={c.name} onChange={(ev) => patch(c.id, { name: ev.target.value })} placeholder="Pelatihan Digital Marketing" />
            <Input label="Penerbit" name={`cert-issuer-${c.id}`} optional value={c.issuer} onChange={(ev) => patch(c.id, { issuer: ev.target.value })} placeholder="Contoh Akademi" />
            <Input label="Tahun" name={`cert-year-${c.id}`} optional value={c.year} onChange={(ev) => patch(c.id, { year: ev.target.value.replace(/[^0-9]/g, '').slice(0, 4) })} inputMode="numeric" placeholder="2023" />
            <Input label="URL sertifikat" name={`cert-url-${c.id}`} optional value={c.url} onChange={(ev) => patch(c.id, { url: ev.target.value })} placeholder="https://" />
          </EntryCard>
        ))}
      </div>
      <Button variant="outline" onClick={add} className="mt-4 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden /> Tambah Sertifikat
      </Button>
    </SectionShell>
  );
}

export function LanguagesSection({ cv, setCV, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const items = cv.languages;
  const patch: Patch<LanguageSkill> = (id, p) => setCV((c) => ({ ...c, languages: update(c.languages, id, p) }));
  const add = () =>
    setCV((c) => ({
      ...c,
      languages: [...c.languages, { id: createId(), name: '', level: 'Menengah' }],
    }));

  return (
    <SectionShell id="languages" title="Bahasa" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="space-y-4">
        {items.map((l) => (
          <EntryCard
            key={l.id}
            title={l.name || 'Bahasa'}
            onRemove={() => setCV((c) => ({ ...c, languages: c.languages.filter((x) => x.id !== l.id) }))}
          >
            <Input label="Nama bahasa" name={`lang-name-${l.id}`} value={l.name} onChange={(ev) => patch(l.id, { name: ev.target.value })} placeholder="Bahasa Inggris" />
            <Select
              label="Tingkat kemampuan"
              name={`lang-level-${l.id}`}
              value={l.level}
              onChange={(ev) => patch(l.id, { level: ev.target.value })}
              options={['Pemula', 'Menengah', 'Mahir', 'Fasih', 'Bahasa Ibu'].map((v) => ({ value: v, label: v }))}
            />
          </EntryCard>
        ))}
      </div>
      <Button variant="outline" onClick={add} className="mt-4 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden /> Tambah Bahasa
      </Button>
    </SectionShell>
  );
}

export function ProjectsSection({ cv, setCV, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  const items = cv.projects;
  const patch: Patch<Project> = (id, p) => setCV((c) => ({ ...c, projects: update(c.projects, id, p) }));
  const add = () =>
    setCV((c) => ({
      ...c,
      projects: [...c.projects, { id: createId(), name: '', description: '', role: '', url: '' }],
    }));

  return (
    <SectionShell id="projects" title="Proyek & Portofolio" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="space-y-4">
        {items.map((p, i) => (
          <EntryCard
            key={p.id}
            title={p.name || `Proyek ${i + 1}`}
            onRemove={() => setCV((c) => ({ ...c, projects: c.projects.filter((x) => x.id !== p.id) }))}
          >
            <Input label="Nama proyek" name={`proj-name-${p.id}`} value={p.name} onChange={(ev) => patch(p.id, { name: ev.target.value })} placeholder="Aplikasi Kasir Sederhana" />
            <Input label="Peran" name={`proj-role-${p.id}`} optional value={p.role} onChange={(ev) => patch(p.id, { role: ev.target.value })} placeholder="Developer" />
            <Textarea label="Deskripsi" name={`proj-desc-${p.id}`} optional value={p.description} onChange={(ev) => patch(p.id, { description: ev.target.value.slice(0, 500) })} className="sm:col-span-2" />
            <Input label="URL proyek" name={`proj-url-${p.id}`} optional value={p.url} onChange={(ev) => patch(p.id, { url: ev.target.value })} placeholder="https://" className="sm:col-span-2" />
          </EntryCard>
        ))}
      </div>
      <Button variant="outline" onClick={add} className="mt-4 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden /> Tambah Proyek
      </Button>
    </SectionShell>
  );
}

export function AdditionalSection({ cv, setCV, hidden, onToggleVisibility, onMoveSection }: EditorSectionProps) {
  return (
    <SectionShell id="additional" title="Informasi Tambahan" cv={cv} hidden={hidden} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea label="Penghargaan" name="add-awards" optional value={cv.additional.awards} onChange={(e) => setCV((c) => ({ ...c, additional: { ...c.additional, awards: e.target.value.slice(0, 500) } }))} />
        <Textarea label="Kegiatan sukarela" name="add-volunteer" optional value={cv.additional.volunteer} onChange={(e) => setCV((c) => ({ ...c, additional: { ...c.additional, volunteer: e.target.value.slice(0, 500) } }))} />
        <Textarea label="Publikasi" name="add-pubs" optional value={cv.additional.publications} onChange={(e) => setCV((c) => ({ ...c, additional: { ...c.additional, publications: e.target.value.slice(0, 500) } }))} />
        <Textarea label="Informasi relevan lainnya" name="add-other" optional value={cv.additional.other} onChange={(e) => setCV((c) => ({ ...c, additional: { ...c.additional, other: e.target.value.slice(0, 500) } }))} />
      </div>
    </SectionShell>
  );
}

function SectionShell({
  id, title, hidden, onToggleVisibility, onMoveSection, children,
}: Omit<EditorSectionProps, 'setCV'> & { id: CVSectionId; title: string; children: React.ReactNode }) {
  if (hidden) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-dashed border-ink-200 bg-white px-5 py-4">
        <p className="text-sm text-ink-500">
          Bagian <span className="font-semibold text-ink-700">{title}</span> disembunyikan.
        </p>
        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(id)}>
          <Eye className="h-4 w-4" aria-hidden /> Tampilkan
        </Button>
      </div>
    );
  }
  return (
    <Fieldset
      title={title}
      actions={
        <div className="flex items-center gap-1">
          <MoveButtons label={`bagian ${title}`} onUp={() => onMoveSection(id, -1)} onDown={() => onMoveSection(id, 1)} />
          <button
            type="button"
            onClick={() => onToggleVisibility(id)}
            aria-label={`Sembunyikan bagian ${title}`}
            title="Sembunyikan bagian ini"
            className="rounded-lg p-1.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
          >
            <EyeOff className="h-4 w-4" aria-hidden />
          </button>
        </div>
      }
    >
      {children}
    </Fieldset>
  );
}
