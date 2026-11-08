import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { applyChartTheme } from '../lib/chart';

const Ctx = createContext({ theme: 'dark', toggle: () => {} });
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  useMemo(() => applyChartTheme(theme), [theme]); // sync before charts render
  const toggle = useCallback(() => setTheme((t) => {
    const n = t === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem('astrohealth.theme', n); } catch { /* ignore */ }
    return n;
  }), []);
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}
