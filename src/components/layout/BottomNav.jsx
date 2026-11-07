import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Siren, History, Menu } from 'lucide-react';

/** Floating pill navigation for phones/tablets (the sidebar becomes a drawer behind "Menu"). */
export default function BottomNav({ onMenu }) {
  const item = 'flex min-h-[3.5rem] min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-full px-3 text-sm font-semibold';
  return (
    <nav aria-label="Quick navigation" className="no-print glass fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full p-1.5 text-white shadow-2xl lg:hidden">
      <NavLink to="/" end className={({ isActive }) => `${item} ${isActive ? 'bg-white text-sidebar' : 'text-slate-200'}`}><LayoutDashboard size={22} aria-hidden="true" />Home</NavLink>
      <NavLink to="/emergency" className={({ isActive }) => `${item} ${isActive ? 'bg-white text-sidebar' : 'text-slate-200'}`}><Siren size={22} aria-hidden="true" />Emergency</NavLink>
      <NavLink to="/reports" className={({ isActive }) => `${item} ${isActive ? 'bg-white text-sidebar' : 'text-slate-200'}`}><History size={22} aria-hidden="true" />Reports</NavLink>
      <button type="button" onClick={onMenu} aria-controls="sidebar" className={`${item} text-slate-200`}><Menu size={22} aria-hidden="true" />Menu</button>
    </nav>
  );
}
