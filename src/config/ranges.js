/**
 * Laboratory reference intervals are CONFIGURABLE. Defaults in each field definition are
 * demonstration values only; the astronaut/lab can override them per field (stored locally
 * here; in production these come from the lab profile via Express).
 */
const KEY = 'astrohealth.labRanges.v1';
export function loadRanges() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
export function saveRange(fieldKey, range) {
  try {
    const all = loadRanges();
    if (range) all[fieldKey] = range; else delete all[fieldKey];
    localStorage.setItem(KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('astrohealth:ranges'));
  } catch { /* storage unavailable: ranges simply stay at defaults */ }
}
