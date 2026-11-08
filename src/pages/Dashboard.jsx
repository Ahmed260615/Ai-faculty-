import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowUpRight, ClipboardPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import MissionHero from '../components/medical/MissionHero';
import Segmented from '../components/ui/Segmented';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import Photo from '../components/ui/Photo';
import { Radiation, Siren, Brain, Orbit, Apple, Wind, ChevronRight } from 'lucide-react';
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

const CARD_PHOTO = { radiation: 'sun-flare', emergency: 'respirator', psychological: 'cupola-crew', gravity: 'ared-ground', nutrition: 'lettuce', respiration: 'eva-suit' };
const TYPE_ICON = { radiation: Radiation, emergency: Siren, psychological: Brain, gravity: Orbit, nutrition: Apple, respiration: Wind };
const RANGES = [{ d: 7, l: '7 days' }, { d: 14, l: '14 days' }, { d: 30, l: '30 days' }];
const ds = (label, data, color, extra = {}) => ({ label, data, borderColor: color, backgroundColor: color + '22', borderWidth: 3, pointRadius: 3, pointHoverRadius: 6, tension: 0.3, ...extra });

export default function Dashboard() {
  useTheme();
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
      <MissionHero summary={summary.data} onStart={() => document.getElementById('mac')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
      {USE_MOCK && <p className="-mt-4 mb-8"><DemoBadge>Demonstration data until the Express API is connected</DemoBadge></p>}

      <section aria-labelledby="ov" className="mb-8">
        <Eyebrow className="mb-2" right="01 — 04">Overview</Eyebrow><h2 id="ov" className="mb-5 !text-3xl">Overall Health Overview</h2>
        {summary.error ? <ErrorState error={summary.error} onRetry={summary.reload} /> : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(summary.data || []).map((s, i) => <HealthStatusCard key={s.key} delay={i * 60} {...s} />)}
          </div>)}
      </section>

      <section aria-labelledby="env" className="mb-8">
        <Eyebrow className="mb-2" right="NASA photography">Mission environment</Eyebrow>
        <h2 id="env" className="mb-5 !text-3xl">What the crew is up against — and how they train</h2>
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[11rem]">
          {[['earth-limb', 'col-span-2 row-span-2'], ['ared-iss', 'col-span-1 row-span-1'], ['lettuce', 'col-span-1 row-span-1'], ['quarters-wide', 'col-span-1 row-span-1'], ['eva', 'col-span-1 row-span-1']].map(([n, c], i) => (
            <Reveal key={n} lift delay={i * 70} className={`card !p-0 overflow-hidden ${c}`}><Photo name={n} ratio="h-full w-full" /></Reveal>))}
        </div>
      </section>

      <section aria-labelledby="an" className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-auto"><Eyebrow className="mb-2" right="02 — 04">Analytics</Eyebrow><h2 id="an" className="!text-3xl">Medical Analytics</h2></div>
          <Segmented label="Date range" value={days} onChange={setDays} items={RANGES.map((r) => ({ value: r.d, label: r.l }))} />
        </div>
        {analytics.error ? <ErrorState error={analytics.error} onRetry={analytics.reload} /> : !a ? <p role="status" className="text-muted">Loading charts…</p> : (
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard delay={0} title="Heart Rate History" subtitle="BPM" summary={`Heart rate averaged ${(a.heartRate.reduce((x, y) => x + y, 0) / a.heartRate.length).toFixed(0)} BPM.`}>
              <Line data={{ labels, datasets: [ds('Heart rate (BPM)', a.heartRate, C.crit, { fill: true })] }} options={lineOpts({ suggestedMin: 50, suggestedMax: 100 })} /></ChartCard>
            <ChartCard delay={0} title="Blood Pressure Trends" subtitle="mmHg" summary="Systolic and diastolic pressure over the selected period.">
              <Line data={{ labels, datasets: [ds('Systolic', a.systolic, C.primary), ds('Diastolic', a.diastolic, C.accent, { borderDash: [6, 4], pointStyle: 'rectRot' })] }} options={lineOpts({ suggestedMin: 50 })} /></ChartCard>
            <ChartCard delay={80} title="Oxygen Saturation" subtitle="SpO₂ %" summary="Pulse-oximetry oxygen saturation.">
              <Line data={{ labels, datasets: [ds('SpO₂ (%)', a.spo2, C.ok, { fill: true })] }} options={lineOpts({ min: 90, max: 100 })} /></ChartCard>
            <ChartCard delay={0} title="Radiation Exposure Over Time" subtitle="Daily dose (bars, Sv) and cumulative (line, Sv)" summary="Daily and cumulative radiation dose.">
              <Bar data={{ labels, datasets: [
                { type: 'bar', label: 'Daily dose (Sv)', data: a.radiationDaily, backgroundColor: C.secondary, yAxisID: 'y', borderRadius: 4 },
                { type: 'line', label: 'Cumulative (Sv)', data: a.radiationCumulative, borderColor: C.warn, backgroundColor: C.warn, borderWidth: 3, pointRadius: 2, yAxisID: 'y1', tension: 0.3 }] }}
                options={baseOptions({ root: { scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { position: 'left', grid: { color: C.grid }, title: { display: true, text: 'Daily Sv' } }, y1: { position: 'right', grid: { display: false }, title: { display: true, text: 'Cumulative Sv' } } } } })} /></ChartCard>
            <ChartCard delay={80} title="Bone Density Changes" subtitle="% change from baseline BMD" summary="Bone mineral density change trending downward.">
              <Line data={{ labels, datasets: [ds('BMD change (%)', a.bone, C.violet)] }} options={lineOpts()} /></ChartCard>
            <ChartCard delay={0} title="Muscle Mass Changes" subtitle="kg" summary="Muscle mass trending downward.">
              <Line data={{ labels, datasets: [ds('Muscle mass (kg)', a.muscle, C.primary, { fill: true })] }} options={lineOpts()} /></ChartCard>
            <ChartCard delay={80} title="Sleep Duration and Quality" subtitle="Hours (bars) and quality score (line)" summary="Nightly sleep hours and quality score.">
              <Bar data={{ labels, datasets: [
                { type: 'bar', label: 'Sleep (hours)', data: a.sleepHours, backgroundColor: C.secondary, borderRadius: 4, yAxisID: 'y' },
                { type: 'line', label: 'Quality (0–100)', data: a.sleepQuality, borderColor: C.primary, backgroundColor: C.primary, borderWidth: 3, pointRadius: 3, yAxisID: 'y1', tension: 0.3 }] }}
                options={baseOptions({ root: { scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { position: 'left', min: 0, max: 10, grid: { color: C.grid }, title: { display: true, text: 'Hours' } }, y1: { position: 'right', min: 0, max: 100, grid: { display: false }, title: { display: true, text: 'Quality' } } } } })} /></ChartCard>
            <ChartCard delay={0} title="Psychological Health Trends" subtitle="Daily mood and stress check-ins (1–5)" summary="Mood and stress self-reports.">
              <Line data={{ labels, datasets: [ds('Mood', a.mood, C.ok), ds('Stress', a.stress, C.warn, { borderDash: [6, 4], pointStyle: 'triangle' })] }} options={lineOpts({ min: 1, max: 5 })} /></ChartCard>
            <ChartCard delay={80} title="Report Status Distribution" subtitle="All stored reports" summary={`${dist[0]} normal, ${dist[1]} warning, ${dist[2]} critical reports.`}>
              <Doughnut data={{ labels: ['Normal', 'Warning', 'Critical'], datasets: [{ data: dist, backgroundColor: [C.ok, C.warn, C.crit], borderColor: C.surface, borderWidth: 3 }] }}
                options={{ responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom' } } }} /></ChartCard>
          </div>)}
      </section>

      <section aria-labelledby="mac" className="mb-8">
        <Eyebrow className="mb-2" right="03 — 04">Assessments</Eyebrow><h2 id="mac" className="mb-5 !text-3xl scroll-mt-28">Medical Assessment Center</h2>
        {center.error ? <ErrorState error={center.error} onRetry={center.reload} /> : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(center.data || []).map((t, i) => (
              <Reveal as="article" lift delay={(i % 3) * 70} key={t.type} className="card flex flex-col !p-0 overflow-hidden">
                <Photo name={CARD_PHOTO[t.type]} ratio="aspect-[16/7]" caption={false} />
                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-2"><h3>{t.name}</h3><RiskBadge level={t.lastStatus} size="sm" /></div>
                <p>{t.description}</p>
                <p className="text-sm text-muted"><strong className="text-ink">Required:</strong> {t.needs}</p>
                <p className="text-sm text-muted">Last assessment: <strong className="text-ink">{fmtDate(t.lastDate)}</strong></p>
                <button type="button" className="btn-primary mt-auto" onClick={() => nav(`${t.to}?start=1`)}><ClipboardPlus size={22} aria-hidden="true" /> Start Assessment <ArrowUpRight size={20} aria-hidden="true" /></button>
                </div>
              </Reveal>))}
          </div>)}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section aria-labelledby="rp" className="min-w-0 xl:col-span-3">
          <Eyebrow className="mb-2" right="04 — 04">Reports</Eyebrow>
          <div className="mb-3 flex items-center justify-between gap-3"><h2 id="rp" className="!text-3xl">Latest Medical Reports</h2><Link to="/reports" className="arrow-link">All reports<ArrowUpRight size={20} aria-hidden="true" /></Link></div>
          {reports.error ? <ErrorState error={reports.error} onRetry={reports.reload} /> : (
            <ul className="border-b border-line">
              {(reports.data || []).slice(0, 5).map((r, i) => { const I = TYPE_ICON[r.type]; return (
                <Reveal as="li" delay={i * 60} key={r.id} className="border-t border-line">
                  <Link to={`/reports/${r.id}`} className="group flex items-center gap-4 py-5 hover:bg-surface2" aria-label={`View report ${r.name}, ${r.id}`}>
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sidebar text-white"><I size={26} aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-xl font-semibold" style={{ letterSpacing: '-0.015em' }}>{r.name}</span>
                      <span className="block text-muted">{TYPE_LABEL[r.type]} · {fmtDateTime(r.createdAt)} · <span className="font-mono">{r.id}</span></span>
                      <span className="mt-1 hidden sm:block">{r.summary}</span></span>
                    <RiskBadge level={r.status} size="sm" className="shrink-0" />
                    <ChevronRight size={24} aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
                  </Link>
                </Reveal>); })}
            </ul>)}
        </section>
        <section aria-labelledby="al" className="min-w-0 xl:col-span-2">
          <Eyebrow className="mb-2">Alerts</Eyebrow><h2 id="al" className="mb-3 !text-3xl">Alerts and Notifications</h2>
          <div className="card !p-0 overflow-hidden"><NotificationPanel alerts={alerts.data || []} /></div>
        </section>
      </div>
    </>
  );
}
