import { useEffect, useState } from 'react';
import * as casesApi from '../../api/cases.js';
import { Button, Card } from '../common/ui.jsx';

const ACTIONS = ['', 'connect', 'disconnect', 'auth_success', 'auth_failure'];

export function LogEntryTable({ caseId }) {
  const [filters, setFilters] = useState({ user: '', sourceIp: '', action: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = { page, limit: 50 };
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });

    casesApi
      .getCaseLogs(caseId, params)
      .then(setData)
      .catch(() => setError('Could not load log entries.'));
  }, [caseId, filters, page]);

  function updateFilter(key, value) {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card className="p-0">
      <div className="flex flex-wrap gap-2 border-b border-border p-3">
        <input
          placeholder="Filter by user"
          value={filters.user}
          onChange={(e) => updateFilter('user', e.target.value)}
          className="rounded border border-border bg-surface-alt px-2 py-1 font-mono text-xs text-text-hi placeholder:text-text-lo/50 focus:border-accent"
        />
        <input
          placeholder="Filter by source IP"
          value={filters.sourceIp}
          onChange={(e) => updateFilter('sourceIp', e.target.value)}
          className="rounded border border-border bg-surface-alt px-2 py-1 font-mono text-xs text-text-hi placeholder:text-text-lo/50 focus:border-accent"
        />
        <select
          value={filters.action}
          onChange={(e) => updateFilter('action', e.target.value)}
          className="rounded border border-border bg-surface-alt px-2 py-1 font-mono text-xs text-text-hi focus:border-accent"
        >
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a || 'All actions'}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => updateFilter('from', e.target.value)}
          className="rounded border border-border bg-surface-alt px-2 py-1 font-mono text-xs text-text-hi focus:border-accent"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => updateFilter('to', e.target.value)}
          className="rounded border border-border bg-surface-alt px-2 py-1 font-mono text-xs text-text-hi focus:border-accent"
        />
      </div>

      {error && <p className="p-4 text-sm text-critical">{error}</p>}

      {data === null && !error && <p className="p-4 text-sm text-text-lo">Loading…</p>}

      {data && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border text-left text-text-lo">
                  <th className="px-3 py-2 font-normal">Time (UTC)</th>
                  <th className="px-3 py-2 font-normal">User</th>
                  <th className="px-3 py-2 font-normal">Source IP</th>
                  <th className="px-3 py-2 font-normal">Action</th>
                  <th className="px-3 py-2 font-normal">Location</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e) => (
                  <tr key={e._id} className="border-b border-border/50 text-text-hi last:border-b-0">
                    <td className="px-3 py-2">{new Date(e.timestampUTC).toISOString().replace('T', ' ').slice(0, 19)}</td>
                    <td className="px-3 py-2">{e.user || '—'}</td>
                    <td className="px-3 py-2">{e.sourceIp || '—'}</td>
                    <td className="px-3 py-2 uppercase text-text-lo">{e.action.replace('_', ' ')}</td>
                    <td className="px-3 py-2">{e.geo?.city ? `${e.geo.city}, ${e.geo.country || ''}` : e.geo?.country || '—'}</td>
                  </tr>
                ))}
                {data.entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-text-lo">
                      No entries match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-3 py-2 font-mono text-xs text-text-lo">
            <span>
              {data.pagination.total} total · page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Prev
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
