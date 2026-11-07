import api, { USE_MOCK } from './api';
import { delay, daysAgo } from './mock/db';
import { submitAssessment } from './assessment';
import { getLatestByType } from './reports.service';

/** POST /assessments/emergency → Express → FastAPI. */
export const submit = (payload, opts) => submitAssessment('emergency', payload, opts);
export const getPrevious = () => getLatestByType('emergency');


/** GET /emergency/last-vitals — DEMONSTRATION values in mock mode. */
export async function getLastVitals() {
  if (!USE_MOCK) return (await api.get('/emergency/last-vitals')).data;
  await delay(150);
  const t = daysAgo(4, 14);
  return { recordedAt: t, heartRate: 72, systolic: 118, diastolic: 76, spo2: 98, respRate: 15, temperature: 36.8, ecg: 'Normal sinus rhythm', glucose: 96 };
}
