import { useMemo, useState } from 'react';
import { Activity, Dumbbell, Footprints, Bike, HeartPulse, PersonStanding, Move, Scale, Play, ShieldAlert, Info, FilterX, Zap } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Photo from '../../components/ui/Photo';
import Reveal from '../../components/ui/Reveal';
import EmptyState from '../../components/ui/EmptyState';
import DemoBadge from '../../components/ui/DemoBadge';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { EXERCISES, MUSCLES, OBJECTIVES, TYPES } from '../../data/exercises';

const ICON = { squat: PersonStanding, deadlift: Dumbbell, press: Dumbbell, band: Activity, run: Footprints, bike: Bike, heart: HeartPulse, mobility: Move, coord: Move, balance: Scale, stretch: PersonStanding };
const STYLE = {
  'Resistance Training': { bg: 'linear-gradient(135deg,#4B514D,#1C1F1D)', tag: 'bg-violet/15 text-violet-text border-violet', Icon: Dumbbell },
  'Aerobic Training': { bg: 'linear-gradient(135deg,#1F9D5C,#0B3D24)', tag: 'bg-ok-bg text-ok-dark border-ok', Icon: HeartPulse },
  'Mobility & Balance': { bg: 'linear-gradient(135deg,#7D847F,#2A2E2B)', tag: 'bg-primary-light text-primary-dark border-primary', Icon: Move },
};
const EMPTY = { muscle: '', type: '', difficulty: '', objective: '' };

function Illustration({ ex, big }) {
  return <Photo name={ex.photo} ratio={big ? 'aspect-video' : 'aspect-[16/10]'} caption={false} className={big ? 'rounded-xl' : ''} />;
}

export default function Exercises() {
  const [f, setF] = useState(EMPTY);
  const [open, setOpen] = useState(null);
  const [demo, setDemo] = useState(null);
  const list = useMemo(() => EXERCISES.filter((x) => (!f.muscle || x.muscles.includes(f.muscle)) && (!f.type || x.type === f.type) && (!f.difficulty || x.difficulty === f.difficulty) && (!f.objective || x.objective === f.objective)), [f]);
  const sel = (key, label, options) => (
    <label className="min-w-[12rem] flex-1"><span className="label">{label}</span>
      <select className="field" value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}><option value="">All</option>{options.map((o) => <option key={o}>{o}</option>)}</select></label>);
  return (
    <>
      <PageHeader eyebrow="Gravity effects" counter="05 / 07" hero="gravity" accent="#7A6FB0" title="Exercise Programs" ar="التمارين" tabs={[{ to: '/gravity', end: true, label: 'Assessment & Decision · الاختبار والقرار' }, { to: '/gravity/exercises', label: 'Exercise Programs · التمارين' }]}
        subtitle="Exercise library for microgravity conditioning."><DemoBadge>Demo content</DemoBadge></PageHeader>
      <p className="mb-5 flex gap-3 rounded-xl border-2 border-warn bg-warn-bg p-4 font-semibold text-warn-dark"><ShieldAlert size={26} className="shrink-0" aria-hidden="true" />These are example exercises. Programmes must be prescribed and medically supervised for each astronaut — they are not universal prescriptions.</p>
      <div className="mb-3 flex flex-wrap gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card" role="search" aria-label="Exercise filters">
        {sel('type', 'Exercise Type', TYPES)}{sel('muscle', 'Muscle Group', MUSCLES)}{sel('difficulty', 'Difficulty', ['Beginner', 'Intermediate', 'Advanced'])}{sel('objective', 'Health Objective', OBJECTIVES)}
        <button className="btn-secondary self-end" onClick={() => setF(EMPTY)}><FilterX size={20} aria-hidden="true" /> Reset</button>
      </div>
      <div className="mb-5 flex flex-wrap gap-3" aria-label="Legend">{TYPES.map((t) => { const S = STYLE[t]; return <span key={t} className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-semibold ${S.tag}`}><S.Icon size={18} aria-hidden="true" />{t}</span>; })}</div>
      {list.length === 0 ? <div className="card"><EmptyState title="No exercises match these filters" action={<button className="btn-secondary" onClick={() => setF(EMPTY)}>Reset filters</button>} /></div> : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((x, i) => { const S = STYLE[x.type]; return (
            <Reveal as="article" lift delay={(i % 3) * 70} key={x.id} className="card !p-0 flex flex-col overflow-hidden">
              <Illustration ex={x} />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className={`inline-flex w-fit items-center gap-2 rounded-full border-2 px-3 py-0.5 text-sm font-bold ${S.tag}`}><S.Icon size={16} aria-hidden="true" />{x.type}</span>
                <h3>{x.name}</h3>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <dt className="text-muted">Target</dt><dd className="flex flex-wrap gap-1.5">{x.muscles.map((m) => <span key={m} className="tag">{m}</span>)}</dd>
                  <dt className="text-muted">Duration</dt><dd className="font-semibold">{x.duration}</dd>
                  <dt className="text-muted">Intensity</dt><dd className="font-semibold"><Zap className="mr-1 inline" size={16} aria-hidden="true" />{x.intensity}</dd>
                  <dt className="text-muted">Level</dt><dd className="font-semibold">{x.difficulty}</dd>
                </dl>
                <div className="mt-auto flex flex-wrap gap-2 pt-2"><button className="btn-primary flex-1" onClick={() => setOpen(x)}><Info size={20} aria-hidden="true" /> Details</button>
                  <button className="btn-secondary flex-1" onClick={() => setDemo(x)}><Play size={20} aria-hidden="true" /> Watch Demonstration</button></div>
              </div>
            </Reveal>); })}
        </div>)}
      <ConfirmationDialog open={!!open} wide title={open?.name} cancelLabel="Close" onCancel={() => setOpen(null)}>
        {open && (<div className="space-y-4"><Illustration ex={open} big />
          <p><strong>Target muscles:</strong> {open.muscles.join(', ')} · <strong>Objective:</strong> {open.objective} · <strong>Duration:</strong> {open.duration} · <strong>Intensity:</strong> {open.intensity}</p>
          <div><h3 className="mb-1">Instructions</h3><ol className="list-decimal space-y-1 pl-6">{open.instructions.map((s) => <li key={s}>{s}</li>)}</ol></div>
          <div className="rounded-xl bg-warn-bg p-4"><h3 className="mb-1 flex items-center gap-2 text-warn-dark"><ShieldAlert size={22} aria-hidden="true" /> Safety precautions</h3><ul className="list-disc space-y-1 pl-6">{open.safety.map((s) => <li key={s}>{s}</li>)}</ul></div>
          <p className="text-sm text-muted">Demonstration text — replace with the medically supervised programme.</p></div>)}
      </ConfirmationDialog>
      <ConfirmationDialog open={!!demo} wide title={`Demonstration: ${demo?.name}`} cancelLabel="Close" onCancel={() => setDemo(null)}>
        {demo && <><Illustration ex={demo} big /><p className="mt-4 rounded-xl border-2 border-dashed border-primary bg-primary-light p-3 font-semibold text-primary-dark">Demonstration placeholder — no video is connected. The approved demonstration video will play here once available.</p></>}
      </ConfirmationDialog>
    </>
  );
}
