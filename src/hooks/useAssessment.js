import { useCallback, useRef, useState } from 'react';

/**
 * Assessment state machine:
 * idle → validation_error | submitting → ai_processing → success | warning | critical | error | timeout
 * `retry` re-sends the last payload. `cancel` aborts the in-flight request.
 */
export default function useAssessment(submitFn) {
  const [state, setState] = useState({ phase: 'idle', result: null, error: null });
  const last = useRef(null);
  const ctrl = useRef(null);

  const run = useCallback(async (payload) => {
    last.current = payload;
    ctrl.current = new AbortController();
    setState({ phase: 'submitting', result: null, error: null });
    const t = setTimeout(() => setState((s) => (s.phase === 'submitting' ? { ...s, phase: 'ai_processing' } : s)), 400);
    try {
      const result = await submitFn(payload, { signal: ctrl.current.signal });
      const phase = result.status === 'CRITICAL' ? 'critical' : result.status === 'WARNING' ? 'warning' : 'success';
      setState({ phase, result, error: null });
    } catch (e) {
      if (e?.kind === 'cancelled') setState({ phase: 'idle', result: null, error: null });
      else setState({ phase: e?.kind === 'timeout' ? 'timeout' : 'error', result: null, error: e });
    } finally { clearTimeout(t); }
  }, [submitFn]);

  return {
    ...state, run,
    retry: () => last.current && run(last.current),
    cancel: () => ctrl.current?.abort(),
    reset: () => setState({ phase: 'idle', result: null, error: null }),
    setValidationError: () => setState({ phase: 'validation_error', result: null, error: null }),
  };
}
