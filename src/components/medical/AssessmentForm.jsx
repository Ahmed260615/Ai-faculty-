import { useEffect, useRef } from 'react';
import { Send, Info } from 'lucide-react';
import MedicalInput from './MedicalInput';

export default function AssessmentForm({ config, values, errors, onChange, onSubmit, submitLabel = 'Submit Measurements', busy, children }) {
  const summary = useRef(null);
  const errKeys = Object.keys(errors);
  useEffect(() => { if (errKeys.length) summary.current?.focus(); }, [errKeys.length]); // eslint-disable-line
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate className="space-y-6">
      {errKeys.length > 0 && (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded-xl border-2 border-crit bg-crit-bg p-4">
          <p className="font-bold text-crit-dark">Please correct {errKeys.length} field{errKeys.length > 1 ? 's' : ''} before submitting:</p>
          <ul className="mt-1 list-disc pl-6">{errKeys.map((k) => <li key={k}>{errors[k]}</li>)}</ul>
        </div>
      )}
      {config.groups.map((g) => (
        <section key={g.id} className="card" aria-labelledby={`g-${g.id}`}>
          <h2 id={`g-${g.id}`} className="flex flex-wrap items-baseline gap-x-3">{g.title}{g.ar && <span lang="ar" dir="rtl" className="arabic text-xl text-muted">{g.ar}</span>}</h2>
          {g.note && <p className="mt-3 flex gap-2 rounded-xl bg-primary-light p-3 text-ink"><Info size={22} className="mt-0.5 shrink-0 text-primary-dark" aria-hidden="true" />{g.note}</p>}
          <div className="mt-5 grid gap-x-6 gap-y-5 md:grid-cols-2">
            {g.fields.map((f) => <MedicalInput key={f.key} field={f} value={values[f.key]} error={errors[f.key]} onChange={onChange} />)}
          </div>
        </section>
      ))}
      {children}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary !min-h-[3.5rem] text-lg px-8" disabled={busy}><Send size={22} aria-hidden="true" /> {submitLabel}</button>
        <p className="text-muted">Fields marked * are required. Measurements are sent to the Express API for analysis.</p>
      </div>
    </form>
  );
}
