import { CheckCircle2, AlertTriangle, OctagonAlert, HelpCircle } from 'lucide-react';

/** Status is never conveyed by colour alone: every level has a label AND an icon. */
export const STATUS = {
  NORMAL: { label: 'Normal', ar: 'طبيعي', icon: CheckCircle2, text: 'text-ok-dark', bg: 'bg-ok-bg', border: 'border-ok', solid: 'bg-ok', hex: '#34D382', rank: 0 },
  WARNING: { label: 'Warning', ar: 'تحذير', icon: AlertTriangle, text: 'text-warn-dark', bg: 'bg-warn-bg', border: 'border-warn', solid: 'bg-warn', hex: '#E8B554', rank: 1 },
  CRITICAL: { label: 'Critical', ar: 'حرج', icon: OctagonAlert, text: 'text-crit-dark', bg: 'bg-crit-bg', border: 'border-crit', solid: 'bg-crit', hex: '#E86464', rank: 2 },
  UNKNOWN: { label: 'No data', ar: 'لا بيانات', icon: HelpCircle, text: 'text-muted', bg: 'bg-line/40', border: 'border-line', solid: 'bg-slate-400', hex: '#8A97A5', rank: -1 },
};
export const statusOf = (s) => STATUS[s] || STATUS.UNKNOWN;
export const worst = (list) => list.reduce((a, b) => (statusOf(b).rank > statusOf(a).rank ? b : a), 'NORMAL');
