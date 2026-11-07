import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowRight, ClipboardPlus, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import HealthStatusCard from '../components/medical/HealthStatusCard';
import ChartCard from '../components/data/ChartCard';
import NotificationPanel from '../components/data/NotificationPanel';
import RiskBadge from '../components/ui/RiskBadge';
import ErrorState from '../components/ui/ErrorState';
import DemoBadge from '../components/ui/DemoBadge';
import useAsync from '../hooks/useAsync';
import { getSummary, getAnalytics, getAssessmentCenter, getAlerts } from '../services/dashboard.service';
import { listReports } from '../services/reports.service';
import { USE_MOCK } from '../services/api';
import { baseOptions, C } from '../lib/chart';
import { fmtDate, fmtDateTime, fmtShort } from '../lib/format';
import { TYPE_LABEL } from '../config/nav';

const RANGES = [{ d: 7, l: '7 days' }, { d: 14, l: '14 days' }, { d: 30, l: '30 days' }];
const ds = (label, data, color, extra = {}) => ({ label, data, borderColor: color, backgroundColor: color + '22', borderWidth: 3, pointRadius: 3, pointHoverRadius: 6, tension: 0.3, ...extra });

export default function Dashboard() {
  const nav = useNavigate();
  const [days, setDays] = useState(14);
  const summary = useAsync(getSummary, []);
  const analytics = useAsync(() => getAnalytics(days), [days]);
  const center = useAsync(getAssessmentCenter, []);
  const reports = useAsync(() => listReports(), []);
  const alerts = useAsync(getAlerts, []);
  const a = analytics.data;
  const labels = useMemo(() => a?.labels.map(fmtShort), [a]);
  const dist = useMemo(() => {
    const r = reports.data || [];
    return ['NORMAL', 'WARNING', 'CRITICAL'].map((s) => r.filter((x) => x.status === s).length);
  }, [reports.data]);
  const lineOpts = (y = {}) => baseOptions({ y });

  return (
    <>
      <PageHeader title="Dashboard" ar="الرئيسية" subtitle="Medical overview for the current crew member. Values below are demonstration data until the Express API is connected." accent="#3C7896">
        {USE_MOCK && <DemoBadge />}
      </PageHeader>

      <section aria-labelledby="ov" className="mb-8">
        <h2 id="ov" className="mb-4">Overall Health Overview</h2>
        {summary.error ? <ErrorState error={summary.error} onRetry={summary.reload} /> : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(summary.data || []).map((s) => <HealthStatusCard key={s.key} {...s} />)}
          </div>)}
      </section>

      <section aria-labelledby="an" className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="an">Medical Analytics</h2>
          <div role="group" aria-label="Date range" className="flex gap-2">
            {RANGES.map((r) => <button key={r.d} type="button" className="chip" aria-pressed={days === r.d} onClick={() => setDays(r.d)}>{r.l}</button>)}
          </div>
        </div>
        {analytics.error ? <ErrorState error={analytics.error} onRetry={analytics.reload} /> : !a ? <p role="status" className="text-muted">Loading charts…</p> : (
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Heart Rate History" subtitle="BPM" summary={`Heart rate averaged ${(a.heartRate.reduce((x, y) => x + y, 0) / a.heartRate.length).toFixed(0)} BPM.`}>
              <Line data={{ labels, datasets: [ds('Heart rate (BPM)', a.heartRate, C.crit, { fill: true })] }} options={lineOpts({ suggestedMin: 50, suggestedMax: 100 })} /></ChartCard>
            <ChartCard title="Blood Pressure Trends" subtitle="mmHg" summary="Systolic and diastolic pressure over the selected period.">
              <Line data={{ labels, datasets: [ds('Systolic', a.systolic, C.primary), ds('Diastolic', a.diastolic, C.accent, { borderDash: [6, 4], pointStyle: 'rectRot' })] }} options={lineOpts({ suggestedMin: 50 })} /></ChartCard>
            <ChartCard title="Oxygen Saturation" subtitle="SpO₂ %" summary="Pulse-oximetry oxygen saturation.">
              <Line data={{ labels, datasets: [ds('SpO₂ (%)', a.spo2, C.ok, { fill: true })] }} options={lineOpts({ min: 90, max: 100 })} /></ChartCard>
            <ChartCard title="Radiation Exposure Over Time" subtitle="Daily dose (bars, Sv) and cumulative (line, Sv)" summary="Daily and cumulative radiation dose.">
              <Bar data={{ labels, datasets: [
                { type: 'bar', label: 'Daily dose (Sv)', data: a.radiationDaily, backgroundColor: C.secondary, yAxisID: 'y', borderRadius: 4 },
                { type: 'line', label: 'Cumulative (Sv)', data: a.radiationCumulative, borderColor: C.warn, backgroundColor: C.warn, borderWidth: 3, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }}
                options={baseOptions({ root: { scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { position: 'left', grid: { color: C.grid }, title: { display: true, text: 'Daily Sv' } }, y1: { position: 'right', grid: { display: false }, title: { display: true, text: 'Cumulative Sv' } } } } })} /></ChartCard>
            <ChartCard title="Bone Density Changes" subtitle="% change from baseline BMD" summary="Bone mineral density change trending downward.">
              <Line data={{ labels, datasets: [ds('BMD change (%)', a.bone, C.violet)] }} options={lineOpts()} /></ChartCard>
            <ChartCard title="Muscle Mass Changes" subtitle="kg" summary="Muscle mass trending downward.">
              <Line data={{ labels, datasets: [ds('Muscle mass (kg)', a.muscle, C.primary, { fill: true })] }} options={lineOpts()} /></ChartCard>
            <ChartCard title="Sleep Duration and Quality" subtitle="Hours (bars) and quality score (line)" summary="Nightly sleep hours and quality score.">
              <Bar data={{ labels, datasets: [
                { type: 'bar', label: 'Sleep (hours)', data: a.sleepHours, backgroundColor: C.secondary, borderRadius: 4, yAxisID: 'y' },
                { type: 'line', label: 'Quality (0–100)', data: a.sleepQuality, borderColor: C.primary, backgroundColor: C.primary, borderWidth: 3, pointRadius: 3, yAxisID: 'y1', tension: 0.3 }] }}
                options={baseOptions({ root: { scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { position: 'left', min: 0, max: 10, grid: { color: C.grid }, title: { display: true, text: 'Hours' } }, y1: { position: 'right', min: 0, max: 100, grid: { display: false }, title: { display: true, text: 'Quality' } } } } })} /></ChartCard>
            <ChartCard title="Psychological Health Trends" subtitle="Daily mood and stress check-ins (1–5)" summary="Mood and stress self-reports.">
              <Line data={{ labels, datasets: [ds('Mood', a.mood, C.ok), ds('Stress', a.stress, C.warn, { borderDash: [6, 4], pointStyle: 'triangle' })] }} options={lineOpts({ min: 1, max: 5 })} /></ChartCard>
            <ChartCard title="Report Status Distribution" subtitle="All stored reports" summary={`${dist[0]} normal, ${dist[1]} warning, ${dist[2]} critical reports.`}>
              <Doughnut data={{ labels: ['Normal', 'Warning', 'Critical'], datasets: [{ data: dist, backgroundColor: [C.ok, C.warn, C.crit], borderColor: '#fff', borderWidth: 3 }] }}
                options={{ responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom' } } }} /></ChartCard>
          </div>)}
      </section>

      <section aria-labelledby="mac" className="mb-8">
        <h2 id="mac" className="mb-4">Medical Assessment Center</h2>
        {center.error ? <ErrorState error={center.error} onRetry={center.reload} /> : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(center.data || []).map((t) => (
              <article key={t.type} className="card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2"><h3>{t.name}</h3><RiskBadge level={t.lastStatus} size="sm" /></div>
                <p>{t.description}</p>
                <p className="text-sm text-muted"><strong className="text-ink">Required:</strong> {t.needs}</p>
                <p className="text-sm text-muted">Last assessment: <strong className="text-ink">{fmtDate(t.lastDate)}</strong></p>
                <button type="button" className="btn-primary mt-auto" onClick={() => nav(`${t.to}?start=1`)}><ClipboardPlus size={22} aria-hidden="true" /> Start Assessment</button>
              </article>))}
          </div>)}
      </section>

      <div className="grid gap-6 xl:grid-cols-5">
        <section aria-labelledby="rp" className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between"><h2 id="rp">Latest Medical Reports</h2><Link to="/reports" className="btn-secondary">All reports <ArrowRight size={20} aria-hidden="true" /></Link></div>
          {reports.error ? <ErrorState error={reports.error} onRetry={reports.reload} /> : (
            <ul className="space-y-3">
              {(reports.data || []).slice(0, 4).map((r) => (
                <li key={r.id} className="card !p-4 flex flex-wrap items-center gap-3 justify-between">
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="text-lg font-bold">{r.name}</p>
                    <p className="text-sm text-muted">{TYPE_LABEL[r.type]} · {fmtDateTime(r.createdAt)} · {r.id}</p>
                    <p className="mt-1">{r.summary}</p>
                  </div>
                  <RiskBadge level={r.status} />
                  <Link className="btn-secondary" to={`/reports/${r.id}`}><FileText size={20} aria-hidden="true" /> View Report</Link>
                </li>))}
            </ul>)}
        </section>
        <section aria-labelledby="al" className="xl:col-span-2">
          <h2 id="al" className="mb-4">Alerts and Notifications</h2>
          <div className="card !p-0 overflow-hidden"><NotificationPanel alerts={alerts.data || []} /></div>
        </section>
      </div>
    </>
  );
}
