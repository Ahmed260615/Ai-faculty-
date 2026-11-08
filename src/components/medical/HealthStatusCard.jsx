import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ICONS } from '../../lib/icons';
import RiskBadge from '../ui/RiskBadge';
import { statusOf } from '../../config/status';
import { ago } from '../../lib/format';
import Reveal from '../ui/Reveal';

const TREND = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus };
export default function HealthStatusCard({ title, icon, value, unit, status, trend = 'flat', trendText, updated, delay = 0 }) {
  const Icon = ICONS[icon] || ICONS.plain; const T = TREND[trend] || Minus; const s = statusOf(status);
  return (
    <Reveal as="article" lift delay={delay} style={{ boxShadow: `0 0 0 1px transparent` }} className={`card h-full border-t-8 ${s.border} flex flex-col gap-3`} aria-label={`${title}: ${value} ${unit || ''}, ${s.label}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-light text-primary-dark"><Icon size={26} aria-hidden="true" /></span>
        <RiskBadge level={status} size="sm" />
      </div>
      <h3 className="text-lg text-muted font-semibold">{title}</h3>
      <p className="font-mono text-4xl font-semibold leading-none">{value} {unit && <span className="mt-1 block text-base font-sans font-medium text-muted">{unit}</span>}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1 font-semibold text-ink"><T size={18} aria-hidden="true" /> {trendText}</span>
        <span>Updated {updated ? ago(updated) : '—'}</span>
      </div>
    </Reveal>
  );
}
