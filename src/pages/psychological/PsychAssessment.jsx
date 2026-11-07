import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { ArrowLeft, ArrowRight, FileText, HeartHandshake, OctagonAlert, RotateCcw, Save } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import RiskBadge from '../../components/ui/RiskBadge';
import ChartCard from '../../components/data/ChartCard';
import ErrorState from '../../components/ui/ErrorState';
import DemoBadge from '../../components/ui/DemoBadge';
import useAsync from '../../hooks/useAsync';
import { PHQ9_ITEMS, PHQ9_ANSWERS, PHQ9_STEM, PHQ9_DIFFICULTY, PHQ9_DIFFICULTY_Q, severityOf, SEVERITY_STATUS, score } from '../../lib/phq9';
import { submitPhq9, getPhqHistory, saveCheckin, getCheckins } from '../../services/psychological.service';
import { USE_MOCK } from '../../services/api';
import { PSYCH_TABS } from './tabs';
import { baseOptions, C } from '../../lib/chart';
import { fmtDate, fmtShort } from '../../lib/format';

const BANDS = [['0–4', 'Minimal'], ['5–9', 'Mild'], ['10–14', 'Moderate'], ['15–19', 'Moderately Severe'], ['20–27', 'Severe']];

function Escalation({ item9 }) {
  return (
    <div role="alert" className="pulse-crit rounded-2xl border-4 border-crit bg-crit-bg p-5">
      <div className="flex items-center gap-3 text-crit-dark"><OctagonAlert size={36} aria-hidden="true" /><h2 className="!text-crit-dark">{item9 ? 'Your answer to question 9 needs follow-up' : 'Clinical follow-up recommended'}</h2></div>
      <ul className="mt-3 list-disc pl-6 text-lg font-semibold">
        <li>Contact the crew medical officer or flight surgeon now.</li>
        <li>Follow the mission psychological-support protocol; use the private communication channel to ground support if needed.</li>
        <li>If you are in immediate danger, or thinking of harming yourself, alert a crewmate right away. Do not wait.</li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-3"><Link to="/emergency" className="btn-danger"><HeartHandshake size={22} aria-hidden="true" /> Open Emergency page</Link></div>
      <p className="mt-3 text-sm text-crit-dark">Escalation wording is a demonstration and must be replaced with the approved mission protocol.</p>
    </div>
  );
}

function Phq9({ history, onSaved }) {
  const [stage, setStage] = useState('intro'); // intro | q | difficulty | saving | result | error
  const [i, setI] = useState(0);
  const [ans, setAns] = useState(Array(9).fill(null));
  const [diff, setDiff] = useState(null);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [warn, setWarn] = useState(false);

  const choose = (v) => { const n = [...ans]; n[i] = v; setAns(n); setWarn(false); };
  const next = () => { if (ans[i] === null) { setWarn(true); return; } if (i < 8) setI(i + 1); else setStage('difficulty'); };
  const finish = async () => {
    const total = score(ans), severity = severityOf(total);
    const payload = { answers: ans, total, severity, item9: ans[8], difficulty: diff, assessedAt: new Date().toISOString() };
    setStage('saving');
    try { const report = await submitPhq9(payload); setRes({ ...payload, report, prev: history[history.length - 1] ?? null, trend: [...history, { date: payload.assessedAt, total, severity }] }); setStage('result'); onSaved(); } catch (e) { setErr(e); setStage('error'); }
  };
  const reset = () => { setStage('intro'); setI(0); setAns(Array(9).fill(null)); setDiff(null); setRes(null); setErr(null); };

  if (stage === 'intro') return (
    <div className="card space-y-4">
      <h2>PHQ-9 · Patient Health Questionnaire</h2>
      <p className="rounded-xl bg-primary-light p-4 text-lg"><strong>Assessment period: the last 2 weeks.</strong> PHQ-9 is not a daily questionnaire — use the Daily Check-in tab for a quick daily mood and stress record.</p>
      <p>Nine questions · about 2 minutes · results are a <strong>screening result, not a diagnosis</strong>.</p>
      <div className="flex flex-wrap gap-2">{BANDS.map(([r, l]) => <span key={l} className="chip !min-h-0 py-1.5"><strong>{r}</strong> {l}</span>)}</div>
      <button className="btn-primary !min-h-[3.5rem] text-lg px-8" onClick={() => setStage('q')}>Start PHQ-9</button>
    </div>);

  if (stage === 'q') return (
    <div className="card space-y-5" aria-live="polite">
      <div className="flex items-center justify-between gap-3"><p className="font-semibold text-muted">Question {i + 1} of 9 · last 2 weeks</p><p className="text-muted">{Math.round((i / 9) * 100)}% complete</p></div>
      <div className="h-3 rounded-full bg-line" role="progressbar" aria-valuenow={i + 1} aria-valuemin={1} aria-valuemax={9} aria-label="Questionnaire progress"><div className="h-3 rounded-full bg-primary" style={{ width: `${((i + 1) / 9) * 100}%` }} /></div>
      <p className="text-muted">{PHQ9_STEM}</p>
      <fieldset><legend className="text-2xl font-semibold leading-snug">{i + 1}. {PHQ9_ITEMS[i]}</legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PHQ9_ANSWERS.map((a) => (
            <label key={a.v} className={`flex min-h-[4rem] cursor-pointer items-center gap-3 rounded-xl border-2 px-4 text-lg font-semibold ${ans[i] === a.v ? 'border-primary bg-primary-light' : 'border-line hover:border-primary'}`}>
              <input type="radio" name={`q${i}`} value={a.v} checked={ans[i] === a.v} onChange={() => choose(a.v)} className="h-6 w-6 accent-primary" />
              <span className="flex-1">{a.label}</span><span className="font-mono text-muted">{a.v}</span>
            </label>))}
        </div></fieldset>
      {warn && <p role="alert" className="font-semibold text-crit-dark">Please choose an answer to continue.</p>}
      {i === 8 && ans[8] > 0 && <Escalation item9 />}
      <div className="flex justify-between gap-3">
        <button className="btn-secondary" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft size={20} aria-hidden="true" /> Back</button>
        <button className="btn-primary" onClick={next}>{i === 8 ? 'Continue' : 'Next'} <ArrowRight size={20} aria-hidden="true" /></button>
      </div>
    </div>);

  if (stage === 'difficulty') return (
    <div className="card space-y-5">
      <h2>One more question (not scored)</h2>
      <fieldset><legend className="text-xl font-semibold">{PHQ9_DIFFICULTY_Q}</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{PHQ9_DIFFICULTY.map((d, k) => (
          <label key={d} className={`flex min-h-[4rem] cursor-pointer items-center gap-3 rounded-xl border-2 px-4 text-lg font-semibold ${diff === k ? 'border-primary bg-primary-light' : 'border-line hover:border-primary'}`}>
            <input type="radio" name="diff" checked={diff === k} onChange={() => setDiff(k)} className="h-6 w-6 accent-primary" />{d}</label>))}</div></fieldset>
      <div className="flex justify-between gap-3"><button className="btn-secondary" onClick={() => { setStage('q'); setI(8); }}><ArrowLeft size={20} aria-hidden="true" /> Back</button>
        <button className="btn-primary" onClick={finish}><Save size={20} aria-hidden="true" /> Submit & Save Report</button></div>
    </div>);

  if (stage === 'saving') return <div className="card py-12 text-center" role="status"><h2>Saving your results…</h2></div>;
  if (stage === 'error') return <ErrorState error={err} onRetry={finish} />;

  const prev = res.prev;
  const total = res.total, sev = res.severity, st = SEVERITY_STATUS[sev];
  const hist = res.trend.slice(-8);
  const delta = prev ? total - prev.total : null;
  return (
    <div className="space-y-5">
      {(res.item9 > 0 || total >= 15) && <Escalation item9={res.item9 > 0} />}
      <section className={`card border-t-8 ${st === 'NORMAL' ? 'border-ok' : st === 'WARNING' ? 'border-warn' : 'border-crit'}`} aria-labelledby="phq-res">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="phq-res">PHQ-9 Screening Result</h2><p className="text-muted">Assessed {fmtDate(res.assessedAt)} · covers the previous 2 weeks</p></div><RiskBadge level={st} size="lg" /></div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-bg p-4"><p className="font-semibold text-muted">Total score</p><p className="font-mono text-5xl font-semibold">{total}<span className="text-xl text-muted"> / 27</span></p></div>
          <div className="rounded-xl bg-bg p-4"><p className="font-semibold text-muted">Severity</p><p className="text-3xl font-bold">{sev}</p></div>
          <div className="rounded-xl bg-bg p-4"><p className="font-semibold text-muted">Previous assessment</p>{prev ? <><p className="font-mono text-3xl font-semibold">{prev.total} <span className="text-lg text-muted">({prev.severity})</span></p><p>{delta === 0 ? 'No change' : `${delta > 0 ? '▲ +' : '▼ '}${delta} points`} · {fmtDate(prev.date)}</p></> : <p className="text-lg">None on record</p>}</div>
        </div>
        <p className="mt-4 rounded-xl bg-primary-light p-4"><strong>This is a screening result, not a diagnosis.</strong> A clinician must confirm any diagnosis and decide on care.</p>
        <div className="mt-4 flex flex-wrap gap-3"><Link to={`/reports/${res.report.id}`} className="btn-primary"><FileText size={20} aria-hidden="true" /> View Report</Link><button className="btn-secondary" onClick={reset}><RotateCcw size={20} aria-hidden="true" /> New assessment</button></div>
      </section>
      <ChartCard title="PHQ-9 Trend" subtitle="Total score (0–27) per assessment" summary={`Scores: ${hist.map((h) => h.total).join(', ')}`}>
        <Line data={{ labels: hist.map((h) => fmtShort(h.date)), datasets: [{ label: 'PHQ-9 total', data: hist.map((h) => h.total), borderColor: C.violet, backgroundColor: C.violet, borderWidth: 3, pointRadius: 5, tension: 0.2 }] }} options={baseOptions({ y: { min: 0, max: 27 } })} />
      </ChartCard>
    </div>);
}

const MOODS = ['Very low', 'Low', 'Okay', 'Good', 'Very good'], STRESS = ['None', 'Mild', 'Moderate', 'High', 'Very high'];
function Scale({ legend, labels, value, onChange }) {
  return (<fieldset><legend className="label text-lg">{legend}</legend><div className="grid grid-cols-5 gap-2">{labels.map((l, k) => (
    <button type="button" key={l} aria-pressed={value === k + 1} onClick={() => onChange(k + 1)} className={`min-h-[4.5rem] rounded-xl border-2 px-1 font-semibold ${value === k + 1 ? 'border-primary bg-primary text-white' : 'border-line bg-white hover:border-primary'}`}><span className="block font-mono text-2xl">{k + 1}</span><span className="text-sm">{l}</span></button>))}</div></fieldset>);
}
function Checkin() {
  const { data, error, reload } = useAsync(getCheckins, []);
  const [mood, setMood] = useState(null), [stress, setStress] = useState(null), [note, setNote] = useState(''), [msg, setMsg] = useState(null), [busy, setBusy] = useState(false);
  const save = async () => {
    if (!mood || !stress) { setMsg({ bad: true, t: 'Choose both a mood and a stress level.' }); return; }
    setBusy(true);
    try { await saveCheckin({ mood, stress, note }); setMsg({ t: 'Check-in saved for today.' }); reload(); } catch (e) { setMsg({ bad: true, t: e.message || 'Could not save.' }); } finally { setBusy(false); }
  };
  const d = (data || []).slice(-14);
  return (
    <div className="space-y-5">
      <div className="card space-y-5"><h2>Daily Mood & Stress Check-in</h2><p className="text-muted">A quick personal record — separate from the PHQ-9 and not a clinical score.</p>
        <Scale legend="How is your mood today?" labels={MOODS} value={mood} onChange={setMood} />
        <Scale legend="How stressed do you feel today?" labels={STRESS} value={stress} onChange={setStress} />
        <label className="block"><span className="label">Note (optional)</span><textarea className="field !py-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <div className="flex flex-wrap items-center gap-4"><button className="btn-primary" onClick={save} disabled={busy}><Save size={20} aria-hidden="true" /> Save check-in</button>{msg && <p role="status" className={`font-semibold ${msg.bad ? 'text-crit-dark' : 'text-ok-dark'}`}>{msg.t}</p>}</div>
        {(mood === 1 || stress === 5) && <p className="rounded-xl bg-warn-bg p-3 font-semibold text-warn-dark">If you are struggling, consider contacting the crew medical officer or psychological support.</p>}</div>
      {error ? <ErrorState error={error} onRetry={reload} /> : data && (
        <ChartCard title="Last 14 days" subtitle="Mood and stress (1–5)" summary="Daily mood and stress check-ins.">
          <Line data={{ labels: d.map((x) => fmtShort(x.day)), datasets: [{ label: 'Mood', data: d.map((x) => x.mood), borderColor: C.ok, backgroundColor: C.ok, borderWidth: 3, tension: 0.3 }, { label: 'Stress', data: d.map((x) => x.stress), borderColor: C.warn, backgroundColor: C.warn, borderDash: [6, 4], pointStyle: 'triangle', borderWidth: 3, tension: 0.3 }] }} options={baseOptions({ y: { min: 1, max: 5, ticks: { stepSize: 1 } } })} /></ChartCard>)}
    </div>);
}

export default function PsychAssessment() {
  const [tab, setTab] = useState('phq');
  const hist = useAsync(getPhqHistory, []);
  return (
    <>
      <PageHeader eyebrow="Psychological health" counter="04 / 07" hero="psychological" accent="#7A6FB0" title="Psychological Assessment" ar="الاختبار النفسي" tabs={PSYCH_TABS}
        subtitle="PHQ-9 depressive-symptom screening (last 2 weeks) and a separate daily mood & stress check-in.">{USE_MOCK && <DemoBadge>Earlier scores are demo data</DemoBadge>}</PageHeader>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Assessment type">
        <button role="tab" aria-selected={tab === 'phq'} className="chip" aria-pressed={tab === 'phq'} onClick={() => setTab('phq')}>PHQ-9 · last 2 weeks</button>
        <button role="tab" aria-selected={tab === 'daily'} className="chip" aria-pressed={tab === 'daily'} onClick={() => setTab('daily')}>Daily check-in</button>
      </div>
      {tab === 'phq' ? (hist.error ? <ErrorState error={hist.error} onRetry={hist.reload} /> : hist.data && <Phq9 history={hist.data} onSaved={hist.reload} />) : <Checkin />}
    </>
  );
}
