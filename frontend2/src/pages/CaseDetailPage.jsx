import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as casesApi from '../api/cases.js';
import * as evidenceApi from '../api/evidence.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CaseOverview } from '../components/case/CaseOverview.jsx';
import { EvidenceList } from '../components/case/EvidenceList.jsx';
import { EvidenceUpload } from '../components/case/EvidenceUpload.jsx';
import { CaseNotes } from '../components/case/CaseNotes.jsx';
import { DashboardTab } from '../components/dashboard/DashboardTab.jsx';
import { AnomalyPanel } from '../components/anomaly/AnomalyPanel.jsx';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'anomalies', label: 'Anomalies' },
  { key: 'notes', label: 'Notes' },
];

export function CaseDetailPage() {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setCaseData(null);
    setEvidence(null);
    Promise.all([casesApi.getCase(id), evidenceApi.listEvidenceForCase(id)])
      .then(([c, e]) => {
        setCaseData(c);
        setEvidence(e);
      })
      .catch(() => setError('Could not load this case.'));
  }, [id]);

  if (error) {
    return <p className="text-sm text-critical">{error}</p>;
  }

  if (!caseData) {
    return <p className="text-sm text-text-lo">Loading case…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/cases" className="mb-3 inline-block font-mono text-xs text-text-lo hover:text-accent">
        ← All cases
      </Link>
      <h1 className="font-mono text-xl text-text-hi">{caseData.name}</h1>

      <div className="mb-6 mt-4 flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
              activeTab === tab.key
                ? 'border-accent text-accent'
                : 'border-transparent text-text-lo hover:text-text-hi'
            }`}
          >
            {tab.label}
            {tab.key === 'evidence' && evidence ? ` (${evidence.length})` : ''}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <CaseOverview caseData={caseData} onUpdated={setCaseData} />}

      {activeTab === 'evidence' && (
        <div className="flex flex-col gap-4">
          {hasRole('analyst') && (
            <EvidenceUpload caseId={id} onUploaded={(e) => setEvidence((prev) => [e, ...(prev || [])])} />
          )}
          {evidence && <EvidenceList evidence={evidence} setEvidence={setEvidence} />}
        </div>
      )}

      {activeTab === 'dashboard' && <DashboardTab caseId={id} />}

      {activeTab === 'anomalies' && <AnomalyPanel caseId={id} />}

      {activeTab === 'notes' && <CaseNotes caseId={id} />}
    </div>
  );
}
