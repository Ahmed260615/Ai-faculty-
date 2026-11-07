import { CloudOff, Clock, RotateCw } from 'lucide-react';
export default function ErrorState({ error, onRetry, title }) {
  const timeout = error?.kind === 'timeout';
  const Icon = timeout ? Clock : CloudOff;
  return (
    <div role="alert" className="rounded-xl border-2 border-crit bg-crit-bg p-6 flex flex-col sm:flex-row gap-4 items-start">
      <Icon size={36} className="text-crit-dark shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-xl font-bold text-crit-dark">{title || (timeout ? 'The request timed out' : 'Something went wrong')}</p>
        <p className="mt-1">{error?.message || 'The service could not be reached.'}{error?.status ? ` (HTTP ${error.status})` : ''}</p>
        <p className="mt-1 text-muted">Your entries are kept. No result has been saved.</p>
      </div>
      {onRetry && <button type="button" className="btn-danger" onClick={onRetry}><RotateCw size={20} aria-hidden="true" /> Retry</button>}
    </div>
  );
}
