import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
export default function ArrowLink({ to, onClick, children, className = '' }) {
  const c = `arrow-link ${className}`;
  return to ? <Link to={to} className={c}>{children}<ArrowUpRight size={20} aria-hidden="true" /></Link>
    : <button type="button" onClick={onClick} className={c}>{children}<ArrowUpRight size={20} aria-hidden="true" /></button>;
}
