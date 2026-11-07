import { useEffect, useState } from 'react';
import { loadRanges } from '../config/ranges';
export default function useRanges() {
  const [r, setR] = useState(loadRanges);
  useEffect(() => { const h = () => setR(loadRanges()); window.addEventListener('astrohealth:ranges', h); return () => window.removeEventListener('astrohealth:ranges', h); }, []);
  return r;
}
