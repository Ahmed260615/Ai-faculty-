import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** Accessible modal confirm. Also used (without confirm) as a generic modal via `children`. */
export default function ConfirmationDialog({ open, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, onConfirm, onCancel, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCancel?.(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [open, onCancel]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 fade-in" onClick={onCancel}>
      <div role="dialog" aria-modal="true" aria-labelledby="dlg-title" tabIndex={-1} ref={ref} onClick={(e) => e.stopPropagation()}
        className={`card pop !bg-surface/80 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-auto p-6 sm:p-8`}>
        <h2 id="dlg-title" className="mb-3">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel}>{cancelLabel}</button>
          {onConfirm && <button type="button" className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmLabel}</button>}
        </div>
      </div>
    </div>, document.body);
}
