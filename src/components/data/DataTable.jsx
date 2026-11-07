import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function DataTable({ columns, rows, rowKey = 'id', pageSize = 8, empty }) {
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(0);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const val = (r) => (col.sortValue ? col.sortValue(r) : r[col.key]);
    return [...rows].sort((a, b) => { const x = val(a), y = val(b); const c = x > y ? 1 : x < y ? -1 : 0; return sort.dir === 'asc' ? c : -c; });
  }, [rows, sort, columns]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = sorted.slice(cur * pageSize, cur * pageSize + pageSize);
  if (!rows.length) return empty || <EmptyState title="No records match the current filters" />;
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[56rem] text-left">
          <thead className="bg-primary-light">
            <tr>{columns.map((c) => (
              <th key={c.key} scope="col" className="px-4 py-3 font-bold whitespace-nowrap" aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {c.sortable ? (
                  <button type="button" className="inline-flex items-center gap-1.5 min-h-[2.75rem] font-bold" onClick={() => setSort((s) => (s?.key === c.key && s.dir === 'asc' ? { key: c.key, dir: 'desc' } : { key: c.key, dir: 'asc' }))}>
                    {c.header}{sort?.key === c.key ? (sort.dir === 'asc' ? <ArrowUp size={18} aria-hidden="true" /> : <ArrowDown size={18} aria-hidden="true" />) : <ChevronsUpDown size={18} aria-hidden="true" className="text-muted" />}
                  </button>) : c.header}
              </th>))}</tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r[rowKey]} className="border-t border-line hover:bg-bg">
                {columns.map((c) => <td key={c.key} className="px-4 py-3 align-middle">{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-muted">Page {cur + 1} of {pages} · {sorted.length} records</p>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={cur === 0} onClick={() => setPage(cur - 1)}>Previous</button>
            <button className="btn-secondary" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Next</button>
          </div>
        </div>)}
    </div>
  );
}
