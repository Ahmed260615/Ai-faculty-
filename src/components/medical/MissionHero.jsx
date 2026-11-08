import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Move3d } from 'lucide-react';
import HealthOrbit3D from '../hero/HealthOrbit3D';
import RiskBadge from '../ui/RiskBadge';
import Eyebrow from '../ui/Eyebrow';
import { useAstronaut } from '../../context/AstronautContext';
import { statusOf } from '../../config/status';
import { ago } from '../../lib/format';

const ORDER = ['overall', 'radiation', 'cardio', 'bone', 'muscle', 'psych', 'resp'];
const ROUTE = { overall: '/reports', radiation: '/radiation', cardio: '/gravity', bone: '/gravity', muscle: '/gravity/exercises', psych: '/psychological/assessment', resp: '/nutrition/respiration' };
const TITLE = { overall: 'Overall Health', radiation: 'Radiation', cardio: 'Cardiovascular', bone: 'Bone', muscle: 'Muscle', psych: 'Psychological', resp: 'Respiratory' };

/** Immersive 3D hero. Real health statuses drive orb colour; every orb is also a labelled button. */
export default function MissionHero({ onStart, summary }) {
  const { profile: p } = useAstronaut();
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const domains = useMemo(() => ORDER.map((k) => { const s = summary?.find((x) => x.key === k); return { key: k, title: TITLE[k], status: s?.status || 'UNKNOWN', value: s?.value, unit: s?.unit, trend: s?.trendText, updated: s?.updated, to: ROUTE[k] }; }), [summary]);
  const cur = domains[index], st = statusOf(cur.status);
  const pct = p ? Math.round((p.missionDay / p.missionDays) * 100) : 0;
  const go = (d) => setIndex((index + d + domains.length) % domains.length);

  return (
    <section aria-labelledby="hero-h" className="reveal relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-black text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(40rem 28rem at 78% 40%, rgba(47,207,124,.20), transparent 70%), radial-gradient(30rem 24rem at 8% 100%, rgba(150,156,152,.14), transparent 70%)' }} />
      <div className="relative grid lg:grid-cols-5">
        <div className="z-10 p-6 sm:p-10 lg:col-span-2 lg:pr-0">
          <Eyebrow className="!text-slate-300" dot right={p ? `${String(p.missionDay).padStart(3, '0')} / ${p.missionDays}` : undefined}>Mission day</Eyebrow>
          <h1 id="hero-h" className="mt-6 !text-4xl sm:!text-5xl">Crew health,<br /><span className="text-secondary">at a glance.</span></h1>
          <p className="mt-5 max-w-md text-lg text-slate-300">Physical, psychological and environmental readings for the current crew member, with AI-assisted risk assessments and stored medical reports.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <button type="button" className="btn-light !min-h-[3.5rem] px-7 text-lg" onClick={onStart}>Start assessment <ArrowUpRight size={20} aria-hidden="true" /></button>
            <Link to="/reports" className="arrow-link !text-white !border-white/40 hover:!border-white">Explore reports<ArrowUpRight size={20} aria-hidden="true" /></Link>
          </div>
          <div className="mt-10 max-w-md border-t border-white/15 pt-4">
            <div className="flex justify-between text-slate-300"><span>Mission progress</span><span className="font-mono">{pct}%</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Mission progress"><div className="grow h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
        <div className="relative h-[27rem] sm:h-[30rem] lg:col-span-3 lg:h-auto lg:min-h-[36rem]">
          <HealthOrbit3D domains={domains} index={index} auto={auto} onPick={setIndex} />
          <p className="pointer-events-none absolute bottom-3 left-5 hidden items-center gap-2 text-sm text-slate-300 sm:flex"><Move3d size={18} aria-hidden="true" /> Drag to rotate · Tap an orb</p>
          <p className="pointer-events-none absolute bottom-3 right-5 font-mono text-sm text-slate-300" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(domains.length).padStart(2, '0')}</p>
          <div className="glass absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1 rounded-full p-1" role="group" aria-label="3D view controls">
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/10" onClick={() => go(-1)} aria-label="Previous domain"><ChevronLeft size={24} aria-hidden="true" /></button>
            <button type="button" className="flex min-h-12 items-center gap-2 rounded-full px-4 font-semibold hover:bg-white/10" onClick={() => setAuto(!auto)} aria-pressed={!auto}>{auto ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}{auto ? 'Pause' : 'Rotate'}</button>
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/10" onClick={() => go(1)} aria-label="Next domain"><ChevronRight size={24} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <div className="relative grid gap-4 border-t border-white/10 p-4 sm:p-6 lg:grid-cols-5">
        <div key={cur.key} className="pop rounded-2xl border border-white/10 bg-white/[.05] p-5 backdrop-blur-xl lg:col-span-2" aria-live="polite" style={{ boxShadow: `0 0 50px -28px ${st.hex}` }}>
          <div className="flex items-start justify-between gap-3"><p className="eyebrow !text-slate-300">{String(index + 1).padStart(2, '0')} · Selected</p><RiskBadge level={cur.status} size="sm" /></div>
          <p className="mt-2 text-2xl font-semibold" style={{ letterSpacing: '-0.02em' }}>{cur.title}</p>
          <p className="mt-1 font-mono text-3xl">{cur.value ?? '—'} <span className="font-sans text-base text-slate-300">{cur.unit}</span></p>
          <p className="mt-1 text-slate-300">{cur.trend || 'No trend data'}{cur.updated ? ` · updated ${ago(cur.updated)}` : ''}</p>
          <Link to={cur.to} className="arrow-link !text-white !border-white/40 hover:!border-white mt-2">Open {cur.title}<ArrowUpRight size={20} aria-hidden="true" /></Link>
        </div>
        <div className="flex flex-wrap content-start gap-2 lg:col-span-3" role="group" aria-label="Health domains">
          {domains.map((d, i) => { const s = statusOf(d.status), Icon = s.icon; return (
            <button key={d.key} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}
              className={`inline-flex min-h-[3rem] items-center gap-2 rounded-full border px-4 font-semibold transition-colors ${i === index ? 'border-white bg-white text-slate-900' : 'border-white/20 text-white hover:bg-white/10'}`}>
              <Icon size={18} aria-hidden="true" style={{ color: i === index ? undefined : s.hex }} />{d.title}<span className="text-sm font-medium opacity-80">· {s.label}</span></button>); })}
        </div>
      </div>
    </section>
  );
}
