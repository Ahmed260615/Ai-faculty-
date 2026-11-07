import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, RotateCcw } from 'lucide-react';
import AssessmentForm from './AssessmentForm';
import AssessmentLoader from './AssessmentLoader';
import AIResultCard from './AIResultCard';
import WorkflowSteps from './WorkflowSteps';
import CriticalAlert from './CriticalAlert';
import MeasurementCard from './MeasurementCard';
import ErrorState from '../ui/ErrorState';
import useAssessment from '../../hooks/useAssessment';
import { flatFields } from '../../config/assessments';
import { validateFields, evaluateAll, refText } from '../../lib/validate';
import useRanges from '../../hooks/useRanges';

/**
 * Reusable assessment flow: idle → validate → submit → AI processing → result / error / timeout → retry.
 * `protocol` enables the local critical-value alert, which fires while typing and never waits for the AI.
 * `gated` shows a Start button first (also auto-starts with ?start=1).
 */
export default function AssessmentWorkflow({ config, submit, protocol = false, gated = false, startLabel = 'Start Assessment', before, after }) {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const fields = useMemo(() => flatFields(config), [config]);
  const [started, setStarted] = useState(!gated || params.get('start') === '1');
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const a = useAssessment(submit);
  const ranges = useRanges();
  const rows = useMemo(() => evaluateAll(fields, values), [fields, values, ranges]); // eslint-disable-line
  const critical = protocol ? rows.filter((r) => r.status === 'CRITICAL') : [];

  const onChange = (k, v) => { setValues((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const onSubmit = () => {
    const e = validateFields(fields, values); setErrors(e);
    if (Object.keys(e).length) { a.setValidationError(); return; }
    a.run(values);
  };
  const busy = a.phase === 'submitting' || a.phase === 'ai_processing';
  const done = ['success', 'warning', 'critical'].includes(a.phase);

  if (!started) {
    return (
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg max-w-2xl">Begin a new assessment. You will enter the required measurements, they are validated, and then analysed.</p>
        <button className="btn-danger !min-h-[3.5rem] text-lg px-8" onClick={() => setStarted(true)}><Play size={22} aria-hidden="true" /> {startLabel}</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkflowSteps phase={a.phase} />
      <CriticalAlert items={critical} />
      {before?.({ rows, values })}
      {busy && <AssessmentLoader phase={a.phase} onCancel={a.cancel} />}
      {(a.phase === 'error' || a.phase === 'timeout') && <ErrorState error={a.error} onRetry={a.retry} />}
      {done && (
        <>
          <AIResultCard result={a.result} onViewReport={() => nav(`/reports/${a.result.reportId}`)} />
          <section aria-labelledby="ms-h">
            <h2 id="ms-h" className="mb-3">Entered Measurements</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rows.filter((r) => r.value !== undefined && r.value !== '').map((r) => (
                <MeasurementCard key={r.field.key} label={r.field.label} value={r.value} unit={r.field.unit} status={r.status} reference={refText(r.ref, r.field.unit)} icon={r.field.icon} time={a.result.report?.createdAt} />
              ))}
            </div>
          </section>
          {after?.({ result: a.result, values })}
          <button className="btn-secondary" onClick={() => { a.reset(); setValues({}); }}><RotateCcw size={20} aria-hidden="true" /> New Assessment</button>
        </>
      )}
      {!busy && !done && (
        <AssessmentForm config={config} values={values} errors={errors} onChange={onChange} onSubmit={onSubmit} busy={busy} />
      )}
    </div>
  );
}
