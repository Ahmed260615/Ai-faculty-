import { statusOf } from '../../config/status';

/** Always icon + text (never colour alone). */
export default function RiskBadge({ level = 'UNKNOWN', size = 'md', className = '' }) {
  const s = statusOf(level);
  const Icon = s.icon;
  const sz = size === 'lg' ? 'text-lg px-4 py-2 gap-2' : size === 'sm' ? 'text-sm px-2.5 py-1 gap-1.5' : 'text-base px-3 py-1.5 gap-2';
  return (
    <span className={`inline-flex items-center rounded-full border-2 font-bold uppercase tracking-wide ${s.bg} ${s.text} ${s.border} ${sz} ${className}`}>
      <Icon aria-hidden="true" size={size === 'lg' ? 22 : 18} />
      {s.label}
    </span>
  );
}
