import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal (opacity + 14px rise, 480ms, one curve). Fires once.
 * Stagger = index * 60ms, capped at 360ms so nothing ever feels slow. Falls back to visible
 * without IntersectionObserver; reduced-motion + print are handled in CSS.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, lift = false, style, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (seen) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return <Tag ref={ref} style={{ '--d': `${Math.min(delay, 360)}ms`, ...style }} className={`rv ${seen ? 'in' : ''} ${lift ? 'lift' : ''} ${className}`} {...rest}>{children}</Tag>;
}
