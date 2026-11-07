import { FilterX } from 'lucide-react';

/** filters: [{ key, label, type: 'select' | 'date', options?: [{value,label}] }] */
export default function FilterBar({ filters, values, onChange, onReset }) {
  return (
    <div className="card !p-4 flex flex-wrap items-end gap-4" role="search" aria-label="Filters">
      {filters.map((f) => (
        <label key={f.key} className="min-w-[12rem] flex-1">
          <span className="label">{f.label}</span>
          {f.type === 'date'
            ? <input type="date" className="field" value={values[f.key] || ''} onChange={(e) => onChange(f.key, e.target.value)} />
            : <select className="field" value={values[f.key] || ''} onChange={(e) => onChange(f.key, e.target.value)}>
                {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>}
        </label>
      ))}
      <button type="button" className="btn-secondary" onClick={onReset}><FilterX size={20} aria-hidden="true" /> Reset</button>
    </div>
  );
}
