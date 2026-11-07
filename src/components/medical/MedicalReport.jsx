import { statusOf } from '../../config/status';
import { TYPE_LABEL } from '../../config/nav';
import { fmtDateTime } from '../../lib/format';
import RiskBadge from '../ui/RiskBadge';
import DemoBadge from '../ui/DemoBadge';
import StatusInline from './StatusInline';

const Sec = ({ n, title, children }) => (
  <section className="card" aria-labelledby={`s${n}`}><h2 id={`s${n}`} className="mb-3 text-xl"><span className="text-primary">{n}.</span> {title}</h2>{children}</section>
);
const Row = ({ k, v }) => <div className="flex flex-wrap justify-between gap-2 border-b border-line py-2 last:border-0"><dt className="text-muted font-semibold">{k}</dt><dd className="font-semibold text-right">{v}</dd></div>;

/** Full, read-only medical report (finalised reports are immutable). */
export default function MedicalReport({ report: r, profile }) {
  const p = r.prediction || {};
  const cmp = r.previous;
  return (
    <article className="space-y-5" aria-label={`Report ${r.id}`}>
      <Sec n={1} title="Report Header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-bold">{r.name}</p>
            <p className="text-muted">Report ID {r.id} · Version {r.version}{r.supersedes ? ` (amends ${r.supersedes})` : ''}</p>
            <p className="mt-2 flex flex-wrap gap-2"><span className="chip !min-h-0 py-1">Finalised · read-only</span>{(p.source === 'demo' || r.prediction === undefined) && <DemoBadge />}</p>
          </div>
          <RiskBadge level={r.status} size="lg" />
        </div>
        {r.superseded && <p className="mt-3 rounded-xl bg-warn-bg p-3 font-semibold text-warn-dark">This version has been superseded by amendment {r.superseded}.</p>}
        {r.amendmentNote && <p className="mt-3 rounded-xl bg-primary-light p-3"><strong>Amendment note:</strong> {r.amendmentNote}</p>}
      </Sec>
      <div className="grid gap-5 lg:grid-cols-2">
        <Sec n={2} title="Astronaut Information"><dl><Row k="Astronaut ID" v={profile?.id || '—'} /><Row k="Mission" v={profile?.mission || '—'} /><Row k="Mission day" v={profile ? `Day ${profile.missionDay} of ${profile.missionDays}` : '—'} /></dl></Sec>
        <Sec n={3} title="Assessment Information"><dl><Row k="Assessment type" v={TYPE_LABEL[r.type]} /><Row k="Date & time" v={fmtDateTime(r.createdAt)} /><Row k="Risk score" v={r.scoreLabel || (r.riskScore != null ? `${r.riskScore} / 100` : '—')} /></dl></Sec>
      </div>
      <Sec n={4} title="Measurements Summary">
        {r.measurements?.length ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[34rem] text-left"><thead><tr className="text-muted"><th className="py-2">Measurement</th><th>Value</th><th>Reference</th><th>Status</th></tr></thead>
            <tbody>{r.measurements.map((m, i) => <tr key={i} className="border-t border-line"><td className="py-2.5 pr-3 font-semibold">{m.label}</td><td className="font-mono">{m.value} {m.unit}</td><td className="text-muted">{m.ref || '—'}</td><td><StatusInline status={m.status} /></td></tr>)}</tbody></table></div>
        ) : <p className="text-muted">No measurements recorded.</p>}
      </Sec>
      <Sec n={5} title="Abnormal Values">
        {r.abnormal?.length ? <ul className="space-y-2">{r.abnormal.map((m, i) => <li key={i} className={`rounded-xl border-2 p-3 ${statusOf(m.status).bg} ${statusOf(m.status).border}`}><strong>{m.label}:</strong> <span className="font-mono">{m.value} {m.unit}</span> {m.ref && <span className="text-muted">(reference {m.ref})</span>} · <StatusInline status={m.status} /></li>)}</ul> : <p className="text-lg font-semibold text-ok-dark">No abnormal values recorded.</p>}
      </Sec>
      <Sec n={6} title="AI Prediction Results">
        {p.source === 'demo' && <p className="mb-3 rounded-xl border-2 border-dashed border-primary bg-primary-light p-3 font-semibold text-primary-dark">Demonstration record — not produced by a real AI model.</p>}
        {p.source === 'validated-scoring' && <p className="mb-3 rounded-xl bg-primary-light p-3 font-semibold text-primary-dark">Computed with the validated PHQ-9 scoring rules (no AI model involved). Screening result, not a diagnosis.</p>}
        <dl><Row k="Predicted condition" v={p.condition || '—'} />{p.confidence != null && <Row k="Model confidence" v={`${Math.round(p.confidence * 100)}% (not a disease probability)`} />}</dl>
      </Sec>
      <div className="grid gap-5 lg:grid-cols-2">
        <Sec n={7} title="Risk Classification"><RiskBadge level={r.status} size="lg" /><p className="mt-3">{r.summary}</p></Sec>
        <Sec n={8} title="Contributing Factors">{p.factors?.length ? <ul className="list-disc pl-6 space-y-1">{p.factors.map((f) => <li key={f}>{f}</li>)}</ul> : <p className="text-muted">None reported by the service.</p>}</Sec>
      </div>
      <Sec n={9} title="Medical Recommendations">{p.recommendations?.length ? <ul className="list-disc pl-6 space-y-1">{p.recommendations.map((f) => <li key={f}>{f}</li>)}</ul> : <p className="text-muted">No recommendations returned.</p>}</Sec>
      <Sec n={10} title="Previous Assessment Comparison">
        {cmp ? <dl><Row k="Previous report" v={cmp.id} /><Row k="Previous date" v={fmtDateTime(cmp.createdAt)} /><Row k="Previous status" v={<RiskBadge level={cmp.status} size="sm" />} /><Row k="Previous score" v={cmp.scoreLabel || (cmp.riskScore != null ? `${cmp.riskScore} / 100` : '—')} /></dl> : <p className="text-muted">No earlier assessment of this type.</p>}
      </Sec>
      <Sec n={11} title="Date and Time"><p className="text-lg font-semibold">{fmtDateTime(r.createdAt)}</p></Sec>
    </article>
  );
}
