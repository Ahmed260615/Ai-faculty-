import { createContext, useContext } from 'react';
import useAsync from '../hooks/useAsync';
import { getProfile, getAlerts } from '../services/dashboard.service';

const Ctx = createContext({ profile: null, alerts: [] });
export const useAstronaut = () => useContext(Ctx);

export function AstronautProvider({ children }) {
  const p = useAsync(getProfile, []);
  const a = useAsync(getAlerts, []);
  return <Ctx.Provider value={{ profile: p.data, alerts: a.data || [], reload: () => { p.reload(); a.reload(); } }}>{children}</Ctx.Provider>;
}
