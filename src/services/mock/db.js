/**
 * DEMONSTRATION DATA ONLY.
 * Nothing in this file is real astronaut data and nothing here is an AI prediction.
 * Replace by pointing VITE_API_BASE_URL at the Express API (see docs/API_CONTRACT.md).
 */
export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const daysAgo = (n, h = 9) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, 0, 0, 0); return d.toISOString(); };

export function series(n, base, amp, seed, drift = 0, dec = 1) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => +(base + drift * (i / Math.max(1, n - 1)) + (r() - 0.5) * 2 * amp).toFixed(dec));
}

export const store = {
  get(key, fallback) { try { const v = localStorage.getItem(`astrohealth.demo.${key}`); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, val) { try { localStorage.setItem(`astrohealth.demo.${key}`, JSON.stringify(val)); } catch { /* ignore */ } },
};

const m = (label, value, unit, status = 'NORMAL', ref) => ({ label, value, unit, status, ref });
const SEED_REPORTS = [
  { id: 'RPT-2026-0112', type: 'radiation', name: 'Radiation Assessment', createdAt: daysAgo(2, 10), status: 'WARNING', riskScore: 41, summary: 'Cumulative dose within planning range; lymphocyte count slightly below the configured lab range.', measurements: [m('Cumulative exposure', 0.21, 'Sv'), m('Lymphocytes', 920, 'cells/µL', 'WARNING', '1,000–4,800 cells/µL')] },
  { id: 'RPT-2026-0111', type: 'emergency', name: 'Emergency Vitals Check', createdAt: daysAgo(4, 14), status: 'NORMAL', riskScore: 6, summary: 'All vital signs within configured reference ranges.', measurements: [m('Heart rate', 72, 'BPM', 'NORMAL', '60–100 BPM'), m('SpO₂', 98, '%', 'NORMAL', '95–100 %')] },
  { id: 'RPT-2026-0110', type: 'psychological', name: 'PHQ-9 Screening', createdAt: daysAgo(6, 16), status: 'NORMAL', riskScore: null, scoreLabel: '4 / 27', summary: 'Minimal depressive symptoms (screening result, not a diagnosis).', measurements: [m('PHQ-9 total', 4, '/ 27')] },
  { id: 'RPT-2026-0109', type: 'gravity', name: 'Microgravity Assessment', createdAt: daysAgo(9, 11), status: 'WARNING', riskScore: 48, summary: 'Bone density change and muscle loss above planning thresholds.', measurements: [m('BMD change', -1.4, '%', 'WARNING'), m('Muscle loss', 6.2, '%', 'WARNING')] },
  { id: 'RPT-2026-0108', type: 'nutrition', name: 'Nutrition & Immune Assessment', createdAt: daysAgo(12, 9), status: 'NORMAL', riskScore: 18, summary: 'Nutritional and immune markers within configured ranges.', measurements: [m('Vitamin D', 34, 'ng/mL', 'NORMAL', '30–100 ng/mL')] },
  { id: 'RPT-2026-0107', type: 'respiration', name: 'Respiratory Assessment', createdAt: daysAgo(15, 8), status: 'NORMAL', riskScore: 9, summary: 'SpO₂ and respiratory rate within range.', measurements: [m('SpO₂', 97, '%', 'NORMAL'), m('Respiratory rate', 15, 'breaths/min', 'NORMAL')] },
  { id: 'RPT-2026-0106', type: 'radiation', name: 'Radiation Assessment', createdAt: daysAgo(23, 10), status: 'NORMAL', riskScore: 24, summary: 'All dose, WBC and DNA-damage entries within configured ranges.', measurements: [m('Cumulative exposure', 0.18, 'Sv')] },
  { id: 'RPT-2026-0105', type: 'gravity', name: 'Microgravity Assessment', createdAt: daysAgo(31, 11), status: 'NORMAL', riskScore: 29, summary: 'Baseline microgravity assessment.', measurements: [m('BMD change', -0.6, '%')] },
  { id: 'RPT-2026-0104', type: 'emergency', name: 'Emergency Vitals Check', createdAt: daysAgo(36, 13), status: 'WARNING', riskScore: 35, summary: 'Heart rate slightly above reference range after exercise.', measurements: [m('Heart rate', 104, 'BPM', 'WARNING', '60–100 BPM')] },
].map((r) => ({ version: 1, finalized: true, abnormal: r.measurements.filter((x) => x.status !== 'NORMAL'), prediction: { condition: 'Demonstration record', factors: [], recommendations: [], source: 'demo' }, ...r }));

export const reportsDb = {
  all() { return store.get('reports', SEED_REPORTS); },
  save(list) { store.set('reports', list); },
};
