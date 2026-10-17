import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATE_CATALOG, type TemplateId } from '@/types/cv';
import { TemplateCard } from '@/components/cv/TemplateGallery';
import { CVDocument } from '@/components/cv/CVDocument';
import { A4Scaler } from '@/components/cv/A4Scaler';
import { DEMO_CV } from '@/lib/cvData';
import { cvStorage } from '@/lib/storage';
import { Modal } from '@/components/ui/Modal';
import { AdSlot } from '@/components/ui/AdSlot';
import { applySeo } from '@/lib/seo';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [previewTpl, setPreviewTpl] = useState<TemplateId | null>(null);

  useEffect(() => {
    applySeo({
      path: '/template-cv',
      title: 'Template CV Profesional Gratis | CVMudah',
      description:
        'Pilih dari enam template CV profesional: ATS-friendly, minimalis, fresh graduate, hingga desain kreatif. Semua gratis.',
    });
  }, []);

  const applyTemplate = (id: TemplateId) => {
    const stored = cvStorage.load();
    const current = stored.data;
    if (current) {
      cvStorage.save({ ...current, templateId: id });
    }
    navigate('/buat-cv', { state: { templateId: id } });
  };

  return (
    <div className="container-app py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-500">
        <a href="/" className="hover:text-brand-700">Beranda</a>
        <span aria-hidden> / </span>
        <span className="font-medium text-ink-700">Template CV</span>
      </nav>
      <h1 className="text-3xl font-bold text-ink-900">Template CV Profesional</h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Enam desain CV yang benar-benar berbeda. Pilih salah satu, lalu lanjutkan ke editor untuk mengisinya dengan
        datamu. Mengganti template tidak akan menghapus data yang sudah kamu isi.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_CATALOG.map((meta) => (
          <TemplateCard
            key={meta.id}
            meta={meta}
            onUse={() => applyTemplate(meta.id)}
            onPreview={() => setPreviewTpl(meta.id)}
          />
        ))}
      </div>

      <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TEMPLATES as string | undefined} />

      <Modal open={previewTpl !== null} onClose={() => setPreviewTpl(null)} title="Preview Template">
        {previewTpl && (
          <div className="max-h-[65vh] overflow-auto rounded-xl bg-ink-100 p-3">
            <A4Scaler maxWidth={420}>
              <CVDocument cv={{ ...DEMO_CV, templateId: previewTpl }} />
            </A4Scaler>
          </div>
        )}
      </Modal>
    </div>
  );
}
