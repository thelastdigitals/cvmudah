import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Renders children at true A4 width (210mm) and scales them down to fit
 * the available container width, so previews never overflow on mobile.
 * The wrapper height follows the scaled height to keep document flow tight.
 */
export function A4Scaler({ children, maxWidth }: { children: ReactNode; maxWidth?: number }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const natural = inner.offsetWidth || 1;
      const available = maxWidth ? Math.min(outer.clientWidth, maxWidth) : outer.clientWidth;
      const s = Math.min(1, available / natural);
      setScale(s);
      setHeight(inner.offsetHeight * s);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [maxWidth]);

  return (
    <div ref={outerRef} className="relative w-full" style={{ height }}>
      <div
        ref={innerRef}
        aria-hidden={false}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '210mm',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
