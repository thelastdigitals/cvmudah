import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COVER_LETTER_TEMPLATES, type CoverLetterForm, type CoverLetterTemplateId } from '@/types/coverLetter';
import { letterStorage } from '@/lib/storage';
import { generateCoverLetter } from '@/lib/coverLetterGenerator';
import { useToast } from '@/components/ui/Toast';
import { Input, Textarea, Button, Fieldset } from '@/components/ui/Form';
import { Modal } from '@/components/ui/Modal';
import { PrintPortal } from '@/lib/print';
import { exportNodeToPdf, buildFileName, triggerPrint } from '@/lib/exportPdf';
import { applySeo } from '@/lib/seo';
import { Copy, FileDown, Printer, Save, Trash2, Wand2 } from 'lucide-react';

function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function emptyLetter(): CoverLetterForm {
  return {
    applicantName: '',
    email: '',
    phone: '',
    city: '',
    date: todayISO(),
    companyName: '',
    recipientName: '',
    position: '',
    vacancySource: '',
    education: '',
    experience: '',
    skills: '',
    reason: '',
    closing: '',
    body: '',
    templateId: 'formal',
  };
}

const FIELDS: { key: keyof CoverLetterForm; label: string; optional?: boolean; textarea?: boolean; placeholder?: string; hint?: string }[] = [
  { key: 'applicantName', label: 'Nama pelamar', placeholder: 'Nama lengkap' },
  { key: 'email', label: 'Email', optional: true, placeholder: 'nama@email.com' },
  { key: 'phone', label: 'Nomor telepon', optional: true, placeholder: '0812 3456 7890' },
  { key: 'city', label: 'Kota', placeholder: 'Jakarta' },
  { key: 'date', label: 'Tanggal surat' },
  { key: 'companyName', label: 'Nama perusahaan', placeholder: 'PT Contoh Sejahtera' },
  { key: 'recipientName', label: 'Nama perekrut / HRD', optional: true, placeholder: 'Ibu Sari' },
  { key: 'position', label: 'Posisi yang dilamar', placeholder: 'Staf Administrasi' },
  { key: 'vacancySource', label: 'Sumber informasi lowongan', optional: true, placeholder: 'LinkedIn, situs perusahaan' },
  { key: 'education', label: 'Pendidikan terakhir', optional: true, placeholder: 'S1 Administrasi Bisnis, Universitas Contoh (2023)' },
  { key: 'experience', label: 'Pengalaman relevan', optional: true, textarea: true, placeholder: 'Magang 6 bulan sebagai staf administrasi di PT Contoh...' },
  { key: 'skills', label: 'Keahlian utama', optional: true, placeholder: 'Microsoft Excel, komunikasi, pengelolaan data' },
  { key: 'reason', label: 'Alasan tertarik pada posisi', optional: true, textarea: true, placeholder: 'Mengapa kamu tertarik dengan posisi dan perusahaan ini?' },
  { key: 'closing', label: 'Kalimat penutup', optional: true, textarea: true, hint: 'Kosongkan untuk memakai kalimat penutup standar.' },
];

export default function CoverLetterPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<CoverLetterForm>(() => {
    const loaded = letterStorage.load();
    if (loaded.data && typeof loaded.data === 'object') {
      return { ...emptyLetter(), ...loaded.data };
    }
    return emptyLetter();
  });
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);
  const firstRender = useRef(true);
  const restored = useRef(false);

  useEffect(() => {
    applySeo({
      path: '/surat-lamaran',
      title: 'Pembuat Surat Lamaran Kerja Gratis | CVMudah',
      description:
        'Buat surat lamaran kerja profesional dalam bahasa Indonesia. Pilih template, isi formulir, lalu salin, unduh, atau cetak suratmu.',
    });
  }, []);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (letterStorage.load().data) {
      showToast('Draft surat lamaran berhasil dipulihkan.', 'success');
    }
  }, [showToast]);

  // Autosave
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDraftStatus('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const res = letterStorage.save(form);
      setDraftStatus(res.ok ? 'saved' : 'idle');
      if (!res.ok && res.quota) showToast('Penyimpanan perangkat penuh.', 'error');
    }, 600);
    return () => window.clearTimeout(saveTimer.current);
  }, [form, showToast]);

  useEffect(() => {
    if (draftStatus !== 'saved') return;
    const t = window.setTimeout(() => setDraftStatus('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [draftStatus]);

  const set = useCallback((key: keyof CoverLetterForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const generated = useMemo(() => generateCoverLetter(form), [form]);

  const buildLetter = () => {
    if (!form.applicantName.trim()) {
      showToast('Nama pelamar wajib diisi sebelum membuat surat.', 'error');
      return;
    }
    if (!form.position.trim()) {
      showToast('Posisi yang dilamar wajib diisi sebelum membuat surat.', 'error');
      return;
    }
    setForm((f) => ({ ...f, body: generateCoverLetter(f).content }));
    showToast('Surat berhasil dibuat. Kamu bisa mengedit teksnya langsung.', 'success');
  };

  const finalText = form.body.trim() ? form.body : '';

  const copyText = async () => {
    const text = finalText || generated.content;
    if (!text) {
      showToast('Belum ada teks surat untuk disalin. Klik "Buat Surat" terlebih dahulu.', 'error');
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        showToast('Surat lamaran berhasil disalin.', 'success');
        return;
      }
      throw new Error('no-clipboard');
    } catch {
      showToast('Fitur salin tidak tersedia di browser ini. Pilih teks surat di bawah lalu salin secara manual.', 'error');
    }
  };

  const saveDraft = () => {
    const res = letterStorage.save(form);
    if (res.ok) showToast('Draft surat lamaran berhasil disimpan.', 'success');
    else showToast('Gagal menyimpan draft. Penyimpanan perangkat mungkin penuh.', 'error');
  };

  const deleteDraft = () => {
    letterStorage.remove();
    setForm(emptyLetter());
    setShowDeleteModal(false);
    showToast('Draft surat lamaran berhasil dihapus.', 'success');
  };

  const handlePrint = () => {
    setIsPrinting(true);
    window.setTimeout(() => {
      triggerPrint();
      window.setTimeout(() => setIsPrinting(false), 500);
    }, 150);
  };

  const handleDownloadPdf = async () => {
    const text = letterBody;
    if (!text.trim()) {
      showToast('Belum ada surat untuk diunduh. Klik "Buat Surat" terlebih dahulu.', 'error');
      return;
    }
    const host = pdfHostRef.current;
    if (!host) {
      showToast('Gagal membuat PDF. Muat ulang halaman dan coba lagi.', 'error');
      return;
    }
    setIsExporting(true);
    try {
      await exportNodeToPdf(host, buildFileName('Surat-Lamaran', form.applicantName));
      showToast('PDF surat lamaran berhasil diunduh.', 'success');
    } catch {
      showToast('Gagal membuat PDF. Coba lagi atau gunakan tombol cetak browser.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const pdfHostRef = useRef<HTMLDivElement | null>(null);
  const letterBody = finalText || generated.content;

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">Buat Surat Lamaran Kerja</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-500">
        Pilih format, isi formulir, dan surat akan tersusun otomatis. Semua teks hasil tetap bisa kamu edit.
      </p>

      {/* Template picker */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5" role="radiogroup" aria-label="Format surat lamaran">
        {COVER_LETTER_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={form.templateId === t.id}
            onClick={() => set('templateId', t.id as CoverLetterTemplateId)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              form.templateId === t.id
                ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-100'
                : 'border-ink-200 bg-white hover:bg-ink-50'
            }`}
          >
            <p className="text-sm font-bold text-ink-900">{t.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{t.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <Fieldset title="Data Surat" description="Informasi dasar surat lamaran.">
            <div className="grid gap-4 sm:grid-cols-2">
              {FIELDS.map((f) => {
                const value = (form[f.key] as string) ?? '';
                const common = {
                  name: f.key,
                  value,
                  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(f.key, e.target.value.slice(0, f.textarea ? 600 : 200)),
                  placeholder: f.placeholder,
                };
                return f.textarea ? (
                  <Textarea key={f.key} label={f.label} optional={f.optional} hint={f.hint} className="sm:col-span-2" {...common} />
                ) : (
                  <Input key={f.key} label={f.label} optional={f.optional} hint={f.hint} type={f.key === 'date' ? 'date' : 'text'} {...common} />
                );
              })}
            </div>
          </Fieldset>

          <div className="flex flex-wrap gap-2">
            <Button onClick={buildLetter}>
              <Wand2 className="h-4 w-4" aria-hidden /> Buat Surat
            </Button>
            <Button variant="outline" onClick={copyText}>
              <Copy className="h-4 w-4" aria-hidden /> Salin Teks
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
              <Printer className="h-4 w-4" aria-hidden /> {isPrinting ? 'Menyiapkan...' : 'Cetak Surat'}
            </Button>
            <Button variant="outline" onClick={() => void handleDownloadPdf()} disabled={isExporting}>
              <FileDown className="h-4 w-4" aria-hidden /> {isExporting ? 'Menyiapkan PDF...' : 'Unduh PDF'}
            </Button>
            <Button variant="outline" onClick={saveDraft}>
              <Save className="h-4 w-4" aria-hidden /> Simpan Draft
            </Button>
            <Button variant="ghost" onClick={() => setShowDeleteModal(true)} className="text-error-600 hover:bg-error-50">
              <Trash2 className="h-4 w-4" aria-hidden /> Hapus Draft
            </Button>
            <span className="ml-auto self-center text-xs text-ink-400" role="status">
              {draftStatus === 'saving' ? 'Menyimpan...' : draftStatus === 'saved' ? 'Tersimpan' : ''}
            </span>
          </div>

          {/* Editable result */}
          <Fieldset title="Hasil Surat" description="Hasil otomatis dari formulir. Bisa diedit langsung di sini.">
            <Textarea
              label="Teks surat"
              name="letter-body"
              value={finalText || ''}
              onChange={(e) => set('body', e.target.value)}
              className="min-h-[320px] font-mono text-[13px]"
              hint="Klik Buat Surat untuk menyusun ulang dari formulir. Edit manual akan tetap dipakai."
            />
          </Fieldset>
        </div>

        {/* Preview */}
        <div>
          <div className="lg:sticky lg:top-24">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">Preview</h2>
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-10">
              <div className="text-sm leading-relaxed text-ink-800">
                <LetterPreview text={letterBody} subject={generated.subject} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={(el) => { if (el) pdfHostRef.current = el; }} style={{ position: 'fixed', left: '-10000px', top: 0 }} aria-hidden>
        <LetterPrintDocument text={letterBody} subject={generated.subject} />
      </div>

      {isPrinting && (
        <PrintPortal>
          <LetterPrintDocument text={letterBody} subject={generated.subject} />
        </PrintPortal>
      )}

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Draft Surat?"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Batal</Button>
            <Button onClick={deleteDraft} className="bg-error-500 hover:bg-error-600 focus-visible:outline-error-600">Hapus Permanen</Button>
          </>
        }
      >
        <p>Draft surat lamaran yang tersimpan di perangkat ini akan dihapus permanen. Data CV tidak akan terhapus.</p>
      </Modal>
    </div>
  );
}

function LetterPreview({ text, subject }: { text: string; subject?: string }) {
  if (!text.trim()) {
    return <p className="text-ink-400">Isi formulir di sebelah kiri, lalu klik "Buat Surat" untuk melihat hasilnya di sini.</p>;
  }
  return (
    <div className="whitespace-pre-line">
      {subject && <p className="mb-3 font-bold">{subject}</p>}
      {text}
    </div>
  );
}

function LetterPrintDocument({ text, subject }: { text: string; subject?: string }) {
  return (
    <div className="cv-page bg-white px-[25mm] py-[20mm] text-[12pt] leading-relaxed text-black" style={{ width: '210mm', minHeight: '297mm' }}>
      {subject && <p className="mb-4 font-bold">{subject}</p>}
      <div className="whitespace-pre-line">{text}</div>
    </div>
  );
}
