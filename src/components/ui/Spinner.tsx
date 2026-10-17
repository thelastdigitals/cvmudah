export function Spinner({ label = 'Memuat', className = '' }: { label?: string; className?: string }) {
  return (
    <div role="status" className={`flex flex-col items-center gap-3 ${className}`}>
      <span
        className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600"
        aria-hidden
      />
      <span className="text-sm text-ink-500">{label}...</span>
    </div>
  );
}
