import { UserRound } from 'lucide-react';
import RiskBadge from '../ui/RiskBadge';
import { useAstronaut } from '../../context/AstronautContext';
import { fmtDateTime } from '../../lib/format';

export default function AstronautProfile({ compact }) {
  const { profile: p } = useAstronaut();
  if (!p) return <div className="text-sm opacity-70">Loading profile…</div>;
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:grid h-11 w-11 place-items-center rounded-full bg-primary-light text-primary-dark"><UserRound size={24} aria-hidden="true" /></span>
        <div className="hidden md:block leading-tight"><p className="font-bold">{p.id}</p><p className="text-sm text-muted">Mission day {p.missionDay}</p></div>
        <RiskBadge level={p.status} size="sm" />
      </div>
    );
  }
  const pct = Math.round((p.missionDay / p.missionDays) * 100);
  return (
    <section aria-label="Astronaut profile" className="rounded-xl bg-sidebar-2 p-4 text-white">
      <p className="text-sm text-secondary font-semibold">Astronaut ID</p>
      <p className="font-bold text-lg">{p.id}</p>
      <p className="mt-3 text-sm text-secondary font-semibold">Mission day</p>
      <p className="font-semibold">Day {p.missionDay} of {p.missionDays}</p>
      <div className="mt-2 h-2 rounded-full bg-white/20" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Mission duration"><div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
      <p className="mt-3 text-sm text-secondary font-semibold">Overall health</p>
      <div className="mt-1"><RiskBadge level={p.status} size="sm" /></div>
      <p className="mt-3 text-sm text-secondary font-semibold">Last medical assessment</p>
      <p className="text-sm">{fmtDateTime(p.lastAssessment)}</p>
    </section>
  );
}
