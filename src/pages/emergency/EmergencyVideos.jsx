import { useMemo, useState } from 'react';
import { Play, Search, Clock, HeartPulse, Wind, Bandage, Stethoscope, BriefcaseMedical, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DemoBadge from '../../components/ui/DemoBadge';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import { VIDEOS, VIDEO_CATEGORIES } from '../../data/videos';
import { EMERGENCY_TABS } from './EmergencyTests';

const CAT_ICON = { 'Cardiac Emergencies': HeartPulse, 'Respiratory Emergencies': Wind, 'Injuries and Trauma': Bandage, 'Medical Emergencies': Stethoscope, 'First Aid': BriefcaseMedical, 'Preventive Procedures': ShieldCheck };

function Thumb({ video, large }) {
  const Icon = CAT_ICON[video.category];
  return (
    <div className={`relative grid place-items-center overflow-hidden ${large ? 'aspect-video rounded-xl' : 'aspect-video'}`} style={{ background: `linear-gradient(135deg, hsl(${video.hue} 35% 32%), hsl(${video.hue} 30% 20%))` }} aria-hidden="true">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <Icon size={large ? 72 : 52} className="text-white/90" />
      <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-sm font-bold text-ink">DEMO THUMBNAIL</span>
      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 font-mono text-sm text-white">{video.duration}</span>
    </div>
  );
}

function Card({ video, onWatch }) {
  return (
    <article className="card !p-0 flex flex-col overflow-hidden">
      <Thumb video={video} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-dark">{video.category}</p>
        <h3>{video.title}</h3>
        <p className="text-muted">{video.description}</p>
        <p className="flex items-center gap-1.5 text-muted"><Clock size={18} aria-hidden="true" /> {video.duration}</p>
        <button type="button" className="btn-primary mt-auto" onClick={() => onWatch(video)}><Play size={20} aria-hidden="true" /> Watch Video</button>
      </div>
    </article>
  );
}

export default function EmergencyVideos() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [recent, setRecent] = useLocalStorage('astrohealth.recentVideos', []);
  const [open, setOpen] = useState(null);
  const list = useMemo(() => VIDEOS.filter((x) => (!cat || x.category === cat) && `${x.title} ${x.description} ${x.category}`.toLowerCase().includes(q.toLowerCase())), [q, cat]);
  const recentVideos = recent.map((id) => VIDEOS.find((x) => x.id === id)).filter(Boolean);
  const recommended = VIDEOS.filter((x) => !recent.includes(x.id)).slice(0, 3);
  const watch = (video) => { setOpen(video); setRecent([video.id, ...recent.filter((i) => i !== video.id)].slice(0, 4)); };

  return (
    <>
      <PageHeader eyebrow="Emergency" counter="03 / 07" hero="emergency" accent="#D75C5C" title="Emergency Videos" ar="الطوارئ" tabs={EMERGENCY_TABS}
        subtitle="Video library for emergency situations. All content here is placeholder material and must be replaced with medically reviewed videos."><DemoBadge>Demo content</DemoBadge></PageHeader>

      <div className="card mb-6 flex flex-wrap items-end gap-4">
        <label className="min-w-[16rem] flex-1"><span className="label">Search videos</span>
          <span className="relative block"><Search size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input type="search" className="field pl-12" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or category" /></span></label>
      </div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Category filter">
        <button className="chip" aria-pressed={!cat} onClick={() => setCat('')}>All categories</button>
        {VIDEO_CATEGORIES.map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>

      {!q && !cat && (
        <>
          {recentVideos.length > 0 && <section className="mb-8" aria-labelledby="rw"><h2 id="rw" className="mb-4">Recently Watched</h2><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{recentVideos.map((x) => <Card key={x.id} video={x} onWatch={watch} />)}</div></section>}
          <section className="mb-8" aria-labelledby="rec"><h2 id="rec" className="mb-4">Recommended</h2><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{recommended.map((x) => <Card key={x.id} video={x} onWatch={watch} />)}</div></section>
        </>)}

      <section aria-labelledby="all"><h2 id="all" className="mb-4">{cat || 'All Videos'} <span className="text-muted">({list.length})</span></h2>
        {list.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{list.map((x) => <Card key={x.id} video={x} onWatch={watch} />)}</div>
          : <div className="card"><EmptyState title="No videos found">Try another search term or category.</EmptyState></div>}
      </section>

      <ConfirmationDialog open={!!open} wide title={open?.title} cancelLabel="Close" onCancel={() => setOpen(null)}>
        {open && (<><Thumb video={open} large />
          <p className="mt-4 rounded-xl border-2 border-dashed border-primary bg-primary-light p-3 font-semibold text-primary-dark">Demonstration placeholder — no video source is connected. Medically reviewed content will be played here once provided by the video service.</p>
          <p className="mt-3">{open.description}</p></>)}
      </ConfirmationDialog>
    </>
  );
}
