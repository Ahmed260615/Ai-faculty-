import { Link } from 'react-router-dom';
import { Bell, CalendarClock, CalendarX, Lightbulb, TriangleAlert, OctagonAlert } from 'lucide-react';
import { statusOf } from '../../config/status';
import { ago } from '../../lib/format';
import EmptyState from '../ui/EmptyState';

const KIND_ICON = { Warning: TriangleAlert, Critical: OctagonAlert, Upcoming: CalendarClock, Missed: CalendarX, Recommendation: Lightbulb };

export default function NotificationPanel({ alerts = [], onNavigate }) {
  if (!alerts.length) return <EmptyState icon={Bell} title="No alerts">You are all caught up.</EmptyState>;
  return (
    <ul className="divide-y divide-line">
      {alerts.map((a) => {
        const Icon = KIND_ICON[a.kind] || Bell; const s = statusOf(a.level);
        return (
          <li key={a.id}>
            <Link to={a.to || '#'} onClick={onNavigate} className="flex gap-3 items-start p-4 min-h-touch hover:bg-bg">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.bg} ${s.text}`}><Icon size={24} aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-bold uppercase tracking-wide text-muted">{a.kind}</span>
                <span className="block font-semibold">{a.title}</span>
                <span className="block text-sm text-muted">{a.detail} · {ago(a.at)}</span>
              </span>
            </Link>
          </li>);
      })}
    </ul>
  );
}
