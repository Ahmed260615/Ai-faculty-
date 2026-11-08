import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Siren, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AstronautProfile from './AstronautProfile';
import NotificationPanel from '../data/NotificationPanel';
import DemoBadge from '../ui/DemoBadge';
import { USE_MOCK } from '../../services/api';
import { useAstronaut } from '../../context/AstronautContext';
import useNow from '../../hooks/useNow';
import { pad } from '../../lib/format';

export default function TopNavbar({ onMenu }) {
  const { alerts } = useAstronaut();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const now = useNow(1000);
  const { theme, toggle } = useTheme();
  useEffect(() => {
    const h = (e) => { if (open && !box.current?.contains(e.target)) setOpen(false); if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', h);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', h); };
  }, [open]);
  const count = alerts.filter((a) => a.level !== 'NORMAL' || a.kind === 'Upcoming').length;
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-2 sm:gap-3 border-b border-white/10 bg-bg/50 px-4 backdrop-blur-xl sm:px-6">
      <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="AstroHealth home"><span className="text-2xl font-bold" style={{ letterSpacing: '-0.05em' }}>astrohealth<span className="text-primary">.</span></span></Link>
      <div className="hidden sm:block leading-tight">
        <p className="font-mono text-2xl font-semibold" aria-label="Current time">{pad(now.getHours())}:{pad(now.getMinutes())}<span className="text-muted text-lg">:{pad(now.getSeconds())}</span></p>
        <p className="text-sm text-muted">Ship time (local)</p>
      </div>
      {USE_MOCK && <DemoBadge className="hidden xl:inline-flex" />}
      <div className="ml-auto flex items-center gap-2 sm:gap-4 min-w-0">
        <AstronautProfile compact />
        <Link to="/emergency" className="btn-danger !px-4 sm:!px-6" aria-label="Emergency"><Siren size={24} aria-hidden="true" /><span className="hidden sm:inline">Emergency</span></Link>
        <button type="button" className="btn-secondary !px-0 w-12" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to black theme'} title={theme === 'dark' ? 'Light theme' : 'Black theme'}>
          {theme === 'dark' ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />}
        </button>
        <div className="relative" ref={box}>
          <button type="button" className="btn-secondary relative" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true" aria-label={`Notifications, ${count} need attention`}>
            <Bell size={24} aria-hidden="true" />
            {count > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-7 min-w-7 place-items-center rounded-full bg-crit-solid px-1 text-sm font-bold text-white">{count}</span>}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-[min(26rem,92vw)] max-h-[70vh] overflow-auto rounded-xl border border-line glass fade-down">
              <h2 className="px-4 pt-4 text-xl">Notifications</h2>
              <NotificationPanel alerts={alerts} onNavigate={() => setOpen(false)} />
            </div>)}
        </div>
      </div>
    </header>
  );
}
