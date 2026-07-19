import { useEffect, useState } from 'react';
import * as casesApi from '../../api/cases.js';
import { GeoMap } from './GeoMap.jsx';
import { SummaryCharts } from './SummaryCharts.jsx';
import { SessionTimeline } from './SessionTimeline.jsx';
import { LogEntryTable } from './LogEntryTable.jsx';

const SECTIONS = [
  { key: 'summary', label: 'Summary' },
  { key: 'map', label: 'Map' },
  { key: 'timeline', label: 'Sessions' },
  { key: 'table', label: 'All entries' },
];

export function DashboardTab({ caseId }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [section, setSection] = useState('summary');

  useEffect(() => {
    casesApi
      .getCaseStats(caseId)
      .then(setStats)
      .catch(() => setError('Could not load dashboard data.'));
  }, [caseId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`rounded px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
              section === s.key ? 'bg-accent/15 text-accent' : 'text-text-lo hover:bg-surface-alt hover:text-text-hi'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-critical">{error}</p>}

      {section === 'summary' && (stats ? <SummaryCharts stats={stats} /> : <p className="text-sm text-text-lo">Loading…</p>)}
      {section === 'map' && (stats ? <GeoMap geoPoints={stats.geoPoints} /> : <p className="text-sm text-text-lo">Loading…</p>)}
      {section === 'timeline' && <SessionTimeline caseId={caseId} />}
      {section === 'table' && <LogEntryTable caseId={caseId} />}
    </div>
  );
}
