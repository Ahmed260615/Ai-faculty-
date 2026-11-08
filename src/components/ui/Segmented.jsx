import { NavLink } from 'react-router-dom';

/** Pill segmented control. Pass `items` with `to` for route tabs, or `value`/`onChange` for state. */
export default function Segmented({ items, value, onChange, label, dark }) {
  const base = `flex w-full flex-col gap-1 rounded-3xl p-1 sm:inline-flex sm:w-auto sm:max-w-full sm:flex-row sm:flex-wrap sm:rounded-full ${dark ? 'glass' : 'border border-line bg-surface'}`;
  const on = dark ? 'bg-white text-sidebar' : 'bg-primary text-black';
  const off = dark ? 'text-slate-200 hover:bg-white/10' : 'text-ink hover:bg-primary-light';
  const cls = 'inline-flex min-h-[3rem] items-center justify-center rounded-full px-5 text-center font-semibold transition-colors';
  return (
    <div role={onChange ? 'group' : undefined} aria-label={label} className={base}>
      {items.map((it) => it.to ? (
        <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => `${cls} ${isActive ? on : off}`}>{it.label}</NavLink>
      ) : (
        <button key={it.value} type="button" aria-pressed={value === it.value} onClick={() => onChange(it.value)} className={`${cls} ${value === it.value ? on : off}`}>{it.label}</button>
      ))}
    </div>
  );
}
