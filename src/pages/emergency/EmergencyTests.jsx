import PageHeader from '../../components/ui/PageHeader';
import AssessmentWorkflow from '../../components/medical/AssessmentWorkflow';
import MeasurementCard from '../../components/medical/MeasurementCard';
import DemoBadge from '../../components/ui/DemoBadge';
import ErrorState from '../../components/ui/ErrorState';
import useAsync from '../../hooks/useAsync';
import { EMERGENCY, flatFields } from '../../config/assessments';
import { evaluateField, refText } from '../../lib/validate';
import { submit, getLastVitals } from '../../services/emergency.service';
import { USE_MOCK } from '../../services/api';

export const EMERGENCY_TABS = [{ to: '/emergency', end: true, label: 'Tests & Measurements' }, { to: '/emergency/videos', label: 'Emergency Videos' }];
const FIELDS = flatFields(EMERGENCY);

export default function EmergencyTests() {
  const last = useAsync(getLastVitals, []);
  const v = last.data;
  return (
    <>
      <PageHeader hero="emergency" accent="#D75C5C" title="Emergency" ar="الطوارئ"
        subtitle="Emergency tests & measurements. A critical value raises an immediate alert and protocol instructions — it never waits for the AI analysis, and the AI is never the only decision-maker."
        tabs={EMERGENCY_TABS} />
      <section aria-labelledby="lv" className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3"><h2 id="lv">Last Recorded Vital Signs</h2>{USE_MOCK && <DemoBadge />}</div>
        {last.error ? <ErrorState error={last.error} onRetry={last.reload} /> : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {FIELDS.filter((f) => f.key !== 'ecgNotes' && f.key !== 'diastolic').map((f) => {
              const isBP = f.key === 'systolic';
              const value = !v ? undefined : isBP ? `${v.systolic}/${v.diastolic}` : v[f.key];
              const status = !v ? 'UNKNOWN' : f.type === 'number' ? (isBP ? worstOf(evaluateField(f, v.systolic), evaluateField(FIELDS.find((x) => x.key === 'diastolic'), v.diastolic)) : evaluateField(f, v[f.key])) : 'NORMAL';
              return <MeasurementCard key={f.key} label={isBP ? 'Blood Pressure (BP)' : f.label.replace(/ — Clinical Interpretation/, '')} value={value} unit={isBP ? 'mmHg' : f.unit} status={status}
                reference={f.type === 'number' ? (isBP ? '90–130 / 60–85' : refText(f.ref, f.unit)) : undefined} time={v?.recordedAt} icon={f.icon} />;
            })}
          </div>)}
      </section>
      <AssessmentWorkflow config={EMERGENCY} submit={submit} protocol gated startLabel="Start Emergency Assessment"
        after={() => <p className="rounded-xl bg-primary-light p-4"><strong>Reminder:</strong> the AI prediction supports — and never replaces — the medical officer and the spacecraft emergency protocol.</p>} />
    </>
  );
}
const RANK = { UNKNOWN: -1, NORMAL: 0, WARNING: 1, CRITICAL: 2 };
const worstOf = (a, b) => (RANK[a] >= RANK[b] ? a : b);
