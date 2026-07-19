import { useEffect, useState } from 'react';
import * as anomaliesApi from '../../api/anomalies.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button, Card, SeverityBadge, StatusLabel } from '../common/ui.jsx';

const STATUS_OPTIONS = ['open', 'reviewed', 'false_positive', 'confirmed'];
const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function AnomalyRow({ anomaly, onUpdated }) {
  const { hasRole } = useAuth();
  const [note, setNote] = useState(anomaly.analystNote || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleStatusChange(status) {
    setIsSaving(true);
    try {
      const updated = await anomaliesApi.updateAnomaly(anomaly._id, { status });
      onUpdated(updated);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveNote() {
    setIsSaving(true);
    try {
      const updated = await anomaliesApi.updateAnomaly(anomaly._id, { analystNote: note });
      onUpdated(updated);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="border-b border-border py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setIsExpanded((v) => !v)}>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={anomaly.severity} />
            <span className="font-mono text-xs uppercase tracking-wide text-text-hi">
              {anomaly.type.replace(/_/g, ' ')}
            </span>
            <StatusLabel status={anomaly.status} />
          </div>
          <p className="mt-1.5 text-sm text-text-hi">{anomaly.description}</p>
          {anomaly.relatedLogEntryIds?.length > 0 && (
            <p className="mt-1 font-mono text-[11px] text-text-lo">
              references {anomaly.relatedLogEntryIds.length} log entr
              {anomaly.relatedLogEntryIds.length === 1 ? 'y' : 'ies'}
            </p>
          )}
        </div>
      </div>

      {isExpanded && hasRole('analyst') && (
        <div className="mt-3 flex flex-col gap-2 rounded border border-border bg-surface-alt p-3">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((s) => (
              <Button
                key={s}
                variant={anomaly.status === s ? 'primary' : 'ghost'}
                onClick={() => handleStatusChange(s)}
                disabled={isSaving}
                className="text-[10px]"
              >
                {s.replace('_', ' ')}
              </Button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Analyst note…"
            rows={2}
            className="rounded border border-border bg-surface px-2 py-1.5 text-xs text-text-hi placeholder:text-text-lo/50 focus:border-accent"
          />
          <div>
            <Button variant="ghost" onClick={handleSaveNote} disabled={isSaving}>
              Save note
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AnomalyPanel({ caseId }) {
  const { hasRole } = useAuth();
  const [anomalies, setAnomalies] = useState(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  function loadAnomalies() {
    anomaliesApi
      .listAnomaliesForCase(caseId, statusFilter ? { status: statusFilter } : {})
      .then((data) => setAnomalies([...data].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])))
      .catch(() => setError('Could not load anomalies.'));
  }

  useEffect(loadAnomalies, [caseId, statusFilter]);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setError('');
    try {
      await anomaliesApi.runAnalysis(caseId);
      loadAnomalies();
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleUpdated(updated) {
    setAnomalies((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-border bg-surface-alt px-2 py-1 font-mono text-xs text-text-hi focus:border-accent"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        {hasRole('analyst') && (
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing…' : 'Run anomaly detection'}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-critical">{error}</p>}
      {anomalies === null && !error && <p className="text-sm text-text-lo">Loading anomalies…</p>}

      {anomalies && anomalies.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-text-lo">
            No anomalies{statusFilter ? ` with status "${statusFilter.replace('_', ' ')}"` : ''}.
            {!statusFilter && hasRole('analyst') && " Run detection to analyze this case's parsed evidence."}
          </p>
        </Card>
      )}

      {anomalies && anomalies.length > 0 && (
        <Card className="p-4">
          {anomalies.map((a) => (
            <AnomalyRow key={a._id} anomaly={a} onUpdated={handleUpdated} />
          ))}
        </Card>
      )}
    </div>
  );
}
