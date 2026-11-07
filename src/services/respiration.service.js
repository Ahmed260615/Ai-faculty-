import api, { USE_MOCK } from './api';
import { delay, series } from './mock/db';
import { submitAssessment } from './assessment';
import { getLatestByType } from './reports.service';

/** POST /assessments/respiration → Express → FastAPI. */
export const submit = (payload, opts) => submitAssessment('respiration', payload, opts);
export const getPrevious = () => getLatestByType('respiration');

/** GET /respiration/history — DEMONSTRATION series in mock mode. */
export async function getHistory(days = 14) {
  if (!USE_MOCK) return (await api.get('/respiration/history', { params: { days } })).data;
  await delay(200);
  const labels = Array.from({ length: days }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (days - 1 - i)); return d.toISOString(); });
  return { labels, spo2: series(days, 97.5, 1, 21), respRate: series(days, 15, 1.5, 22, 0, 0),
    latest: { recordedAt: labels[days - 1], spo2: 98, respRate: 15, pao2: 92, paco2: 40 } };
}
