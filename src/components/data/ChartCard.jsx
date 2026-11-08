import { useId } from 'react';
import Reveal from '../ui/Reveal';

/** Card frame for a chart. `summary` is a text alternative announced to assistive tech. */
export default function ChartCard({ title, subtitle, summary, height = 300, children, right, delay = 0 }) {
  const id = useId();
  return (
    <Reveal as="section" delay={delay} className="card h-full" aria-labelledby={id}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div><h3 id={id}>{title}</h3>{subtitle && <p className="text-sm text-muted">{subtitle}</p>}</div>{right}
      </div>
      <div style={{ height }} role="img" aria-label={`${title}. ${summary || ''}`}>{children}</div>
    </Reveal>
  );
}
