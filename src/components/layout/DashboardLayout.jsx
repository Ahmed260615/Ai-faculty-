import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import BottomNav from './BottomNav';
import { ArrowUp } from 'lucide-react';
import { AstronautProvider } from '../../context/AstronautContext';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('astrohealth.sidebarCollapsed', false);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setMobile(false); window.scrollTo(0, 0); document.getElementById('main')?.focus({ preventScroll: true }); }, [pathname]);
  return (
    <AstronautProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3 focus:font-bold">Skip to main content</a>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} mobileOpen={mobile} onClose={() => setMobile(false)} />
      <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? 'lg:pl-24' : 'lg:pl-80'}`}>
        <TopNavbar onMenu={() => setMobile(true)} />
        <main id="main" tabIndex={-1} key={pathname} className="reveal mx-auto max-w-[1600px] p-4 pb-32 sm:p-6 sm:pb-32 lg:p-8 lg:pb-12 outline-none"><Outlet /></main>
        <footer className="no-print mx-auto max-w-[1600px] px-6 pb-28 lg:pb-10">
          <div className="hairline pt-8 flex flex-wrap items-end justify-between gap-6">
            <div><p className="text-4xl font-bold leading-none" style={{ letterSpacing: '-0.05em' }}>astrohealth<span className="text-primary">.</span></p>
              <p className="mt-3 max-w-xl text-sm text-muted">A decision-support interface. It does not replace the crew medical officer or the approved spacecraft emergency protocol.</p></div>
            <button type="button" className="arrow-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowUp size={20} aria-hidden="true" /></button>
          </div>
        </footer>
        <BottomNav onMenu={() => setMobile(true)} />
      </div>
    </AstronautProvider>
  );
}
