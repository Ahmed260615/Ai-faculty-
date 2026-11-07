import api, { USE_MOCK, AI_TIMEOUT_MS } from './api';
import { delay, reportsDb } from './mock/db';
import { CONFIGS, flatFields } from '../config/assessments';
import { evaluateAll, refText } from '../lib/validate';
import { statusOf, worst } from '../config/status';
import { TYPE_LABEL } from '../config/nav';

/**
 * Shared submission used by every AI-backed assessment.
 * Real flow: POST Express /assessments/:type  →  Express calls FastAPI  →  stores the report in PostgreSQL  →  returns it.
 * Expected response shape: see docs/API_CONTRACT.md
 */
export async function submitAssessment(type, payload, { signal } = {}) {
  if (!USE_MOCK) {
    const { data } = await api.post(`/assessments/${type}`, payload, { signal, timeout: AI_TIMEOUT_MS });
    return data;
  }
  return mockAssess(type, payload, signal);
}

async function mockAssess(type, payload, signal) {
  const sim = new URLSearchParams(window.location.search).get('simulate'); // ?simulate=timeout|error for UI-state QA
  await new Promise((res, rej) => {
    const t = setTimeout(res, 2200);
    signal?.addEventListener('abort', () => { clearTimeout(t); rej({ kind: 'cancelled' }); });
  });
  if (sim === 'timeout') throw { kind: 'timeout', message: 'The analysis service did not respond in time.' };
  if (sim === 'error') throw { kind: 'api', status: 502, message: 'The AI service is unavailable (simulated).' };

  const fields = flatFields(CONFIGS[type]);
  const rows = evaluateAll(fields, payload).filter((r) => r.status !== 'UNKNOWN' || r.value !== undefined);
  const abnormal = rows.filter((r) => r.status === 'WARNING' || r.status === 'CRITICAL');
  const status = worst(rows.map((r) => r.status));
  const crit = abnormal.filter((r) => r.status === 'CRITICAL').length;
  const riskScore = Math.min(100, abnormal.length * 12 + crit * 25);
  const groupRisk = (g) => {
    const rs = evaluateAll(g.fields, payload).filter((r) => r.status === 'WARNING' || r.status === 'CRITICAL');
    return { label: g.title.replace(/^[A-Z]\.\s*/, ''), status: rs.some((r) => r.status === 'CRITICAL') ? 'CRITICAL' : rs.length ? 'WARNING' : 'NORMAL', score: Math.min(100, rs.length * 20) };
  };
  const prev = reportsDb.all().filter((r) => r.type === type).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const id = `RPT-2026-${String(Math.floor(Date.now() / 1000) % 10000).padStart(4, '0')}`;
  const report = {
    id, version: 1, finalized: true, type, name: `${TYPE_LABEL[type]} Assessment`, createdAt: new Date().toISOString(), status, riskScore,
    summary: abnormal.length ? `${abnormal.length} measurement(s) outside configured reference limits.` : 'All entered measurements are within configured reference limits.',
    measurements: rows.filter((r) => r.value !== undefined && r.value !== '').map((r) => ({ label: r.field.label, value: r.value, unit: r.field.unit, status: r.status, ref: refText(r.ref, r.field.unit) })),
    abnormal: abnormal.map((r) => ({ label: r.field.label, value: r.value, unit: r.field.unit, status: r.status, ref: refText(r.ref, r.field.unit) })),
    prediction: {
      source: 'demo',
      condition: 'DEMONSTRATION OUTPUT — no AI model is connected. Status derived only from configured reference limits.',
      // confidence intentionally omitted: it must only ever come from the real model
      factors: abnormal.map((r) => `${r.field.label} ${statusOf(r.status).label.toLowerCase()} (${r.value} ${r.field.unit})`),
      recommendations: abnormal.length ? ['Review abnormal values with the crew medical officer.'] : [],
      subRisks: CONFIGS[type].groups.length > 1 ? CONFIGS[type].groups.map(groupRisk) : undefined,
    },
    comparison: prev ? { previousId: prev.id, previousScore: prev.riskScore, previousStatus: prev.status, previousDate: prev.createdAt } : null,
  };
  reportsDb.save([report, ...reportsDb.all()]);
  return { reportId: id, ...report.prediction, status, riskScore, comparison: report.comparison, report };
}
