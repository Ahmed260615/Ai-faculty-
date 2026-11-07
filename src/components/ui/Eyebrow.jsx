/** Small wide-tracked label, optionally with a right-aligned counter (e.g. "01 — 09"). */
export default function Eyebrow({ children, right, dot, className = '' }) {
  return (
    <p className={`eyebrow flex items-center justify-between gap-3 ${className}`}>
      <span className="flex items-center gap-2">{dot && <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />}{children}</span>
      {right && <span className="shrink-0 whitespace-nowrap font-mono tabular-nums">{right}</span>}
    </p>
  );
}
