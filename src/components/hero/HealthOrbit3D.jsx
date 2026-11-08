import { useEffect, useRef, useState } from 'react';
import { statusOf } from '../../config/status';

const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lazy-loaded WebGL scene. Canvas is decorative (aria-hidden); the same domains are exposed as real buttons by MissionHero. */
export default function HealthOrbit3D({ domains, index, auto, onPick }) {
  const host = useRef(null);
  const labelRefs = useRef([]);
  const api = useRef(null);
  const latest = useRef({ domains, index, auto });
  const [state, setState] = useState('loading'); // loading | ready | fallback
  latest.current = { domains, index, auto };

  useEffect(() => {
    let cancelled = false;
    import('./orbitScene').then(({ createOrbitScene }) => {
      if (cancelled) return;
      const a = createOrbitScene(host.current, { reduced: reducedMotion(), labels: labelRefs.current, onPick });
      if (!a) { setState('fallback'); return; }
      api.current = a; a.setDomains(latest.current.domains); a.select(latest.current.index, { instant: true }); a.setAutoRotate(latest.current.auto); setState('ready');
    }).catch(() => !cancelled && setState('fallback'));
    return () => { cancelled = true; api.current?.dispose(); api.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { api.current?.setDomains(domains); }, [domains, state]);
  useEffect(() => { api.current?.select(index); }, [index, state]);
  useEffect(() => { api.current?.setAutoRotate(auto); }, [auto, state]);

  return (
    <div className="relative h-full w-full" role="img" aria-label="Interactive 3D model: Earth at the centre for overall health, orbited by six health domains coloured by status. The same information is listed below as buttons.">
      <div ref={host} className="absolute inset-0" />
      {state === 'fallback' && <Fallback domains={domains} />}
      {state === 'loading' && <div className="absolute inset-0 grid place-items-center text-muted" role="status"><span className="orbit-spin block h-10 w-10 rounded-full border-2 border-dashed border-secondary" /></div>}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {domains.map((d, i) => (
          <div key={d.key} ref={(n) => { labelRefs.current[i] = n; }} className={`absolute left-0 top-0 will-change-transform ${i === index ? '' : 'max-sm:hidden'}`} style={{ opacity: 0 }}>
            <div className={`-translate-x-1/2 translate-y-[1.9rem] whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${i === index ? 'bg-white text-slate-900' : 'bg-black/55 text-white'}`} style={{ backdropFilter: 'blur(4px)' }}>
              <span className="font-mono opacity-70">{String(i + 1).padStart(2, '0')}</span> {d.title}{i === index && <span> · {statusOf(d.status).label}</span>}
            </div>
          </div>))}
      </div>
    </div>
  );
}

function Fallback({ domains }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {[70, 120, 165].map((r) => <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#9AA19C" strokeOpacity=".3" />)}
      <circle cx="200" cy="200" r="44" fill="#0B3D24" stroke="#34D382" strokeOpacity=".6" strokeWidth="3" />
      {domains.slice(1).map((d, i) => { const a = (i / 6) * Math.PI * 2 + 0.4, r = i % 2 ? 165 : 120; return <circle key={d.key} cx={200 + Math.cos(a) * r} cy={200 + Math.sin(a) * r} r="16" fill={statusOf(d.status).hex} fillOpacity=".85" />; })}
    </svg>
  );
}
