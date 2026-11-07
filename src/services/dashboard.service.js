import api, { USE_MOCK } from './api';
import { delay, series, daysAgo } from './mock/db';
import { listReports } from './reports.service';
import { ASSESSMENTS } from '../config/nav';

export async function getProfile() {
  if (!USE_MOCK) return (await api.get('/astronaut/profile')).data;
  const reports = await listReports();
  const last = reports[0];
  const worstRank = { NORMAL: 0, WARNING: 1, CRITICAL: 2 };
  const recent = reports.slice(0, 5).reduce((a, r) => (worstRank[r.status] > worstRank[a] ? r.status : a), 'NORMAL');
  return { id: 'AST-0427 (demo)', name: 'Demonstration Crew Member', mission: 'Demo Mission', missionDay: 142, missionDays: 365, status: recent, lastAssessment: last?.createdAt || null, demo: true };
}

export async function getSummary() {
  if (!USE_MOCK) return (await api.get('/dashboard/summary')).data;
  await delay(200);
  const t = (n) => daysAgo(0, 8).replace(/T.*/, 'T' + String(8 + n).padStart(2, '0') + ':15:00.000Z');
  return [
    { key: 'overall', title: 'Overall Health', icon: 'heart', value: 'Stable', status: 'WARNING', trend: 'flat', trendText: 'No change', updated: t(0) },
    { key: 'radiation', title: 'Radiation Exposure', icon: 'radiation', value: '0.21', unit: 'Sv cumulative', status: 'WARNING', trend: 'up', trendText: '+0.02 Sv / 30 d', updated: t(1) },
    { key: 'cardio', title: 'Cardiovascular', icon: 'activity', value: '72', unit: 'BPM resting', status: 'NORMAL', trend: 'flat', trendText: 'Stable', updated: t(0) },
    { key: 'bone', title: 'Bone Health', icon: 'bone', value: '−1.4', unit: '% BMD change', status: 'WARNING', trend: 'down', trendText: '−0.3 % / 30 d', updated: t(0) },
    { key: 'muscle', title: 'Muscle Health', icon: 'dumbbell', value: '6.2', unit: '% muscle loss', status: 'WARNING', trend: 'up', trendText: '+0.4 % / 30 d', updated: t(0) },
    { key: 'psych', title: 'Psychological Status', icon: 'brain', value: '4 / 27', unit: 'PHQ-9 · Minimal', status: 'NORMAL', trend: 'down', trendText: 'Improving', updated: t(0) },
    { key: 'resp', title: 'Respiratory Status', icon: 'wind', value: '98', unit: '% SpO₂', status: 'NORMAL', trend: 'flat', trendText: 'Stable', updated: t(0) },
  ];
}

export async function getAnalytics(days = 14) {
  if (!USE_MOCK) return (await api.get('/dashboard/analytics', { params: { days } })).data;
  await delay(250);
  const labels = Array.from({ length: days }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (days - 1 - i)); return d.toISOString(); });
  const cum = []; let acc = 0.15;
  series(days, 0.0016, 0.0008, 11, 0, 4).forEach((v) => { acc += v; cum.push(+acc.toFixed(3)); });
  return {
    labels,
    heartRate: series(days, 72, 6, 1), systolic: series(days, 118, 6, 2, 0, 0), diastolic: series(days, 76, 4, 3, 0, 0),
    spo2: series(days, 97.6, 1, 4), radiationDaily: series(days, 0.0016, 0.0008, 11, 0, 4), radiationCumulative: cum,
    bone: series(days, -1.1, 0.04, 6, -0.3, 2), muscle: series(days, 31.4, 0.15, 7, -0.6, 2),
    sleepHours: series(days, 6.9, 0.9, 8), sleepQuality: series(days, 78, 8, 9, 0, 0),
    mood: series(days, 3.8, 0.7, 10, 0, 1), stress: series(days, 2.6, 0.7, 12, 0, 1),
  };
}

export async function getAlerts() {
  if (!USE_MOCK) return (await api.get('/notifications')).data;
  await delay(150);
  return [
    { id: 'a1', level: 'WARNING', kind: 'Warning', title: 'Lymphocyte count below configured lab range', detail: 'Radiation assessment RPT-2026-0112', at: daysAgo(2, 10), to: '/reports/RPT-2026-0112' },
    { id: 'a2', level: 'WARNING', kind: 'Warning', title: 'Bone density change above planning threshold', detail: 'Microgravity assessment RPT-2026-0109', at: daysAgo(9, 11), to: '/reports/RPT-2026-0109' },
    { id: 'a3', level: 'NORMAL', kind: 'Upcoming', title: 'Medical assessment scheduled 15:15 – 15:45', detail: 'From the daily schedule', at: daysAgo(0, 8), to: '/psychological' },
    { id: 'a4', level: 'WARNING', kind: 'Missed', title: 'Weekly respiratory assessment is overdue', detail: 'Last completed 15 days ago', at: daysAgo(1, 8), to: '/nutrition/respiration' },
    { id: 'a5', level: 'NORMAL', kind: 'Recommendation', title: 'Review the resistance training program', detail: 'Muscle loss trending above target', at: daysAgo(0, 7), to: '/gravity/exercises' },
  ];
}

/** Assessment centre rows: catalogue + latest report per type. */
export async function getAssessmentCenter() {
  const reports = await listReports();
  return Object.values(ASSESSMENTS).map((a) => {
    const last = reports.find((r) => r.type === a.type);
    return { ...a, lastDate: last?.createdAt || null, lastStatus: last?.status || 'UNKNOWN' };
  });
}
