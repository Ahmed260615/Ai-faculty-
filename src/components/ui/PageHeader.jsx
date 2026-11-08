import HeroImage from './HeroImage';
import Eyebrow from './Eyebrow';
import Segmented from './Segmented';

/** Page title block. `hero` renders the supplied reference image prominently above the title. */
export default function PageHeader({ title, ar, subtitle, hero, accent = '#3C7896', tabs, eyebrow, counter, children }) {
  return (
    <header className="mb-6">
      <div className="card reveal !p-0 overflow-hidden !rounded-3xl">
        {hero && <HeroImage name={hero} />}
        <div className="p-5 sm:p-6 grid-bg flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow right={counter} className="mb-3"><span className="text-primary">●</span>{eyebrow || 'AstroHealth'}</Eyebrow>
            <h1 className="flex flex-wrap items-baseline gap-x-4">
              <span>{title}</span>
              {ar && <span lang="ar" dir="rtl" className="arabic text-2xl font-medium text-muted/80">{ar}</span>}
            </h1>
            {subtitle && <p className="mt-2 text-lg text-muted max-w-3xl">{subtitle}</p>}
          </div>
          {children && <div className="flex flex-wrap gap-3">{children}</div>}
        </div>
        {tabs && (
          <div className="px-5 sm:px-6 pb-5"><Segmented label="Section pages" items={tabs.map((t) => ({ to: t.to, end: t.end, label: t.label }))} /></div>
        )}
      </div>
    </header>
  );
}
