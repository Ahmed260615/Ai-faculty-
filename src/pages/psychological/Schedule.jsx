import { useMemo } from 'react';
import { Check, Circle, Clock, FlaskConical } from 'lucide-react';
import Reveal from '../../components/ui/Reveal';
import PhotoStrip from '../../components/ui/PhotoStrip';
import PageHeader from '../../components/ui/PageHeader';
import useNow from '../../hooks/useNow';
import useLocalStorage from '../../hooks/useLocalStorage';
import { PSYCH_TABS } from './tabs';
import { pad } from '../../lib/format';
import { dayKey } from '../../services/mock/db';

/** Proposed mission schedule — NOT a mandatory NASA-approved protocol. */
const T = { work: ['Work', '', '#8C928E'], exercise: ['Exercise', '', '#34D382'], meal: ['Meal', '', '#C5CBC6'], medical: ['Medical check', '', '#7DE8AA'], rest: ['Rest & social', '', '#5F6661'], sleep: ['Sleep', '', '#454B47'] };
const RAW = [
  ['06:00', '06:30', 'Wake Up & Morning Health Check', 'medical'], ['06:30', '07:15', 'Breakfast', 'meal'], ['07:15', '09:15', 'Scientific Work', 'work'],
  ['09:15', '09:30', 'Healthy Snack', 'meal'], ['09:30', '11:15', 'Work & Environmental Monitoring', 'work'], ['11:15', '12:30', 'Resistance Training', 'exercise'],
  ['12:30', '13:15', 'Lunch', 'meal'], ['13:15', '15:15', 'Scientific Work', 'work'], ['15:15', '15:45', 'Medical Assessment', 'medical'],
  ['15:45', '17:00', 'Aerobic Training', 'exercise'], ['17:00', '17:30', 'Recovery & Personal Hygiene', 'rest'], ['17:30', '18:15', 'Dinner', 'meal'],
  ['18:15', '19:00', 'Relaxation & Social Communication', 'rest'], ['19:00', '20:45', 'Work & Daily Evaluation', 'work'], ['20:45', '21:30', 'Sleep Preparation', 'rest'], ['21:30', '06:00', 'Sleep', 'sleep'],
];
const mins = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const ACT = RAW.map(([s, e, name, type], i) => ({ id: i, s: mins(s), e: mins(e) <= mins(s) ? mins(e) + 1440 : mins(e), start: s, end: e, name, type }));
const fmtDur = (m) => `${Math.floor(m / 60) ? Math.floor(m / 60) + ' h ' : ''}${m % 60} min`;

export default function Schedule() {
  const now = useNow(15000);
  const [done, setDone] = useLocalStorage(`astrohealth.schedule.${dayKey()}`, []);
  // minutes since 06:00 day start so the overnight sleep block is continuous
  const cur = ((now.getHours() * 60 + now.getMinutes()) - 360 + 1440) % 1440 + 360;
  const idx = ACT.findIndex((a) => cur >= a.s && cur < a.e);
  const current = ACT[idx], next = ACT[(idx + 1) % ACT.length];
  const pct = Math.round((done.length / ACT.length) * 100);
  const state = (a) => (done.includes(a.id) ? 'done' : a.id === current?.id ? 'now' : a.e <= cur ? 'past' : 'upcoming');
  const toggle = (id) => setDone(done.includes(id) ? done.filter((x) => x !== id) : [...done, id]);
  const total = useMemo(() => ACT.reduce((a, b) => a + (b.e - b.s), 0), []);

  return (
    <>
      <PageHeader eyebrow="Psychological health" counter="04 / 07" hero="psychological" accent="#7A6FB0" title="Daily Schedule" ar="الجدول اليومي" tabs={PSYCH_TABS}
        subtitle="A proposed 24-hour mission routine. This is an example schedule, not a mandatory or NASA-approved protocol." />
      <PhotoStrip items={['quarters-wide', 'meal', 'cupola-crew']} />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card border-t-8 border-primary"><p className="font-semibold text-muted">Current activity</p><p className="mt-1 text-2xl font-bold">{current.name}</p><p className="font-mono text-lg">{current.start} – {current.end}</p></div>
        <div className="card"><p className="font-semibold text-muted">Next activity</p><p className="mt-1 text-2xl font-bold">{next.name}</p><p className="font-mono text-lg">at {next.start}</p></div>
        <div className="card"><p className="font-semibold text-muted">Remaining in current activity</p><p className="mt-1 font-mono text-4xl font-semibold">{fmtDur(current.e - cur)}</p></div>
        <div className="card"><p className="font-semibold text-muted">Daily completion</p><p className="mt-1 font-mono text-4xl font-semibold">{pct}%</p>
          <div className="mt-2 h-3 rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Daily completion"><div className="h-3 rounded-full bg-ok" style={{ width: `${pct}%`, transition: 'width 600ms var(--ease)' }} /></div>
          <p className="mt-1 text-sm text-muted">{done.length} of {ACT.length} activities marked complete</p></div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3" aria-label="Legend">{Object.values(T).map(([l, bg, fg]) => <span key={l} className="inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-semibold" style={{ background: fg + '24', borderColor: fg }}><span className="h-3 w-3 rounded-full" style={{ background: fg }} />{l}</span>)}</div>

      <ol className="relative space-y-3" aria-label="Daily timeline">
        {ACT.map((a) => {
          const st = state(a); const [label, bg, fg] = T[a.type]; const isNow = st === 'now';
          return (
            <Reveal as="li" delay={Math.min(a.id * 40, 240)} key={a.id}>
              {isNow && <div className="mb-2 flex items-center gap-3 text-crit-dark font-bold" aria-label="Current time indicator"><span className="h-0.5 flex-1 bg-crit" /><span className="inline-flex items-center gap-1.5 rounded-full bg-crit-dark px-3 py-1 text-white"><Clock size={18} aria-hidden="true" />NOW {pad(now.getHours())}:{pad(now.getMinutes())}</span><span className="h-0.5 flex-1 bg-crit" /></div>}
              <div className={`flex flex-wrap items-center gap-4 rounded-xl border-2 p-4 sm:p-5 ${isNow ? 'shadow-lg ring-4 ring-primary/30' : ''} ${st === 'done' ? 'opacity-70' : ''}`} style={{ background: fg + '24', borderColor: isNow ? '#34D382' : fg + '66', borderLeft: `10px solid ${fg}` }}>
                <p className="w-40 shrink-0 font-mono text-xl font-semibold">{a.start} – {a.end}</p>
                <div className="min-w-0 flex-1 basis-56">
                  <p className={`text-xl font-bold ${st === 'done' ? 'line-through' : ''}`}>{a.name}</p>
                  <p className="text-ink/90">{label} · {fmtDur(a.e - a.s)} · <strong>{{ done: 'Completed', now: 'In progress', past: 'Time passed — not marked', upcoming: 'Upcoming' }[st]}</strong></p>
                </div>
                <button type="button" className={st === 'done' ? 'btn-primary' : 'btn-secondary'} aria-pressed={st === 'done'} onClick={() => toggle(a.id)}>
                  {st === 'done' ? <Check size={22} aria-hidden="true" /> : <Circle size={22} aria-hidden="true" />}{st === 'done' ? 'Completed' : 'Mark complete'}</button>
              </div>
            </Reveal>);
        })}
      </ol>
      <p className="mt-4 flex items-center gap-2 text-muted"><FlaskConical size={18} aria-hidden="true" /> Completion marks are stored on this device only. Timeline covers {total / 60} hours.</p>
    </>
  );
}
