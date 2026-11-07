import { OctagonAlert } from 'lucide-react';
import { PROTOCOL_INSTRUCTIONS } from '../../config/assessments';

/** Shown locally and immediately — independent of the AI service. */
export default function CriticalAlert({ items }) {
  if (!items.length) return null;
  return (
    <div role="alert" className="pulse-crit sticky top-24 z-10 rounded-2xl border-4 border-crit bg-crit-bg p-5 sm:p-6">
      <div className="flex items-center gap-3 text-crit-dark"><OctagonAlert size={40} aria-hidden="true" /><h2 className="!text-crit-dark">CRITICAL VALUE — ACT NOW</h2></div>
      <ul className="mt-3 text-lg font-semibold">
        {items.map((i) => <li key={i.field.key}>{i.field.label}: <span className="font-mono">{i.value} {i.field.unit}</span> — outside protocol limits</li>)}
      </ul>
      <ol className="mt-3 list-decimal pl-6 text-lg font-bold text-crit-dark">{PROTOCOL_INSTRUCTIONS.map((p) => <li key={p}>{p}</li>)}</ol>
      <p className="mt-3 text-sm text-crit-dark">Protocol limits shown here are demonstration values and must be replaced with the approved spacecraft emergency protocol.</p>
    </div>
  );
}
