import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, FileDown, FilePen } from 'lucide-react';
import MedicalReport from '../components/medical/MedicalReport';
import ErrorState from '../components/ui/ErrorState';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import useAsync from '../hooks/useAsync';
import { getReport, amendReport } from '../services/reports.service';
import { useAstronaut } from '../context/AstronautContext';

export default function ReportDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { profile } = useAstronaut();
  const { data, error, loading, reload } = useAsync(() => getReport(id), [id]);
  const [dlg, setDlg] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const exportPdf = () => { const t = document.title; document.title = `AstroHealth-${id}`; window.print(); document.title = t; };
  const amend = async () => {
    if (!note.trim()) { setErr('An amendment note is required.'); return; }
    setBusy(true);
    try { const n = await amendReport(id, note.trim()); setDlg(false); nav(`/reports/${n.id}`); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <>
      <div className="no-print mb-5 flex flex-wrap items-center gap-3">
        <Link to="/reports" className="btn-secondary"><ArrowLeft size={20} aria-hidden="true" /> Return to Reports</Link>
        <button className="btn-primary" onClick={() => window.print()} disabled={!data}><Printer size={20} aria-hidden="true" /> Print Report</button>
        <button className="btn-primary" onClick={exportPdf} disabled={!data} title="Opens the print dialog — choose “Save as PDF”"><FileDown size={20} aria-hidden="true" /> Export PDF</button>
        <button className="btn-secondary ml-auto" onClick={() => { setErr(null); setDlg(true); }} disabled={!data || !!data?.superseded}><FilePen size={20} aria-hidden="true" /> Create Amendment</button>
      </div>
      {error ? <ErrorState error={error} onRetry={reload} title={error.status === 404 ? 'Report not found' : undefined} />
        : loading ? <p role="status" className="text-muted">Loading report…</p> : <MedicalReport report={data} profile={profile} />}
      <ConfirmationDialog open={dlg} title="Create report amendment" confirmLabel={busy ? 'Saving…' : 'Create new version'} onConfirm={amend} onCancel={() => setDlg(false)}>
        <p className="mb-3">Finalised reports cannot be edited. This records a <strong>new version</strong> that references {id}; the original stays unchanged.</p>
        <label className="label" htmlFor="amend-note">Reason for amendment *</label>
        <textarea id="amend-note" className="field !py-3" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        {err && <p role="alert" className="mt-2 font-semibold text-crit-dark">{err}</p>}
      </ConfirmationDialog>
    </>
  );
}
