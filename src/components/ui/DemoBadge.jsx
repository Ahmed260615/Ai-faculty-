import { FlaskConical } from 'lucide-react';
export default function DemoBadge({ children = 'Demonstration data', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary bg-primary-light px-3 py-1 text-sm font-semibold text-primary-dark ${className}`}>
      <FlaskConical size={16} aria-hidden="true" /> {children}
    </span>
  );
}
