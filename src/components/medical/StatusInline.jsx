import { statusOf } from '../../config/status';
export default function StatusInline({ status }) {
  if (!status || status === 'UNKNOWN') return null;
  const s = statusOf(status); const Icon = s.icon;
  return <span className={`inline-flex items-center gap-1.5 font-bold ${s.text}`}><Icon size={20} aria-hidden="true" />{s.label}</span>;
}
