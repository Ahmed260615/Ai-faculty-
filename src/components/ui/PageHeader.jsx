import { NavLink } from 'react-router-dom';
import HeroImage from './HeroImage';

/** Page title block. `hero` renders the supplied reference image prominently above the title. */
export default function PageHeader({ title, ar, subtitle, hero, accent = '#3C7896', tabs, children }) {
  return (
    <header className="mb-6">
      <div className="card !p-0 overflow-hidden" style={{ borderTop: `5px solid ${accent}` }}>
        {hero && <HeroImage name={hero} />}
        <div className="p-5 sm:p-6 grid-bg flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-baseline gap-x-4">
              <span>{title}</span>
              {ar && <span lang="ar" dir="rtl" className="arabic text-2xl font-semibold text-muted">{ar}</span>}
            </h1>
            {subtitle && <p className="mt-2 text-lg text-muted max-w-3xl">{subtitle}</p>}
          </div>
          {children && <div className="flex flex-wrap gap-3">{children}</div>}
        </div>
        {tabs && (
          <nav aria-label="Section pages" className="flex flex-wrap gap-2 px-5 sm:px-6 pb-4">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive }) => `chip ${isActive ? '!bg-primary !text-white !border-primary' : ''}`}>{t.label}</NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
