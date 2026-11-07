import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
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
        <main id="main" tabIndex={-1} className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8 outline-none"><Outlet /></main>
        <footer className="px-6 pb-8 text-center text-sm text-muted no-print">AstroHealth is a decision-support interface. It does not replace the crew medical officer or the approved spacecraft emergency protocol.</footer>
      </div>
    </AstronautProvider>
  );
}
