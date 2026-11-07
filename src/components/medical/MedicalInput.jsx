import { useId, useState } from 'react';
import { Pencil } from 'lucide-react';
import StatusInline from './StatusInline';
import { evaluateField, refText } from '../../lib/validate';
import { saveRange } from '../../config/ranges';
import useRanges from '../../hooks/useRanges';

/** Large, labelled input. Numeric fields show their (editable) laboratory reference and a live status flag. */
export default function MedicalInput({ field, value, error, onChange }) {
  const id = useId();
  const ranges = useRanges();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ low: '', high: '' });
  const ref = ranges[field.key] || field.ref;
  const status = field.type === 'number' ? evaluateField(field, value, ranges) : 'UNKNOWN';
  const describedBy = [error && `${id}-err`, ref && `${id}-ref`].filter(Boolean).join(' ') || undefined;
  const common = { id, 'aria-invalid': !!error, 'aria-describedby': describedBy, 'aria-required': field.required || undefined, name: field.key,
    className: `field ${error ? '!border-crit' : ''}`, value: value ?? '', onChange: (e) => onChange(field.key, e.target.value) };

  const startEdit = () => { setDraft({ low: ref?.low ?? '', high: ref?.high ?? '' }); setEditing(true); };
  const save = () => {
    const r = {}; if (draft.low !== '') r.low = Number(draft.low); if (draft.high !== '') r.high = Number(draft.high);
    saveRange(field.key, Object.keys(r).length ? r : null); setEditing(false);
  };

  return (
    <div>
      <label htmlFor={id} className="label">{field.label}{field.required && <span className="text-crit-dark" aria-hidden="true"> *</span>}</label>
      {field.type === 'select' ? (
        <select {...common}><option value="">Select…</option>{field.options.map((o) => <option key={o}>{o}</option>)}</select>
      ) : (
        <div className="relative">
          <input {...common} type={field.type === 'number' ? 'number' : field.type} inputMode={field.type === 'number' ? 'decimal' : undefined}
            step={field.step} min={field.min} max={field.max} placeholder={field.placeholder} autoComplete="off"
            className={`${common.className} ${field.unit && !field.noUnit ? 'pr-28' : ''}`} />
          {field.unit && !field.noUnit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-medium pointer-events-none">{field.unit}</span>}
        </div>
      )}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        {ref && <span id={`${id}-ref`}>Lab reference: <strong className="text-ink">{refText(ref, field.unit)}</strong>{ranges[field.key] ? ' (custom)' : ' (demo default)'}</span>}
        {field.type === 'number' && field.ref && !editing && (
          <button type="button" onClick={startEdit} className="inline-flex items-center gap-1 min-h-[2.75rem] px-2 font-semibold text-primary-dark underline"><Pencil size={16} aria-hidden="true" /> Edit range</button>
        )}
        <StatusInline status={status} />
      </div>
      {editing && (
        <div className="mt-2 flex flex-wrap items-end gap-3 rounded-xl bg-primary-light p-3">
          {['low', 'high'].map((k) => (
            <label key={k} className="text-sm font-semibold">{k === 'low' ? 'Lower limit' : 'Upper limit'}
              <input type="number" step="any" className="field !min-h-[3rem] mt-1 w-36" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
            </label>
          ))}
          <button type="button" className="btn-primary" onClick={save}>Save range</button>
          <button type="button" className="btn-secondary" onClick={() => { saveRange(field.key, null); setEditing(false); }}>Reset to default</button>
          <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 font-semibold text-crit-dark">{error}</p>}
    </div>
  );
}
