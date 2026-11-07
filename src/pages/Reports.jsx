import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/data/FilterBar';
import DataTable from '../components/data/DataTable';
import RiskBadge from '../components/ui/RiskBadge';
import ErrorState from '../components/ui/ErrorState';
import useAsync from '../hooks/useAsync';
import { listReports } from '../services/reports.service';
import { TYPE_LABEL } from '../config/nav';
import { fmtDateTime } from '../lib/format';

const CATS = { radiation: 'Radiation Reports', emergency: 'Emergency Reports', psychological: 'Psychological Reports', gravity: 'Gravity & Bone Health Reports', nutrition: 'Nutrition Reports', respiration: 'Respiratory Reports' };
const EMPTY = { type: '', status: '', from: '', to: '', risk: '' };
const RISK = { low: [0, 33], mid: [34, 66], high: [67, 100] };

export default function Reports() {
  const [f, setF] = useState(EMPTY);
  const { data, error, loading, reload } = useAsync(() => listReports({ type: f.type, status: f.status, from: f.from, to: f.to }), [f.type, f.status, f.from, f.to]);
  const rows = (data || []).filter((r) => !f.risk || (r.riskScore != null && r.riskScore >= RISK[f.risk][0] && r.riskScore <= RISK[f.risk][1]));
  const cols = [
    { key: 'id', header: 'Report ID', sortable: true, render: (r) => <span className="font-mono font-semibold">{r.id}</span> },
    { key: 'name', header: 'Report Name', sortable: true, render: (r) => <span className="font-semibold">{r.name}{r.version > 1 && <span className="text-muted"> (v{r.version})</span>}</span> },
    { key: 'type', header: 'Assessment Type', sortable: true, render: (r) => TYPE_LABEL[r.type] },
    { key: 'createdAt', header: 'Date & Time', sortable: true, render: (r) => fmtDateTime(r.createdAt) },
    { key: 'status', header: 'Overall Status', sortable: true, render: (r) => <RiskBadge level={r.status} size="sm" /> },
    { key: 'riskScore', header: 'Risk Score', sortable: true, sortValue: (r) => r.riskScore ?? -1, render: (r) => <span className="font-mono font-semibold">{r.scoreLabel || (r.riskScore != null ? `${r.riskScore} / 100` : '—')}</span> },
    { key: 'a', header: 'Actions', render: (r) => <Link className="btn-secondary !min-h-[3rem]" to={`/reports/${r.id}`}><FileText size={20} aria-hidden="true" /> View</Link> },
  ];
  return (
    <>
      <PageHeader title="History & Reports" ar="التاريخ والتقارير" accent="#3C7896" subtitle="Every generated medical report. Finalised reports are read-only; corrections are stored as new versions." />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Report categories">
        <button className="chip" aria-pressed={!f.type} onClick={() => setF({ ...f, type: '' })}>All</button>
        {Object.entries(CATS).map(([k, l]) => <button key={k} className="chip" aria-pressed={f.type === k} onClick={() => setF({ ...f, type: k })}>{l}</button>)}
      </div>
      <FilterBar values={f} onChange={(k, v) => setF({ ...f, [k]: v })} onReset={() => setF(EMPTY)} filters={[
        { key: 'type', label: 'Assessment Type', options: [{ value: '', label: 'All types' }, ...Object.entries(TYPE_LABEL).map(([value, label]) => ({ value, label }))] },
        { key: 'status', label: 'Medical Status', options: [{ value: '', label: 'Any status' }, { value: 'NORMAL', label: 'Normal' }, { value: 'WARNING', label: 'Warning' }, { value: 'CRITICAL', label: 'Critical' }] },
        { key: 'risk', label: 'Risk Level (score)', options: [{ value: '', label: 'Any' }, { value: 'low', label: 'Low (0–33)' }, { value: 'mid', label: 'Moderate (34–66)' }, { value: 'high', label: 'High (67–100)' }] },
        { key: 'from', label: 'From date', type: 'date' }, { key: 'to', label: 'To date', type: 'date' }]} />
      <div className="card mt-5">
        {error ? <ErrorState error={error} onRetry={reload} /> : loading ? <p role="status" className="text-muted">Loading reports…</p> : <DataTable columns={cols} rows={rows} />}
      </div>
    </>
  );
}
