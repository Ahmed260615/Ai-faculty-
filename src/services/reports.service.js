import api, { USE_MOCK } from './api';
import { delay, reportsDb } from './mock/db';

/** Reports are immutable once finalised. Corrections are stored as new versions (amendments). */
export async function listReports(filters = {}) {
  if (!USE_MOCK) return (await api.get('/reports', { params: filters })).data;
  await delay(250);
  let list = reportsDb.all().filter((r) => !reportsDb.all().some((o) => o.supersedes === r.id));
  if (filters.type) list = list.filter((r) => r.type === filters.type);
  if (filters.status) list = list.filter((r) => r.status === filters.status);
  if (filters.from) list = list.filter((r) => r.createdAt >= filters.from);
  if (filters.to) list = list.filter((r) => r.createdAt <= filters.to + 'T23:59:59');
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getReport(id) {
  if (!USE_MOCK) return (await api.get(`/reports/${encodeURIComponent(id)}`)).data;
  await delay(200);
  const all = reportsDb.all();
  const r = all.find((x) => x.id === id);
  if (!r) throw { kind: 'api', status: 404, message: 'Report not found.' };
  const previous = all.filter((x) => x.type === r.type && x.createdAt < r.createdAt && !x.supersedes).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null;
  return { ...r, previous, superseded: all.find((x) => x.supersedes === r.id)?.id || null };
}

export async function getLatestByType(type) {
  const list = await listReports({ type });
  return list[0] || null;
}

export async function amendReport(id, note) {
  if (!USE_MOCK) return (await api.post(`/reports/${encodeURIComponent(id)}/amendments`, { note })).data;
  await delay(300);
  const all = reportsDb.all();
  const orig = all.find((r) => r.id === id);
  if (!orig) throw { kind: 'api', message: 'Report not found.' };
  const copy = { ...orig, id: `${id.replace(/-v\d+$/, '')}-v${orig.version + 1}`, version: orig.version + 1, supersedes: id, createdAt: new Date().toISOString(), amendmentNote: note };
  reportsDb.save([copy, ...all]); // original is never modified
  return copy;
}
