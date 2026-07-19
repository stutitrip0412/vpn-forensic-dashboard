import { useEffect, useState } from 'react';
import * as casesApi from '../../api/cases.js';
import { Card } from '../common/ui.jsx';

function formatDuration(ms) {
  if (ms < 0) return '—';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

/**
 * Pairs connect/disconnect entries sharing a sessionId into single rows
 * with a duration; entries without a matching pair (e.g. a session still
 * open, or WireGuard/syslog formats that don't produce sessionId at all —
 * see backend parser comments) are shown as standalone events.
 */
function pairSessions(entries) {
  const bySession = new Map();
  const standalone = [];

  for (const entry of entries) {
    if (!entry.sessionId) {
      standalone.push({ kind: 'standalone', entry });
      continue;
    }
    if (!bySession.has(entry.sessionId)) bySession.set(entry.sessionId, {});
    const pair = bySession.get(entry.sessionId);
    if (entry.action === 'connect') pair.connect = entry;
    if (entry.action === 'disconnect') pair.disconnect = entry;
  }

  const paired = [...bySession.values()].map((pair) => ({ kind: 'session', ...pair }));
  return [...paired, ...standalone].sort((a, b) => {
    const aTime = new Date((a.connect || a.entry).timestampUTC).getTime();
    const bTime = new Date((b.connect || b.entry).timestampUTC).getTime();
    return bTime - aTime; // most recent first
  });
}

export function SessionTimeline({ caseId }) {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    casesApi
      .getCaseLogs(caseId, { action: 'connect,disconnect', limit: 500 })
      .then((res) => setEntries(res.entries))
      .catch(() => setError('Could not load the session timeline.'));
  }, [caseId]);

  if (error) return <p className="text-sm text-critical">{error}</p>;
  if (entries === null) return <p className="text-sm text-text-lo">Loading timeline…</p>;

  const rows = pairSessions(entries);

  if (rows.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-text-lo">No connect/disconnect events parsed for this case yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      {entries.length >= 500 && (
        <p className="border-b border-border px-4 py-2 text-xs text-gold">
          Showing the most recent 500 events. Use the log table for the full, filterable set.
        </p>
      )}
      <div className="divide-y divide-border">
        {rows.map((row, i) => {
          const primary = row.connect || row.entry;
          const duration =
            row.kind === 'session' && row.connect && row.disconnect
              ? formatDuration(new Date(row.disconnect.timestampUTC) - new Date(row.connect.timestampUTC))
              : null;

          return (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    row.kind === 'session' && row.connect && !row.disconnect ? 'bg-verified' : 'bg-text-lo'
                  }`}
                  title={row.kind === 'session' && row.connect && !row.disconnect ? 'Session still open' : ''}
                />
                <div>
                  <p className="font-mono text-sm text-text-hi">{primary.user || 'unknown user'}</p>
                  <p className="font-mono text-[11px] text-text-lo">
                    {primary.sourceIp}
                    {primary.geo?.city ? ` · ${primary.geo.city}, ${primary.geo.country || ''}` : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[11px] text-text-lo">
                  {new Date(primary.timestampUTC).toLocaleString()}
                </p>
                {duration && <p className="font-mono text-[11px] text-accent">session: {duration}</p>}
                {row.kind === 'standalone' && (
                  <p className="font-mono text-[11px] uppercase text-text-lo">{row.entry.action}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
