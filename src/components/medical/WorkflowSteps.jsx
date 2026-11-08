import { Check } from 'lucide-react';

const STEPS = ['Measure', 'Validate', 'AI analysis', 'Report'];
const AT = { idle: 0, validation_error: 1, submitting: 2, ai_processing: 2, error: 2, timeout: 2, success: 3, warning: 3, critical: 3 };

/** Numbered 01–04 stepper (numbered-process style). Shows where the assessment currently is. */
export default function WorkflowSteps({ phase }) {
  const cur = AT[phase] ?? 0; const failed = phase === 'error' || phase === 'timeout' || phase === 'validation_error';
  return (
    <ol className="grid grid-cols-2 gap-x-4 border-y border-line py-3 sm:grid-cols-4" aria-label="Assessment progress">
      {STEPS.map((s, i) => {
        const done = i < cur || (i === cur && cur === 3), now = i === cur && !done;
        return (
          <li key={s} aria-current={now ? 'step' : undefined} className={`flex min-h-[3rem] items-center gap-3 ${now ? 'text-ink' : done ? 'text-ok-dark' : 'text-muted'}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 font-mono text-sm font-semibold ${done ? 'border-ok bg-ok-bg' : now ? (failed ? 'border-crit-dark bg-crit-bg text-crit-dark' : 'border-primary bg-primary text-black') : 'border-line'}`}>
              {done ? <Check size={16} aria-hidden="true" /> : String(i + 1).padStart(2, '0')}
            </span>
            <span className={`font-semibold ${now ? '' : 'font-medium'}`}>{s}{now && failed ? ' — attention' : ''}</span>
          </li>);
      })}
    </ol>
  );
}
