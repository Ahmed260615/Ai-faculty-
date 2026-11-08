import Photo from './Photo';
import Reveal from './Reveal';

/** Row of 2–3 context photos. Purely visual context — each has real alt text. */
export default function PhotoStrip({ items, ratio = 'aspect-[16/9]', className = '' }) {
  const cols = items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';
  return (
    <div className={`mb-6 grid grid-cols-1 gap-4 ${cols} ${className}`}>
      {items.map((n, i) => (
        <Reveal key={n} lift delay={i * 80} className="card !p-0 overflow-hidden"><Photo name={n} ratio={ratio} /></Reveal>
      ))}
    </div>
  );
}
