import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { CVData, CVSectionId, TemplateId } from '@/types/cv';
import { cvStorage } from '@/lib/storage';
import { emptyCV, DEMO_CV } from '@/lib/cvData';
import { validateCV, type CVErrors } from '@/lib/validation';
import { useToast } from '@/components/ui/Toast';
import { Input, Textarea, Button, Fieldset } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { CVDocument } from '@/components/cv/CVDocument';
import { A4Scaler } from '@/components/cv/A4Scaler';
import { exportNodeToPdf, buildFileName } from '@/lib/exportPdf';
import { readImageFile } from '@/lib/sanitize';
import {
  EducationSection,
  ExperienceSection,
  OrganizationsSection,
  SkillsSection,
  CertificatesSection,
  LanguagesSection,
  ProjectsSection,
  AdditionalSection,
} from '@/components/cv/CVSections';

const personalFields = [
  'fullName', 'headline', 'email', 'phone', 'city', 'province', 'linkedin', 'portfolio', 'summary',
] as const;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function CVEditor() {
  const { showToast } = useToast();
  const [cv, setCV] = useState<CVData>(() => {
    const loaded = cvStorage.load();
    if (loaded.corrupted) return emptyCV();
    return loaded.data ?? emptyCV();
  });
  const [errors, setErrors] = useState<CVErrors>({ education: {}, experience: {} });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const printHostRef = useRef<HTMLDivElement | null>(null);
  const restoredToastShown = useRef(false);
  const saveTimer = useRef<number | undefined>(undefined);
  const isFirstRender = useRef(true);
  const location = useLocation();

  // Apply a template or example passed via navigation state (from gallery / examples pages)
  useEffect(() => {
    const state = location.state as { templateId?: TemplateId; applyExample?: CVData } | null;
    if (!state) return;
    if (state.applyExample) {
      setCV({ ...state.applyExample });
      cvStorage.save(state.applyExample);
      showToast('Contoh CV dimuat ke editor. Silakan ganti dengan data aslimu.', 'success');
    } else if (state.templateId) {
      setCV((c) => {
        const next = { ...c, templateId: state.templateId as TemplateId };
        cvStorage.save(next);
        return next;
      });
    }
    // Clear the state so a manual refresh doesn't re-apply it
    window.history.replaceState({}, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore notification
  useEffect(() => {
    if (restoredToastShown.current) return;
    const loaded = cvStorage.load();
    if (loaded.data) {
      restoredToastShown.current = true;
      showToast('Draft CV kamu berhasil dipulihkan.', 'success');
    } else if (loaded.corrupted) {
      restoredToastShown.current = true;
      showToast('Data tersimpan rusak sehingga tidak dapat dipulihkan. Silakan isi ulang.', 'error');
    }
  }, [showToast]);

  // Autosave with debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveStatus('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const res = cvStorage.save(cv);
      setSaveStatus(res.ok ? 'saved' : 'error');
      if (res.quota) {
        showToast('Penyimpanan perangkat penuh. Hapus foto atau data lama untuk menyimpan.', 'error');
      }
    }, 600);
    return () => window.clearTimeout(saveTimer.current);
  }, [cv, showToast]);

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const t = window.setTimeout(() => setSaveStatus('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [saveStatus]);

  const runValidation = useCallback((): boolean => {
    const result = validateCV(cv);
    setErrors(result.errors);
    if (!result.valid) {
      showToast(result.blocking[0] ?? 'Periksa kembali data CV kamu.', 'error');
      return false;
    }
    return true;
  }, [cv, showToast]);

  const handlePrint = async () => {
    if (!runValidation()) return;
    const host = printHostRef.current;
    if (!host) {
      showToast('Gagal membuat PDF. Muat ulang halaman dan coba lagi.', 'error');
      return;
    }
    setIsPrinting(true);
    try {
      await exportNodeToPdf(host, buildFileName('CV', cv.personal.fullName));
      showToast('PDF CV berhasil diunduh.', 'success');
    } catch {
      showToast('Gagal membuat PDF. Coba lagi atau gunakan tombol cetak browser.', 'error');
    } finally {
      setIsPrinting(false);
    }
  };

  const onToggleVisibility = (id: CVSectionId) =>
    setCV((c) => ({
      ...c,
      hiddenSections: c.hiddenSections.includes(id)
        ? c.hiddenSections.filter((s) => s !== id)
        : [...c.hiddenSections, id],
    }));

  const onMoveSection = (id: CVSectionId, dir: -1 | 1) =>
    setCV((c) => {
      const order = [...c.sectionOrder];
      const i = order.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= order.length) return c;
      [order[i], order[j]] = [order[j], order[i]];
      return { ...c, sectionOrder: order };
    });

  const setPersonal = (key: (typeof personalFields)[number], value: string) =>
    setCV((c) => ({ ...c, personal: { ...c.personal, [key]: value } }));

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      if (!dataUrl) {
        showToast('Gagal membaca foto. Coba file lain.', 'error');
        return;
      }
      setCV((c) => ({ ...c, personal: { ...c.personal, photo: dataUrl } }));
      showToast('Foto profil ditambahkan.', 'success');
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      if (code === 'SIZE') showToast('Ukuran foto maksimal 2 MB.', 'error');
      else if (code === 'FORMAT') showToast('Format foto harus JPEG, PNG, atau WebP.', 'error');
      else showToast('Foto tidak dapat dibaca. Coba file lain.', 'error');
    }
  };

  const resetForm = () => {
    setCV((c) => emptyCV(c.templateId));
    cvStorage.remove();
    setShowResetModal(false);
    showToast('Formulir CV dikosongkan. Draft surat lamaran tidak terhapus.', 'success');
  };

  const deleteAll = () => {
    setCV(emptyCV());
    cvStorage.remove();
    setShowDeleteModal(false);
    showToast('Semua data CV berhasil dihapus.', 'success');
  };

  const loadDemo = () => {
    setCV((c) => (Object.values(c.personal).some((v) => typeof v === 'string' && v.trim())
      ? c
      : { ...DEMO_CV, templateId: c.templateId }));
  };

  const saveLabel =
    saveStatus === 'saving' ? 'Menyimpan...' : saveStatus === 'saved' ? 'Tersimpan' : saveStatus === 'error' ? 'Gagal menyimpan' : '';

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">Buat CV</h1>
          <p className="mt-1 text-sm text-ink-500">
            Isi formulir, lihat hasilnya langsung di sebelah kanan, lalu unduh atau cetak.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <SaveBadge status={saveStatus} label={saveLabel} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="no-print sticky top-16 z-40 -mx-4 mb-6 border-b border-ink-200 bg-ink-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => void handlePrint()} disabled={isPrinting}>
            {isPrinting ? 'Menyiapkan PDF...' : 'Unduh PDF'}
          </Button>
          <Button variant="outline" onClick={() => setMobileTab((t) => (t === 'form' ? 'preview' : 'form'))} className="lg:hidden">
            {mobileTab === 'form' ? 'Lihat Preview' : 'Edit Formulir'}
          </Button>
          <Button variant="ghost" onClick={() => setShowResetModal(true)}>
            Reset Formulir
          </Button>
          <Button variant="ghost" onClick={() => setShowDeleteModal(true)} className="text-error-600 hover:bg-error-50">
            Hapus Semua Data
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <select
              aria-label="Pilih template CV"
              value={cv.templateId}
              onChange={(e) => setCV((c) => ({ ...c, templateId: e.target.value as TemplateId }))}
              className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium"
            >
              <option value="ats-classic">ATS Classic</option>
              <option value="modern-professional">Modern Professional</option>
              <option value="minimalist">Minimalist</option>
              <option value="fresh-graduate">Fresh Graduate</option>
              <option value="executive">Executive</option>
              <option value="creative">Creative</option>
            </select>
          </div>
        </div>
      </div>

      <div
        ref={(el) => { if (el) printHostRef.current = el; }}
        style={{ position: 'fixed', left: '-10000px', top: 0, width: '210mm' }}
        aria-hidden
      >
        <CVDocument cv={cv} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
        {/* FORM COLUMN */}
        <div className={mobileTab === 'form' ? '' : 'hidden lg:block'}>
          <div className="space-y-5">
            <PersonalInfoSection cv={cv} setPersonal={setPersonal} errors={errors} onPhoto={handlePhoto} onRemovePhoto={() => setCV((c) => ({ ...c, personal: { ...c.personal, photo: '' } }))} />
            <EducationSection cv={cv} setCV={setCV} errors={errors} hidden={cv.hiddenSections.includes('education')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <ExperienceSection cv={cv} setCV={setCV} errors={errors} hidden={cv.hiddenSections.includes('experience')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <OrganizationsSection cv={cv} setCV={setCV} hidden={cv.hiddenSections.includes('organizations')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <SkillsSection cv={cv} setCV={setCV} hidden={cv.hiddenSections.includes('skills')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <CertificatesSection cv={cv} setCV={setCV} hidden={cv.hiddenSections.includes('certificates')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <LanguagesSection cv={cv} setCV={setCV} hidden={cv.hiddenSections.includes('languages')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <ProjectsSection cv={cv} setCV={setCV} hidden={cv.hiddenSections.includes('projects')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
            <AdditionalSection cv={cv} setCV={setCV} hidden={cv.hiddenSections.includes('additional')} onToggleVisibility={onToggleVisibility} onMoveSection={onMoveSection} />
          </div>
        </div>

        {/* PREVIEW COLUMN */}
        <div className={mobileTab === 'preview' ? '' : 'hidden lg:block'}>
          <div className="lg:sticky lg:top-36">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Preview CV</h2>
              <Button variant="ghost" size="sm" onClick={loadDemo} aria-label="Muat data contoh">
                Coba Data Contoh
              </Button>
            </div>
            <div className="rounded-2xl bg-ink-100 p-4 shadow-doc">
              <A4Scaler>
                <CVDocument cv={cv} />
              </A4Scaler>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Klik "Unduh PDF" untuk menyimpan CV sebagai file PDF di perangkatmu.
            </p>
          </div>
          <div className="mt-4 lg:hidden">
            <Button variant="outline" onClick={() => setMobileTab('form')} className="w-full">
              Kembali ke Formulir
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Formulir CV?"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowResetModal(false)}>Batal</Button>
            <Button onClick={resetForm}>Ya, Kosongkan Formulir</Button>
          </>
        }
      >
        <p>Seluruh isian CV pada formulir ini akan dikosongkan. Draft surat lamaran kamu tidak akan terhapus.</p>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Semua Data CV?"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Batal</Button>
            <Button onClick={deleteAll} className="bg-error-500 hover:bg-error-600 focus-visible:outline-error-600">Hapus Permanen</Button>
          </>
        }
      >
        <p>
          Semua data CV, termasuk draft yang tersimpan di perangkat ini, akan dihapus permanen. Tindakan ini tidak
          dapat dibatalkan. Draft surat lamaran tidak terhapus.
        </p>
      </Modal>
    </div>
  );
}

function SaveBadge({ status, label }: { status: SaveStatus; label: string }) {
  if (status === 'idle') return <span className="text-ink-400" />;
  const color =
    status === 'saved' ? 'text-success-600' : status === 'error' ? 'text-error-600' : 'text-ink-500';
  return (
    <span className={`${color} flex items-center gap-1 text-xs font-medium`} role="status">
      <span className={`inline-block h-2 w-2 rounded-full ${status === 'error' ? 'bg-error-500' : status === 'saved' ? 'bg-success-500' : 'bg-ink-400 animate-pulse'}`} aria-hidden />
      {label}
    </span>
  );
}

function PersonalInfoSection({
  cv, setPersonal, errors, onPhoto, onRemovePhoto,
}: {
  cv: CVData;
  setPersonal: (key: (typeof personalFields)[number], value: string) => void;
  errors: CVErrors;
  onPhoto: (file: File | undefined) => void;
  onRemovePhoto: () => void;
}) {
  const p = cv.personal;
  return (
    <Fieldset title="Informasi Pribadi" description="Data kontak dan profil singkatmu.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nama lengkap" name="fullName" required value={p.fullName} onChange={(e) => setPersonal('fullName', e.target.value.slice(0, 80))} error={errors.fullName} errorId="err-fullName" placeholder="Nama sesuai identitas" />
        <Input label="Jabatan / profesi yang dituju" name="headline" value={p.headline} onChange={(e) => setPersonal('headline', e.target.value.slice(0, 80))} placeholder="Staf Administrasi" />
        <Input label="Email" name="email" type="email" value={p.email} onChange={(e) => setPersonal('email', e.target.value.slice(0, 80))} error={errors.email} errorId="err-email" placeholder="nama@email.com" />
        <Input label="Nomor telepon" name="phone" type="tel" value={p.phone} onChange={(e) => setPersonal('phone', e.target.value.slice(0, 20))} error={errors.phone} errorId="err-phone" placeholder="0812 3456 7890" />
        <Input label="Kota" name="city" value={p.city} onChange={(e) => setPersonal('city', e.target.value.slice(0, 60))} placeholder="Bandung" />
        <Input label="Provinsi" name="province" value={p.province} onChange={(e) => setPersonal('province', e.target.value.slice(0, 60))} placeholder="Jawa Barat" />
        <Input label="URL LinkedIn" name="linkedin" optional value={p.linkedin} onChange={(e) => setPersonal('linkedin', e.target.value.slice(0, 200))} error={errors.linkedin} errorId="err-linkedin" placeholder="https://linkedin.com/in/namakamu" />
        <Input label="URL portofolio" name="portfolio" optional value={p.portfolio} onChange={(e) => setPersonal('portfolio', e.target.value.slice(0, 200))} error={errors.portfolio} errorId="err-portfolio" placeholder="https://" />
        <Textarea label="Deskripsi profil profesional" name="summary" optional value={p.summary} onChange={(e) => setPersonal('summary', e.target.value.slice(0, 600))} className="sm:col-span-2" hint="2-3 kalimat ringkasan diri, keahlian, dan tujuan karier." />

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Foto profil <span className="font-normal text-ink-400">(opsional)</span>
          </label>
          <div className="flex items-center gap-4">
            {p.photo ? (
              <div className="flex items-center gap-3">
                <img src={p.photo} alt="Preview foto profil" className="h-16 w-16 rounded-full object-cover" />
                <Button variant="danger" size="sm" onClick={onRemovePhoto}>
                  Hapus Foto
                </Button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onPhoto(e.target.files?.[0])}
                aria-label="Unggah foto profil (JPEG, PNG, atau WebP, maksimal 2 MB)"
                className="text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-ink-500">JPEG, PNG, atau WebP. Maksimal 2 MB. Tersimpan hanya di perangkatmu.</p>
        </div>
      </div>
    </Fieldset>
  );
}
