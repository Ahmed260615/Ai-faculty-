import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import PhotoStrip from '../../components/ui/PhotoStrip';
import PageHeader from '../../components/ui/PageHeader';
import AssessmentWorkflow from '../../components/medical/AssessmentWorkflow';
import MeasurementCard from '../../components/medical/MeasurementCard';
import ChartCard from '../../components/data/ChartCard';
import RiskBadge from '../../components/ui/RiskBadge';
import DemoBadge from '../../components/ui/DemoBadge';
import ErrorState from '../../components/ui/ErrorState';
import useAsync from '../../hooks/useAsync';
import { Link } from 'react-router-dom';
import { RESPIRATION, flatFields } from '../../config/assessments';
import { evaluateField, refText } from '../../lib/validate';
import { submit, getHistory } from '../../services/respiration.service';
import { listReports } from '../../services/reports.service';
import { USE_MOCK } from '../../services/api';
import { NUTRITION_TABS } from './NutritionPage';
import { baseOptions, C } from '../../lib/chart';
import { fmtShort, fmtDateTime } from '../../lib/format';
import { statusOf, worst } from '../../config/status';

const F = Object.fromEntries(flatFields(RESPIRATION).map((f) => [f.key, f]));

function SpO2Gauge({ value, status }) {
  const r = 70, circ = 2 * Math.PI * r, pct = Math.max(0, Math.min(100, value));
  const arc = circ * 0.75, filled = arc * (pct - 70) / 30; // 70–100 % scale
  const s = statusOf(status);
  return (
    <div className="card flex flex-col items-center" role="group" aria-label={`Oxygen saturation ${value} percent, ${s.label}`}>
      <p className="self-start font-semibold text-muted">Oxygen Saturation (SpO₂) — pulse oximetry</p>
      <svg viewBox="0 0 180 160" className="w-64 max-w-full" aria-hidden="true">
        <circle cx="90" cy="90" r={r} fill="none" className="stroke-line" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${arc} ${circ}`} transform="rotate(135 90 90)" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={s.hex} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${Math.max(0, filled)} ${circ}`} transform="rotate(135 90 90)" />
        <text x="90" y="92" textAnchor="middle" fontSize="40" fontWeight="600" fontFamily="IBM Plex Mono, monospace" className="fill-ink">{value}%</text>
        <text x="90" y="116" textAnchor="middle" fontSize="13" className="fill-muted">scale 70–100 %</text>
      </svg>
      <RiskBadge level={status} size="lg" />
    </div>
  );
}

export default function RespirationPage() {
  useTheme();
  const hist = useAsync(() => getHistory(14), []);
  const past = useAsync(() => listReports({ type: 'respiration' }), []);
  const l = hist.data?.latest;
  const st = (k) => (l ? evaluateField(F[k], l[k]) : 'UNKNOWN');
  const current = l ? worst(['spo2', 'respRate', 'pao2', 'paco2'].map(st)) : 'UNKNOWN';
  return (
    <>
      <PageHeader eyebrow="Nutrition & respiration" counter="06 / 07" hero="nutrition" accent="#2E8F7A" title="Respiration" ar="التنفس" tabs={NUTRITION_TABS}
        subtitle="Respiratory monitoring — oxygen saturation, respiratory rate and blood gases. Critical respiratory alerts follow the emergency protocol independently of the AI assessment." />
      <PhotoStrip items={['respirator', 'eva-suit', 'glovebox-2']} />
      <section aria-labelledby="cur" className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3"><h2 id="cur">Current Respiratory Status</h2><RiskBadge level={current} />{USE_MOCK && <DemoBadge />}</div>
        {hist.error ? <ErrorState error={hist.error} onRetry={hist.reload} /> : l && (
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:row-span-2"><SpO2Gauge value={l.spo2} status={st('spo2')} /></div>
            <MeasurementCard label="Respiratory Rate" value={l.respRate} unit="breaths/min" status={st('respRate')} reference={refText(F.respRate.ref, '')} time={l.recordedAt} icon="wind" />
            <MeasurementCard label="PaO₂ (arterial)" value={l.pao2} unit="mmHg" status={st('pao2')} reference={refText(F.pao2.ref, '')} time={l.recordedAt} icon="drop" />
            <MeasurementCard label="PaCO₂ (arterial)" value={l.paco2} unit="mmHg" status={st('paco2')} reference={refText(F.paco2.ref, '')} time={l.recordedAt} icon="drop" />
            <p className="lg:col-span-3 rounded-xl bg-primary-light p-4">SpO₂ is a non-invasive pulse-oximetry estimate; PaO₂ and PaCO₂ are measured from an arterial blood gas sample. They are different measurements and are never substituted for one another.</p>
          </div>)}
      </section>
      {hist.data && (
        <section className="mb-6">
          <ChartCard title="Historical Measurements" subtitle="SpO₂ (%) and respiratory rate (breaths/min)" summary="Respiratory history over 14 days.">
            <Line data={{ labels: hist.data.labels.map(fmtShort), datasets: [
              { label: 'SpO₂ (%)', data: hist.data.spo2, borderColor: C.ok, backgroundColor: C.ok, borderWidth: 3, pointRadius: 3, tension: 0.3, yAxisID: 'y' },
              { label: 'Respiratory rate', data: hist.data.respRate, borderColor: C.primary, backgroundColor: C.primary, borderDash: [6, 4], pointStyle: 'rectRot', borderWidth: 3, pointRadius: 3, tension: 0.3, yAxisID: 'y1' }] }}
              options={baseOptions({ root: { scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { position: 'left', min: 90, max: 100, grid: { color: C.grid }, title: { display: true, text: 'SpO₂ %' } }, y1: { position: 'right', min: 8, max: 24, grid: { display: false }, title: { display: true, text: 'breaths/min' } } } } })} />
          </ChartCard>
        </section>)}
      <h2 className="mb-3">New Respiratory Assessment</h2>
      <AssessmentWorkflow config={RESPIRATION} submit={submit} protocol />
      <section className="mt-8" aria-labelledby="prev">
        <h2 id="prev" className="mb-3">Previous Respiratory Reports</h2>
        {past.error ? <ErrorState error={past.error} onRetry={past.reload} /> : (
          <ul className="space-y-3">{(past.data || []).map((r) => (
            <li key={r.id} className="card !p-4 flex flex-wrap items-center justify-between gap-3"><span><strong>{r.id}</strong> · {fmtDateTime(r.createdAt)}<br /><span className="text-muted">{r.summary}</span></span><span className="flex items-center gap-3"><RiskBadge level={r.status} size="sm" /><Link className="btn-secondary" to={`/reports/${r.id}`}>View Report</Link></span></li>))}
            {past.data?.length === 0 && <li className="text-muted">No reports yet.</li>}</ul>)}
      </section>
    </>
  );
}
