import { rng } from '../services/mock/db';

export const DIFFS = ['Easy', 'Medium', 'Hard'];
export const MULT = { Easy: 1, Medium: 2, Hard: 3 };
export const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const pick = (r, a) => a[Math.floor(r() * a.length)];
const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const shuffle = (r, a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
function numOptions(r, ans, spread) {
  const s = new Set([ans]); let g = 0;
  while (s.size < 4 && g++ < 50) { const d = int(r, 1, spread) * (r() > 0.5 ? 1 : -1); if (ans + d !== ans) s.add(ans + d); }
  return shuffle(r, [...s]);
}

const LOGIC = {
  Easy: [
    ['All crew members wear a badge. Mira is a crew member. Does Mira wear a badge?', 'Yes', ['Yes', 'No', 'Cannot be determined']],
    ['The airlock is open only when the light is green. The light is red. Is the airlock open?', 'No', ['Yes', 'No', 'Cannot be determined']],
    ['Tom is taller than Ana. Ana is taller than Leo. Who is the shortest?', 'Leo', ['Tom', 'Ana', 'Leo']],
  ],
  Medium: [
    ['Every sample in rack A is labelled. Sample 7 is labelled. Is sample 7 in rack A?', 'Cannot be determined', ['Yes', 'No', 'Cannot be determined']],
    ['Three pumps run in order: B before C, and A after C. Which runs second?', 'C', ['A', 'B', 'C']],
    ['If the hatch is sealed, the alarm is silent. The alarm is sounding. What follows?', 'The hatch is not sealed', ['The hatch is sealed', 'The hatch is not sealed', 'Nothing follows']],
  ],
  Hard: [
    ['Exactly one statement is true. (1) The key is in the red box. (2) The key is not in the red box. (3) The key is in the blue box. Where is the key?', 'Not in the red or blue box', ['In the red box', 'In the blue box', 'Not in the red or blue box']],
    ['Four crew sit in a row. Ana is left of Ben. Cy is right of Ben. Dee is at the far left. Who is second from the left?', 'Ana', ['Ana', 'Ben', 'Cy']],
    ['A is true only if B is true. B is false. What can be said about A?', 'A is false', ['A is true', 'A is false', 'Cannot be determined']],
  ],
};

export const GAMES = {
  logic: { name: 'Logic Puzzles', desc: 'Deduce the correct conclusion.', kind: 'choice' },
  memory: { name: 'Memory Games', desc: 'Repeat the sequence you saw.', kind: 'memory' },
  pattern: { name: 'Pattern Recognition', desc: 'Find the next number.', kind: 'choice' },
  math: { name: 'Mathematical Challenges', desc: 'Quick mental arithmetic.', kind: 'choice' },
  word: { name: 'Word Puzzles', desc: 'Unscramble the mission word.', kind: 'text' },
  spatial: { name: 'Spatial Reasoning', desc: 'Rotate the pattern in your mind.', kind: 'grid' },
};

const WORDS = { Easy: ['orbit', 'moon', 'star', 'rocket', 'cabin', 'solar'], Medium: ['gravity', 'station', 'capsule', 'thruster', 'payload', 'cosmos'], Hard: ['telemetry', 'microgravity', 'trajectory', 'atmosphere', 'navigation', 'radiation'] };

const rot = (g, n) => g[0].map((_, c) => g.map((row) => row[c]).reverse()).map((r) => r); // 90° clockwise
const rotate = (g, times) => { let x = g; for (let i = 0; i < times; i++) x = rot(x, 1); return x; };
const gk = (g) => g.map((r) => r.join('')).join('/');

/** Generate one question for a game. Deterministic given rnd. */
export function generate(game, diff, r) {
  if (game === 'logic') { const [q, a, o] = pick(r, LOGIC[diff]); return { prompt: q, options: o, answer: a }; }
  if (game === 'pattern') {
    let seq, ans;
    if (diff === 'Easy') { const a = int(r, 1, 9), d = int(r, 2, 6); seq = [0, 1, 2, 3, 4].map((i) => a + d * i); ans = a + d * 5; }
    else if (diff === 'Medium') { const a = int(r, 1, 4), m = int(r, 2, 3); seq = [0, 1, 2, 3, 4].map((i) => a * m ** i); ans = a * m ** 5; }
    else { const a = int(r, 1, 4), b = int(r, 2, 6); seq = [a, b]; for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]); ans = seq[4] + seq[5]; seq = seq.slice(0, 6); }
    return { prompt: 'What number comes next?', display: seq.join(',  ') + ',  ?', options: numOptions(r, ans, Math.max(3, Math.round(ans / 6))).map(String), answer: String(ans) };
  }
  if (game === 'math') {
    let q, ans;
    if (diff === 'Easy') { const a = int(r, 12, 89), b = int(r, 11, 59); q = `${a} + ${b}`; ans = a + b; }
    else if (diff === 'Medium') { const a = int(r, 6, 15), b = int(r, 6, 14); q = `${a} × ${b}`; ans = a * b; }
    else { const a = int(r, 5, 19), b = int(r, 4, 14), c = int(r, 3, 9), d = int(r, 5, 30); q = `(${a} + ${b}) × ${c} − ${d}`; ans = (a + b) * c - d; }
    return { prompt: 'Solve:', display: `${q} = ?`, options: numOptions(r, ans, 12).map(String), answer: String(ans) };
  }
  if (game === 'word') {
    const w = pick(r, WORDS[diff]); let s = w; let g = 0;
    while (s === w && g++ < 20) s = shuffle(r, [...w]).join('');
    return { prompt: 'Unscramble this space-related word:', display: s.toUpperCase().split('').join(' '), answer: w, text: true };
  }
  if (game === 'spatial') {
    const n = diff === 'Easy' ? 3 : 4;
    const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (r() > 0.55 ? 1 : 0)));
    g[0][0] = 1; g[n - 1][0] = 0; g[0][n - 1] = 0; // break symmetry
    const correct = rotate(g, 1);
    const wrongs = [rotate(g, 3), rotate(g, 2), g.map((row) => [...row].reverse())];
    const opts = [correct]; for (const w of wrongs) if (!opts.some((o) => gk(o) === gk(w))) opts.push(w);
    while (opts.length < 4) { const c = correct.map((row) => [...row]); const y = int(r, 0, n - 1), x = int(r, 0, n - 1); c[y][x] ^= 1; if (!opts.some((o) => gk(o) === gk(c))) opts.push(c); }
    const options = shuffle(r, opts.map((o) => gk(o)));
    return { prompt: 'Which grid shows this pattern rotated 90° clockwise?', grid: g, gridOptions: options.map((k) => k.split('/').map((row) => row.split('').map(Number))), answer: options.indexOf(gk(correct)), n };
  }
  throw new Error(`Unknown game ${game}`);
}

export const ROUNDS = 5;
export const makeSession = (game, diff, seed) => { const r = rng(seed); return Array.from({ length: ROUNDS }, () => generate(game, diff, r)); };
export const dailyChallenge = (key) => { const h = hash(key); const keys = Object.keys(GAMES); return { game: keys[h % keys.length], diff: 'Medium', seed: h }; };
export const memorySeq = (len, cells, r) => Array.from({ length: len }, () => int(r, 0, cells - 1));

export const ACHIEVEMENTS = [
  { id: 'first', name: 'First Mission', desc: 'Complete any puzzle session.', test: (h) => h.length >= 1 },
  { id: 'perfect', name: 'Sharp Mind', desc: 'Answer every round correctly in one session.', test: (h) => h.some((s) => s.correct === s.rounds) },
  { id: 'hard', name: 'Hard Mode', desc: 'Complete a session on Hard.', test: (h) => h.some((s) => s.diff === 'Hard') },
  { id: 'rounded', name: 'Well-Rounded', desc: 'Play all six puzzle types.', test: (h) => new Set(h.map((s) => s.game)).size >= 6 },
  { id: 'daily', name: 'Daily Challenger', desc: 'Finish a daily challenge.', test: (h) => h.some((s) => s.daily) },
  { id: 'century', name: 'Century', desc: 'Reach 100 total points.', test: (h) => h.reduce((a, s) => a + s.score, 0) >= 100 },
];
