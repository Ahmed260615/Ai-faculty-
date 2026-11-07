import api, { USE_MOCK } from './api';
import { delay, store, series, reportsDb, dayKey } from './mock/db';

/** PHQ-9 and check-ins. PHQ-9 scoring is deterministic (validated rules), not an AI prediction. */
export async function submitPhq9(result) {
  if (!USE_MOCK) return (await api.post('/assessments/psychological/phq9', result)).data;
  await delay(600);
  const id = `RPT-2026-${String(Math.floor(Date.now() / 1000) % 10000).padStart(4, '0')}`;
  const status = result.item9 > 0 || result.total >= 15 ? 'CRITICAL' : result.total >= 5 ? 'WARNING' : 'NORMAL';
  const report = {
    id, version: 1, finalized: true, type: 'psychological', name: 'PHQ-9 Screening', createdAt: new Date().toISOString(), status, riskScore: null, scoreLabel: `${result.total} / 27`,
    summary: `${result.severity} depressive symptoms (screening result, not a diagnosis).${result.item9 > 0 ? ' Item 9 endorsed — clinical follow-up required.' : ''}`,
    measurements: [{ label: 'PHQ-9 total', value: result.total, unit: '/ 27', status }], abnormal: status === 'NORMAL' ? [] : [{ label: 'PHQ-9 total', value: result.total, unit: '/ 27', status }],
    prediction: { source: 'validated-scoring', condition: `PHQ-9 severity: ${result.severity}`, factors: [], recommendations: [] },
  };
  reportsDb.save([report, ...reportsDb.all()]);
  const hist = store.get('phq', null) || [];
  store.set('phq', [...hist, { date: report.createdAt, total: result.total, severity: result.severity, id }]);
  return report;
}

export async function getPhqHistory() {
  if (!USE_MOCK) return (await api.get('/assessments/psychological/phq9/history')).data;
  await delay(200);
  const now = Date.now(), wk = 14 * 864e5;
  const seed = [7, 6, 5, 4].map((t, i) => ({ date: new Date(now - (4 - i) * wk - 6 * 864e5).toISOString(), total: t, severity: t >= 5 ? 'Mild' : 'Minimal', id: `demo-${i}`, demo: true }));
  return [...seed, ...(store.get('phq', []))];
}

export async function saveCheckin(c) {
  if (!USE_MOCK) return (await api.post('/psychological/checkins', c)).data;
  await delay(250);
  const all = store.get('checkins', []).filter((x) => x.day !== dayKey());
  all.push({ ...c, day: dayKey(), at: new Date().toISOString() });
  store.set('checkins', all);
  return all;
}
export async function getCheckins() {
  if (!USE_MOCK) return (await api.get('/psychological/checkins')).data;
  const mood = series(13, 3.6, 0.8, 5, 0, 0), stress = series(13, 2.6, 0.8, 9, 0, 0);
  const demo = mood.map((m, i) => { const d = new Date(Date.now() - (13 - i) * 864e5); return { day: dayKey(d), mood: Math.round(m), stress: Math.round(stress[i]), demo: true }; });
  return [...demo, ...store.get('checkins', [])];
}
