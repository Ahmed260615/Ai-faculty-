import { PHOTOS } from '../../data/photos';

/** NASA photograph inside the black/gray/green palette (gray-leaning duotone via .photo). Caption sits on a dark scrim. */
export default function Photo({ name, ratio = 'aspect-[16/10]', caption = true, className = '', children, eager }) {
  const ph = PHOTOS[name];
  if (!ph) return null;
  return (
    <figure className={`photo-frame rounded-[inherit] ${ratio} ${className}`}>
      <img src={ph.src} alt={ph.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className="photo absolute inset-0 h-full w-full object-cover" style={{ objectPosition: ph.pos }} />
      {caption && <figcaption className="absolute inset-x-0 bottom-0 z-10 p-3 text-sm font-semibold leading-snug text-white">{ph.caption}</figcaption>}
      {children}
    </figure>
  );
}
