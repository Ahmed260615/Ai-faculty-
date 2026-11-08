import { FileText, TrendingDown, TrendingUp, Minus, FlaskConical } from 'lucide-react';
import RiskBadge from '../ui/RiskBadge';
import { statusOf } from '../../config/status';
import { fmtDate } from '../../lib/format';

/** Reusable result view for every AI-backed assessment. Shows only what the service returned. */
export default function AIResultCard({ result, onViewReport, heading = 'Assessment Result' }) {
  const demo = result.source === 'demo';
  const hasScore = typeof result.riskScore === 'number';
  const cmp = result.comparison;
  const Trend = cmp && hasScore && cmp.previousScore != null ? (result.riskScore > cmp.previousScore ? TrendingUp : result.riskScore < cmp.previousScore ? TrendingDown : Minus) : null;
  return (
    <section className={`card pop border-t-8 ${statusOf(result.status).border}`} aria-labelledby="res-h">
      {demo && (
        <p className="mb-4 flex items-start gap-2 rounded-xl border-2 border-dashed border-primary bg-primary-light p-3 font-semibold text-primary-dark">
          <FlaskConical size={22} className="shrink-0 mt-0.5" aria-hidden="true" />
          DEMONSTRATION RESULT — no AI model is connected. This is not a real AI prediction or medical advice.
        </p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="res-h">{heading}</h2><p className="text-muted">Report {result.reportId}</p></div>
        <RiskBadge level={result.status} size="lg" />
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {hasScore && (
          <div className="rounded-xl bg-bg p-4">
            <p className="font-semibold text-muted">Risk Score</p>
            <p className="font-mono text-5xl font-semibold">{result.riskScore}<span className="text-xl text-muted"> / 100</span></p>
            {Trend && <p className="mt-1 flex items-center gap-1 font-semibold"><Trend size={20} aria-hidden="true" /> Previous {cmp.previousScore} ({fmtDate(cmp.previousDate)})</p>}
          </div>
        )}
        <div className="rounded-xl bg-bg p-4 md:col-span-2">
          <p className="font-semibold text-muted">Predicted Health Condition</p>
          <p className="text-xl font-semibold">{result.condition || 'Not provided by the service'}</p>
          {result.confidence != null && (
            <p className="mt-2"><strong>Model confidence:</strong> <span className="font-mono">{Math.round(result.confidence * 100)}%</span>
              <span className="block text-sm text-muted">Confidence describes the model's certainty in its output — it is not the probability that a condition is present.</span></p>
          )}
        </div>
      </div>
      {result.subRisks?.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.subRisks.map((s) => (
            <div key={s.label} className={`rounded-xl border-2 p-4 ${statusOf(s.status).border} ${statusOf(s.status).bg}`}>
              <p className="font-semibold">{s.label}</p><div className="mt-2"><RiskBadge level={s.status} size="sm" /></div>
            </div>
          ))}
        </div>
      )}
      {result.factors?.length > 0 && (<><h3 className="mt-6 mb-2">Contributing Factors</h3><ul className="list-disc pl-6 space-y-1">{result.factors.map((f) => <li key={f}>{f}</li>)}</ul></>)}
      {result.recommendations?.length > 0 && (<><h3 className="mt-6 mb-2">Recommendations</h3><ul className="list-disc pl-6 space-y-1">{result.recommendations.map((f) => <li key={f}>{f}</li>)}</ul></>)}
      {onViewReport && <div className="mt-6"><button type="button" className="btn-primary !min-h-[3.5rem] text-lg px-8" onClick={onViewReport}><FileText size={22} aria-hidden="true" /> View Report</button></div>}
    </section>
  );
}
