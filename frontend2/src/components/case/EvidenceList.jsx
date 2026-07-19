import { useState } from 'react';
import * as evidenceApi from '../../api/evidence.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { CustodySeal } from '../common/CustodySeal.jsx';
import { Button, Card } from '../common/ui.jsx';

function sealStatus(evidence) {
  if (evidence.lastVerificationResult === 'match') return 'match';
  if (evidence.lastVerificationResult === 'mismatch') return 'mismatch';
  return 'pending';
}

function EvidenceRow({ evidence, onVerified }) {
  const { hasRole } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadWarning, setDownloadWarning] = useState('');

  async function handleVerify() {
    setIsVerifying(true);
    try {
      const result = await evidenceApi.verifyEvidence(evidence._id);
      onVerified(evidence._id, result.match ? 'match' : 'mismatch');
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleDownload() {
    setIsDownloading(true);
    setDownloadWarning('');
    try {
      const { hashMatch } = await evidenceApi.downloadEvidenceFile(evidence._id, evidence.originalFilename);
      if (!hashMatch) {
        setDownloadWarning('Warning: the stored file no longer matches the hash recorded at upload.');
      }
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="flex items-start gap-4 border-b border-border py-4 last:border-b-0">
      <CustodySeal hash={evidence.sha256Hash} status={sealStatus(evidence)} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm text-text-hi">{evidence.originalFilename}</p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-text-lo" title={evidence.sha256Hash}>
          {evidence.sha256Hash}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[11px] text-text-lo">
          <span>{evidence.sourceType}</span>
          <span>
            parse status: {evidence.parseStatus}
            {evidence.parseCoverage != null ? ` (${evidence.parseCoverage}% coverage)` : ''}
          </span>
          <span>uploaded by {evidence.uploadedBy?.username || 'unknown'}</span>
        </div>
        {downloadWarning && <p className="mt-1 text-xs text-critical">{downloadWarning}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? 'Verifying…' : 'Verify'}
        </Button>
        {hasRole('analyst') && (
          <Button variant="ghost" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? 'Downloading…' : 'Download'}
          </Button>
        )}
      </div>
    </div>
  );
}

export function EvidenceList({ evidence, setEvidence }) {
  function handleVerified(id, result) {
    setEvidence((prev) =>
      prev.map((e) => (e._id === id ? { ...e, lastVerificationResult: result, lastVerifiedAt: new Date().toISOString() } : e))
    );
  }

  if (evidence.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-text-lo">No evidence uploaded to this case yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      {evidence.map((e) => (
        <EvidenceRow key={e._id} evidence={e} onVerified={handleVerified} />
      ))}
    </Card>
  );
}
