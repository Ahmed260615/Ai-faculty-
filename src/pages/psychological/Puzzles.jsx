import { useEffect, useMemo, useRef, useState } from 'react';
import { Brain, CalendarCheck, Grid3x3, Hash, Lightbulb, Medal, Puzzle, Rows3, Timer, Trophy, TypeOutline } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import DemoBadge from '../../components/ui/DemoBadge';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ACHIEVEMENTS, DIFFS, GAMES, MULT, ROUNDS, dailyChallenge, makeSession, memorySeq } from '../../lib/puzzles';
import { rng, dayKey } from '../../services/mock/db';
import { fmtDateTime } from '../../lib/format';
import { PSYCH_TABS } from './tabs';

const ICON = { logic: Lightbulb, memory: Brain, pattern: Rows3, math: Hash, word: TypeOutline, spatial: Grid3x3 };
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Grid({ g, size = 'md' }) {
  const n = g.length, cell = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return <div className="inline-grid gap-1 rounded-lg bg-bg p-2" style={{ gridTemplateColumns: `repeat(${n}, auto)` }} role="img" aria-label={`Grid pattern: ${g.map((r) => r.join('')).join(', ')}`}>{g.flat().map((c, i) => <span key={i} className={`${cell} rounded ${c ? 'bg-primary' : 'bg-white border border-line'}`} />)}</div>;
}

/** Sequence-memory game. */
function Memory({ diff, seed, onFinish, elapsed }) {
  const len0 = { Easy: 3, Medium: 4, Hard: 5 }[diff], cells = diff === 'Easy' ? 4 : 9;
  const r = useRef(rng(seed));
  const [round, setRound] = useState(0);
  const [seq, setSeq] = useState(() => memorySeq(len0, cells, r.current));
  const [phase, setPhase] = useState('show'); // show | input | feedback
  const [lit, setLit] = useState(-1);
  const [pos, setPos] = useState(0);
  const [good, setGood] = useState(0);
  const [msg, setMsg] = useState('Watch the sequence…');
  useEffect(() => {
    if (phase !== 'show') return undefined;
    setMsg('Watch the sequence…'); let i = 0; const ts = [];
    seq.forEach((c, k) => { ts.push(setTimeout(() => setLit(c), 700 + k * 800)); ts.push(setTimeout(() => setLit(-1), 700 + k * 800 + 550)); });
    ts.push(setTimeout(() => { setPhase('input'); setPos(0); setMsg('Your turn — repeat the sequence'); }, 700 + seq.length * 800)); void i;
    return () => ts.forEach(clearTimeout);
  }, [phase, seq]);
  const advance = (ok) => {
    const g = good + (ok ? 1 : 0); setGood(g); setPhase('feedback'); setMsg(ok ? 'Correct!' : 'Not quite — that round is lost.');
    setTimeout(() => {
      if (round + 1 >= 3) { onFinish({ correct: g, rounds: 3, score: g * 10 * MULT[diff] }); return; }
      setRound(round + 1); setSeq(memorySeq(len0 + round + 1, cells, r.current)); setPhase('show');
    }, 1100);
  };
  const tap = (c) => { if (phase !== 'input') return; if (c !== seq[pos]) { advance(false); return; } setLit(c); setTimeout(() => setLit(-1), 200); if (pos + 1 === seq.length) advance(true); else setPos(pos + 1); };
  const cols = cells === 4 ? 2 : 3;
  return (
    <div className="card space-y-4 text-center">
      <p className="font-semibold text-muted">Round {round + 1} of 3 · Sequence length {seq.length} · <Timer className="inline" size={18} aria-hidden="true" /> {mmss(elapsed)}</p>
      <p role="status" className="text-xl font-semibold">{msg}</p>
      <div className="mx-auto grid max-w-sm gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cells }, (_, c) => <button key={c} type="button" disabled={phase !== 'input'} onClick={() => tap(c)} aria-label={`Pad ${c + 1}`} className={`aspect-square min-h-[5rem] rounded-2xl border-2 text-2xl font-bold transition-colors ${lit === c ? 'border-accent bg-accent text-white' : 'border-line bg-primary-light text-primary-dark'}`}>{c + 1}</button>)}
      </div>
    </div>);
}

function Session({ game, diff, seed, daily, onDone, onQuit }) {
  const kind = GAMES[game].kind;
  const questions = useMemo(() => (kind === 'memory' ? [] : makeSession(game, diff, seed)), [game, diff, seed, kind]);
  const [i, setI] = useState(0), [correct, setCorrect] = useState(0), [score, setScore] = useState(0), [fb, setFb] = useState(null), [text, setText] = useState('');
  const [secs, setSecs] = useState(0); const qStart = useRef(0);
  useEffect(() => { const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { qStart.current = secs; }, [i]); // eslint-disable-line
  const finish = (res) => onDone({ at: new Date().toISOString(), game, diff, daily, secs, ...res });
  if (kind === 'memory') return <Memory diff={diff} seed={seed} elapsed={secs} onFinish={finish} />;
  const q = questions[i];
  const answer = (given) => {
    if (fb) return;
    const ok = q.text ? given.trim().toLowerCase() === q.answer : given === q.answer;
    const bonus = ok ? Math.max(0, 10 - (secs - qStart.current)) : 0; // faster = more points
    const pts = ok ? 10 * MULT[diff] + bonus : 0;
    setFb({ ok, pts, shown: q.text ? q.answer.toUpperCase() : null, given }); setCorrect(correct + (ok ? 1 : 0)); setScore(score + pts);
  };
  const next = () => { setFb(null); setText(''); if (i + 1 >= ROUNDS) finish({ correct, rounds: ROUNDS, score }); else setI(i + 1); };
  return (
    <div className="card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 font-semibold text-muted"><span>Question {i + 1} of {ROUNDS} · {diff}</span><span className="inline-flex items-center gap-4"><span><Timer className="inline" size={18} aria-hidden="true" /> {mmss(secs)}</span><span>Score <span className="font-mono text-ink">{score}</span></span></span></div>
      <h2 className="leading-snug">{q.prompt}</h2>
      {q.display && <p className="rounded-xl bg-bg p-5 text-center font-mono text-3xl font-semibold tracking-wide">{q.display}</p>}
      {q.grid && <div className="text-center"><Grid g={q.grid} /></div>}
      {q.text ? (
        <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) answer(text); }} className="flex flex-wrap gap-3"><label className="min-w-[14rem] flex-1"><span className="sr-only">Your answer</span><input className="field uppercase" value={text} onChange={(e) => setText(e.target.value)} disabled={!!fb} autoFocus placeholder="Type the word" autoComplete="off" /></label><button className="btn-primary" disabled={!!fb || !text.trim()}>Check</button></form>
      ) : q.gridOptions ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{q.gridOptions.map((g, k) => <button key={k} type="button" disabled={!!fb} onClick={() => answer(k)} aria-label={`Option ${k + 1}`} className={`flex min-h-[6rem] flex-col items-center gap-2 rounded-xl border-2 p-3 ${fb && k === q.answer ? 'border-ok bg-ok-bg' : fb?.given === k ? 'border-crit bg-crit-bg' : 'border-line hover:border-primary'}`}><Grid g={g} size="sm" /><span className="font-bold">Option {k + 1}</span></button>)}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">{q.options.map((o) => <button key={o} type="button" disabled={!!fb} onClick={() => answer(o)} className={`min-h-[4rem] rounded-xl border-2 px-4 text-xl font-semibold ${fb && o === q.answer ? 'border-ok bg-ok-bg' : fb?.given === o ? 'border-crit bg-crit-bg' : 'border-line bg-white hover:border-primary'}`}>{o}{fb && o === q.answer ? ' ✓' : fb?.given === o ? ' ✗' : ''}</button>)}</div>
      )}
      {fb && (<div role="status" className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 font-semibold ${fb.ok ? 'bg-ok-bg text-ok-dark' : 'bg-crit-bg text-crit-dark'}`}>
        <span>{fb.ok ? `Correct! +${fb.pts} points` : `Not quite.${fb.shown ? ` The word was ${fb.shown}.` : ''}`}</span><button className="btn-primary" onClick={next} autoFocus>{i + 1 >= ROUNDS ? 'Finish' : 'Next question'}</button></div>)}
      <button className="btn-ghost" onClick={onQuit}>Quit session</button>
    </div>);
}

export default function Puzzles() {
  const [history, setHistory] = useLocalStorage('astrohealth.puzzles', []);
  const [lb, setLb] = useLocalStorage('astrohealth.puzzles.leaderboard', false);
  const [diff, setDiff] = useState('Easy');
  const [active, setActive] = useState(null);
  const [last, setLast] = useState(null);
  const today = dayKey(); const daily = dailyChallenge(today);
  const dailyDone = history.some((h) => h.daily && h.at.slice(0, 10) === new Date().toISOString().slice(0, 10));
  const total = history.reduce((a, s) => a + s.score, 0);
  const unlocked = ACHIEVEMENTS.filter((a) => a.test(history));
  const start = (game, d, isDaily) => { setLast(null); setActive({ game, diff: d, daily: isDaily, seed: isDaily ? daily.seed : Math.floor(Math.random() * 1e9) }); };
  const done = (s) => { setHistory([s, ...history].slice(0, 100)); setLast(s); setActive(null); };
  const DailyIcon = ICON[daily.game];
  const board = useMemo(() => [{ n: 'You', s: total }, { n: 'Crew A (demo)', s: 214 }, { n: 'Crew B (demo)', s: 168 }, { n: 'Crew C (demo)', s: 91 }].sort((a, b) => b.s - a.s), [total]);

  return (
    <>
      <PageHeader eyebrow="Psychological health" counter="04 / 07" hero="psychological" accent="#7A6FB0" title="Puzzles & Entertainment" ar="الألغاز" tabs={PSYCH_TABS}
        subtitle="Short cognitive challenges to reduce boredom and keep the mind engaged. Scores are stored on this device." />
      {active ? <Session key={active.seed + active.game} {...active} onDone={done} onQuit={() => setActive(null)} /> : (
        <div className="space-y-6">
          {last && <div role="status" className="card border-t-8 border-ok"><h2>Session complete</h2><p className="mt-2 text-xl">{GAMES[last.game].name} · {last.diff}: <strong>{last.correct}/{last.rounds} correct</strong>, <strong>{last.score} points</strong> in {mmss(last.secs)}.</p></div>}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card"><p className="font-semibold text-muted">Total score</p><p className="font-mono text-4xl font-semibold">{total}</p></div>
            <div className="card"><p className="font-semibold text-muted">Sessions played</p><p className="font-mono text-4xl font-semibold">{history.length}</p></div>
            <div className="card"><p className="font-semibold text-muted">Achievements</p><p className="font-mono text-4xl font-semibold">{unlocked.length}<span className="text-xl text-muted"> / {ACHIEVEMENTS.length}</span></p></div>
          </div>
          <section className="card flex flex-wrap items-center gap-4 border-l-8 border-accent" aria-labelledby="dc">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-light text-primary-dark"><DailyIcon size={34} aria-hidden="true" /></span>
            <div className="min-w-0 flex-1 basis-60"><h2 id="dc" className="flex items-center gap-2"><CalendarCheck size={26} aria-hidden="true" /> Daily Challenge</h2><p className="text-lg">{GAMES[daily.game].name} · Medium · same puzzle for the whole crew today</p></div>
            <button className="btn-primary !min-h-[3.5rem] px-8 text-lg" onClick={() => start(daily.game, daily.diff, true)} disabled={dailyDone}>{dailyDone ? 'Completed today ✓' : 'Start daily challenge'}</button>
          </section>
          <section aria-labelledby="pg">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 id="pg">Choose a puzzle</h2>
              <div role="group" aria-label="Difficulty" className="flex gap-2">{DIFFS.map((d) => <button key={d} className="chip" aria-pressed={diff === d} onClick={() => setDiff(d)}>{d}</button>)}</div></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(GAMES).map(([k, g]) => { const I = ICON[k]; return (
                <article key={k} className="card flex flex-col gap-3"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-light text-primary-dark"><I size={26} aria-hidden="true" /></span><h3>{g.name}</h3></div>
                  <p className="text-muted">{g.desc}</p><button className="btn-primary mt-auto" onClick={() => start(k, diff, false)}><Puzzle size={20} aria-hidden="true" /> Play · {diff}</button></article>); })}
            </div>
          </section>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card" aria-labelledby="ach"><h2 id="ach" className="mb-3 flex items-center gap-2"><Medal size={26} aria-hidden="true" /> Achievements</h2>
              <ul className="space-y-2">{ACHIEVEMENTS.map((a) => { const on = unlocked.includes(a); return <li key={a.id} className={`flex items-center gap-3 rounded-xl border-2 p-3 ${on ? 'border-ok bg-ok-bg' : 'border-line'}`}><span className="text-2xl" aria-hidden="true">{on ? '🏅' : '🔒'}</span><span><strong>{a.name}</strong> <span className="text-sm font-bold">{on ? '— Unlocked' : '— Locked'}</span><br /><span className="text-muted">{a.desc}</span></span></li>; })}</ul></section>
            <section className="card" aria-labelledby="hist"><h2 id="hist" className="mb-3">Progress history</h2>
              {history.length ? <ul className="max-h-80 space-y-2 overflow-auto">{history.slice(0, 12).map((h, k) => <li key={k} className="flex flex-wrap justify-between gap-2 border-b border-line pb-2"><span><strong>{GAMES[h.game].name}</strong> · {h.diff}{h.daily ? ' · Daily' : ''}<br /><span className="text-sm text-muted">{fmtDateTime(h.at)}</span></span><span className="font-mono font-semibold">{h.correct}/{h.rounds} · {h.score} pts</span></li>)}</ul>
                : <EmptyState icon={Puzzle} title="No sessions yet">Play a puzzle to start your history.</EmptyState>}</section>
          </div>
          <section className="card" aria-labelledby="lb"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="lb" className="flex items-center gap-2"><Trophy size={26} aria-hidden="true" /> Crew leaderboard</h2>
            <label className="inline-flex min-h-touch cursor-pointer items-center gap-3 font-semibold"><input type="checkbox" className="h-6 w-6 accent-primary" checked={lb} onChange={(e) => setLb(e.target.checked)} /> Show leaderboard (mission setting)</label></div>
            {lb ? <><ol className="mt-3 space-y-2">{board.map((b, k) => <li key={b.n} className={`flex justify-between rounded-xl p-3 ${b.n === 'You' ? 'bg-primary-light font-bold' : 'bg-bg'}`}><span>{k + 1}. {b.n}</span><span className="font-mono">{b.s}</span></li>)}</ol><div className="mt-3"><DemoBadge>Other crew scores are demo data</DemoBadge></div></>
              : <p className="mt-2 text-muted">The leaderboard is off. Turn it on only if the crew has agreed to share scores.</p>}</section>
        </div>)}
    </>
  );
}
