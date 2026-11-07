/** Indeterminate loader — deliberately no percentage or fake progress. */
export default function AssessmentLoader({ phase, onCancel }) {
  return (
    <div role="status" aria-live="polite" className="card flex flex-col items-center text-center gap-5 py-12">
      <div className="relative h-28 w-28" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-secondary" />
        <div className="absolute inset-3 rounded-full bg-primary-light grid place-items-center"><div className="h-8 w-8 rounded-full bg-primary" /></div>
        <div className="orbit-spin absolute inset-0"><div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-accent" /></div>
      </div>
      <h2>Analyzing Astronaut Health Data...</h2>
      <p className="text-lg text-muted max-w-md">
        {phase === 'submitting' ? 'Sending measurements to the mission health server.' : 'Waiting for the analysis service to return its assessment. This can take a moment.'}
      </p>
      {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
    </div>
  );
}
