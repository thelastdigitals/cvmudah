import { DEMO_CV } from '@/lib/cvData';
import { CVDocument } from './CVDocument';
import { TEMPLATE_CATALOG } from '@/types/cv';

/** Static HTML/CSS thumbnail of a template using demo data, no external images. */
export function TemplateThumb({ templateId }: { templateId: string }) {
  const demo: typeof DEMO_CV = {
    ...DEMO_CV,
    templateId: templateId as typeof DEMO_CV.templateId,
  };
  return (
    <div
      className="pointer-events-none relative h-44 w-full overflow-hidden rounded-t-2xl border-b border-ink-200 bg-ink-100"
      aria-hidden
    >
      <div className="absolute left-1/2 top-4 w-[620px] -translate-x-1/2">
        <div style={{ transform: 'scale(0.62)', transformOrigin: 'top center' }}>
          <CVDocument cv={demo} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 to-transparent" />
    </div>
  );
}

export function TemplateCard({
  meta,
  onUse,
  onPreview,
  active,
}: {
  meta: (typeof TEMPLATE_CATALOG)[number];
  onUse: () => void;
  onPreview?: () => void;
  active?: boolean;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-shadow hover:shadow-lift ${
        active ? 'border-brand-600 ring-2 ring-brand-100' : 'border-ink-200'
      }`}
    >
      <TemplateThumb templateId={meta.id} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-ink-900">{meta.name}</h3>
          {active && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">Aktif</span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-600">{meta.category}</span>
          {meta.atsFriendly && (
            <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">
              ATS-friendly
            </span>
          )}
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{meta.description}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onUse}
            className="flex-1 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Gunakan Template
          </button>
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Lihat Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
