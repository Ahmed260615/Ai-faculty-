import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RiskBadge from '../ui/RiskBadge';
import Eyebrow from '../ui/Eyebrow';
import { useAstronaut } from '../../context/AstronautContext';
import { fmtDateTime } from '../../lib/format';

/** Dark mission panel (dark/light section rhythm) with two-tone headline and orbital detail. */
export default function MissionHero({ onStart }) {
  const { profile: p } = useAstronaut();
  const pct = p ? Math.round((p.missionDay / p.missionDays) * 100) : 0;
  return (
    <section aria-labelledby="hero-h" className="reveal relative mb-8 overflow-hidden rounded-3xl bg-sidebar p-6 text-white sm:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true"><svg className="absolute -right-24 -top-24 h-[28rem] w-[28rem] opacity-40" viewBox="0 0 400 400" fill="none" aria-hidden="true">
        {[60, 110, 160, 200].map((r) => <circle key={r} cx="200" cy="200" r={r} stroke="#7FA9B9" strokeOpacity=".35" />)}
        <circle cx="200" cy="40" r="7" fill="#8CA9A1" /><circle cx="340" cy="270" r="5" fill="#7FA9B9" /><circle cx="95" cy="300" r="4" fill="#3C7896" />
      </svg></div>
      <div className="relative grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Eyebrow className="!text-slate-300" dot right={p ? `${String(p.missionDay).padStart(3, '0')} / ${p.missionDays}` : undefined}>Mission day</Eyebrow>
          <h1 id="hero-h" className="mt-6 !text-4xl sm:!text-5xl">Crew health,<br /><span className="text-secondary">at a glance.</span></h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">Physical, psychological and environmental readings for the current crew member, with AI-assisted risk assessments and stored medical reports.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <button type="button" className="btn-light !min-h-[3.5rem] px-7 text-lg" onClick={onStart}>Start assessment <ArrowUpRight size={20} aria-hidden="true" /></button>
            <Link to="/reports" className="arrow-link !text-white !border-white/40 hover:!border-white">Explore reports<ArrowUpRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>
        <dl className="relative lg:col-span-2 self-end">
          {[['Overall health', p ? <RiskBadge level={p.status} /> : '—'], ['Astronaut', p?.id || '—'], ['Last medical assessment', p ? fmtDateTime(p.lastAssessment) : '—']].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 border-t border-white/15 py-4"><dt className="text-slate-300">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>))}
          <div className="border-t border-white/15 pt-4">
            <div className="flex justify-between text-slate-300"><span>Mission progress</span><span className="font-mono">{pct}%</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-white/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Mission progress"><div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
          </div>
        </dl>
      </div>
    </section>
  );
}
