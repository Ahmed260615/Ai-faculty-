import { loadRanges } from '../config/ranges';

/** Validate a form against a flat list of field definitions. Returns { key: message }. */
export function validateFields(fields, values) {
  const errors = {};
  for (const f of fields) {
    const raw = values[f.key];
    const empty = raw === undefined || raw === null || String(raw).trim() === '';
    if (empty) { if (f.required) errors[f.key] = `${f.label} is required.`; continue; }
    if (f.type === 'number') {
      const n = Number(raw);
      if (!Number.isFinite(n)) { errors[f.key] = 'Enter a valid number.'; continue; }
      if (f.min !== undefined && n < f.min) errors[f.key] = `Must be at least ${f.min}${f.unit ? ' ' + f.unit : ''}.`;
      else if (f.max !== undefined && n > f.max) errors[f.key] = `Must be at most ${f.max}${f.unit ? ' ' + f.unit : ''}.`;
    }
  }
  const sys = Number(values.systolic), dia = Number(values.diastolic);
  if (!errors.systolic && !errors.diastolic && values.systolic && values.diastolic && sys <= dia) {
    errors.diastolic = 'Diastolic must be lower than systolic.';
  }
  return errors;
}

/**
 * Local laboratory/protocol flagging. This is NOT an AI prediction.
 * ref = laboratory reference interval (configurable per lab). critical = protocol limits.
 */
export function evaluateField(field, value, ranges = loadRanges()) {
  if (value === '' || value === undefined || value === null || field.type !== 'number') return 'UNKNOWN';
  const n = Number(value);
  if (!Number.isFinite(n)) return 'UNKNOWN';
  const ref = ranges[field.key] || field.ref;
  const crit = field.critical;
  if (crit && ((crit.low !== undefined && n < crit.low) || (crit.high !== undefined && n > crit.high))) return 'CRITICAL';
  if (ref && ((ref.low !== undefined && n < ref.low) || (ref.high !== undefined && n > ref.high))) return 'WARNING';
  return ref || crit ? 'NORMAL' : 'UNKNOWN';
}

export function evaluateAll(fields, values) {
  const ranges = loadRanges();
  return fields.map((f) => ({ field: f, value: values[f.key], status: evaluateField(f, values[f.key], ranges), ref: ranges[f.key] || f.ref }));
}

export const refText = (ref, unit) => {
  if (!ref) return null;
  const { low, high } = ref;
  const u = unit ? ` ${unit}` : '';
  if (low !== undefined && high !== undefined) return `${low.toLocaleString()}–${high.toLocaleString()}${u}`;
  if (low !== undefined) return `≥ ${low.toLocaleString()}${u}`;
  return `≤ ${high.toLocaleString()}${u}`;
};
