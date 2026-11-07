export const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
export const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' }) : '—';
export const fmtShort = (iso) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
export const ago = (iso) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
};
export const pad = (n) => String(n).padStart(2, '0');
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
