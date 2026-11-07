import { CheckCircle2, AlertTriangle, OctagonAlert, HelpCircle } from 'lucide-react';

/** Status is never conveyed by colour alone: every level has a label AND an icon. */
export const STATUS = {
  NORMAL: { label: 'Normal', ar: 'طبيعي', icon: CheckCircle2, text: 'text-ok-dark', bg: 'bg-ok-bg', border: 'border-ok', solid: 'bg-ok', hex: '#2E9D78', rank: 0 },
  WARNING: { label: 'Warning', ar: 'تحذير', icon: AlertTriangle, text: 'text-warn-dark', bg: 'bg-warn-bg', border: 'border-warn', solid: 'bg-warn', hex: '#D9A441', rank: 1 },
  CRITICAL: { label: 'Critical', ar: 'حرج', icon: OctagonAlert, text: 'text-crit-dark', bg: 'bg-crit-bg', border: 'border-crit', solid: 'bg-crit', hex: '#D75C5C', rank: 2 },
  UNKNOWN: { label: 'No data', ar: 'لا بيانات', icon: HelpCircle, text: 'text-muted', bg: 'bg-slate-100', border: 'border-slate-300', solid: 'bg-slate-400', hex: '#8A97A5', rank: -1 },
};
export const statusOf = (s) => STATUS[s] || STATUS.UNKNOWN;
export const worst = (list) => list.reduce((a, b) => (statusOf(b).rank > statusOf(a).rank ? b : a), 'NORMAL');
