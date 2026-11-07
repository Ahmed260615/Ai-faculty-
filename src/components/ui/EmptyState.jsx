import { Inbox } from 'lucide-react';
export default function EmptyState({ icon: Icon = Inbox, title, children, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-4 text-muted" role="status">
      <Icon size={44} aria-hidden="true" className="text-secondary" />
      <p className="text-xl font-semibold text-ink">{title}</p>
      {children && <p className="max-w-md">{children}</p>}
      {action}
    </div>
  );
}
