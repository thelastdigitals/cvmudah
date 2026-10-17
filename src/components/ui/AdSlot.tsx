const client = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

/**
 * Google AdSense placeholder. Disabled by default - renders nothing until
 * VITE_ADSENSE_CLIENT_ID and a slot id are configured.
 */
export function AdSlot({ slotId, className = '' }: { slotId?: string; className?: string }) {
  if (!client || !slotId) return null;
  return (
    <div className={`my-8 overflow-hidden rounded-2xl ${className}`} aria-label="Iklan">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
