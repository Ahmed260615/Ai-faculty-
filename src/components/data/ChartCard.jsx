import { useId } from 'react';

/** Card frame for a chart. `summary` is a text alternative announced to assistive tech. */
export default function ChartCard({ title, subtitle, summary, height = 300, children, right }) {
  const id = useId();
  return (
    <section className="card" aria-labelledby={id}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div><h3 id={id}>{title}</h3>{subtitle && <p className="text-sm text-muted">{subtitle}</p>}</div>{right}
      </div>
      <div style={{ height }} role="img" aria-label={`${title}. ${summary || ''}`}>{children}</div>
    </section>
  );
}
