import { statusOf } from '../../config/status';
import { ICONS } from '../../lib/icons';
import { fmtDateTime } from '../../lib/format';
import StatusInline from './StatusInline';
import Reveal from '../ui/Reveal';

export default function MeasurementCard({ label, value, unit, reference, status = 'UNKNOWN', time, icon = 'plain', big, delay = 0 }) {
  const s = statusOf(status); const Icon = ICONS[icon] || ICONS.plain;
  const has = value !== undefined && value !== null && value !== '';
  return (
    <Reveal lift delay={delay} className={`card !p-4 sm:!p-5 border-l-8 ${s.border}`} role="group" aria-label={label}>
      <div className="flex items-center gap-2 text-muted font-semibold"><Icon size={24} aria-hidden="true" className="text-primary shrink-0" /><span>{label}</span></div>
      <p className={`mt-2 font-mono font-semibold ${big ? 'text-5xl' : 'text-4xl'}`}>
        {has ? value : '—'} {has && unit && <span className="text-lg font-sans font-medium text-muted">{unit}</span>}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        {has ? <StatusInline status={status} /> : <span className="text-muted">No reading recorded</span>}
        {reference && <span className="text-muted">Ref {reference}</span>}
      </div>
      {time && <p className="mt-1 text-sm text-muted">Last recorded {fmtDateTime(time)}</p>}
    </Reveal>
  );
}
