import { NavLink, useLocation } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, X, Orbit } from 'lucide-react';
import { NAV } from '../../config/nav';
import AstronautProfile from './AstronautProfile';

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const { pathname } = useLocation();
  const narrow = collapsed && !mobileOpen;
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-sidebar/60 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside id="sidebar" aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-white transition-[width,transform] duration-200 ${narrow ? 'lg:w-24' : 'lg:w-80'} w-80 max-w-[88vw] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between gap-2 px-4 h-20 border-b border-white/10 shrink-0">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3 min-h-touch" aria-label="AstroHealth home">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary"><Orbit size={28} aria-hidden="true" /></span>
            {!narrow && <span><span className="block text-xl font-bold leading-none">AstroHealth</span><span className="block whitespace-nowrap text-sm text-secondary">Crew health monitoring</span></span>}
          </NavLink>
          <button type="button" className="lg:hidden btn-ghost !text-white hover:!bg-white/10" onClick={onClose} aria-label="Close navigation"><X size={26} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {!narrow && <p className="eyebrow !text-slate-400 px-3 pb-2">Navigation<span className="float-right font-mono">01 — 07</span></p>}
          {NAV.map((n) => {
            const Icon = n.icon;
            const section = n.children ? pathname.startsWith(n.to) : false;
            return (
              <div key={n.to}>
                <NavLink to={n.to} end={n.end} onClick={onClose} title={narrow ? n.en : undefined} aria-label={narrow ? n.en : undefined}
                  className={({ isActive }) => `flex items-center gap-3 min-h-[3.5rem] rounded-2xl px-3 font-semibold ${isActive || section ? 'bg-primary text-white' : 'text-slate-200 hover:bg-white/10'} ${narrow ? 'justify-center' : ''}`}>
                  <Icon size={26} aria-hidden="true" className="shrink-0" />
                  {!narrow && <span className="min-w-0 leading-tight"><span className="block truncate">{n.en}</span><span lang="ar" dir="rtl" className="arabic block text-sm font-medium opacity-80">{n.ar}</span></span>}
                </NavLink>
                {!narrow && n.children && section && (
                  <div className="ml-6 mt-1 border-l-2 border-white/15 pl-3 space-y-1">
                    {n.children.map((c) => (
                      <NavLink key={c.to} to={c.to} end={c.end} onClick={onClose}
                        className={({ isActive }) => `block rounded-lg px-3 py-2.5 min-h-[2.75rem] text-base ${isActive ? 'bg-white/15 font-bold text-white' : 'text-slate-300 hover:bg-white/10'}`}>{c.en}</NavLink>))}
                  </div>)}
              </div>);
          })}
        </nav>
        {!narrow && <div className="p-3 shrink-0"><AstronautProfile /></div>}
        <button type="button" onClick={onToggle} className="hidden lg:flex items-center justify-center gap-2 h-14 border-t border-white/10 text-slate-300 hover:bg-white/10 shrink-0" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}>
          {collapsed ? <ChevronsRight size={24} /> : <><ChevronsLeft size={24} /> Collapse</>}
        </button>
      </aside>
    </>
  );
}
