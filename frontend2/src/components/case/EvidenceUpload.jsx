import { useState, useRef } from 'react';
import * as evidenceApi from '../../api/evidence.js';
import { Button, Card } from '../common/ui.jsx';

const SOURCE_TYPES = [
  { value: '', label: 'Auto-detect' },
  { value: 'openvpn', label: 'OpenVPN server log' },
  { value: 'wireguard', label: 'WireGuard journal export' },
  { value: 'syslog_auth', label: 'Syslog / auth.log' },
];

export function EvidenceUpload({ caseId, onUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [sourceType, setSourceType] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['log', 'txt'].includes(ext)) {
      setError('Only .log and .txt files are accepted.');
      return;
    }

    setError('');
    setResult(null);
    setUploadingFile(file);
    setProgress(0);

    try {
      const res = await evidenceApi.uploadEvidence(caseId, file, sourceType || undefined, setProgress);
      setResult(res);
      onUploaded(res.evidence);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploadingFile(null);
    }
  }

  return (
    <Card className="p-5">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-text-lo">Upload evidence</p>

      <label className="mb-3 flex flex-col gap-1">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-lo">Log format</span>
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="rounded border border-border bg-surface-alt px-3 py-2 text-sm text-text-hi focus:border-accent"
        >
          {SOURCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
        }`}
      >
        <p className="text-sm text-text-hi">Drag a .log or .txt file here, or click to browse</p>
        <p className="text-xs text-text-lo">Up to 100MB. The original file is never modified — only a copy is parsed.</p>
        <input
          ref={inputRef}
          type="file"
          accept=".log,.txt"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {uploadingFile && (
        <div className="mt-4">
          <div className="flex justify-between font-mono text-xs text-text-lo">
            <span>{uploadingFile.name}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded bg-surface-alt">
            <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-critical">{error}</p>}

      {result && (
        <div className="mt-4 rounded border border-verified/30 bg-verified/5 p-3 text-xs">
          <p className="text-verified">Uploaded and parsed as {result.evidence.sourceType}.</p>
          {result.parseResult && (
            <p className="mt-1 text-text-lo">
              Parse coverage: {result.parseResult.parseCoverage}% ({result.parseResult.logEntriesCreated} entries,{' '}
              {result.parseResult.quarantinedLineCount} quarantined lines)
            </p>
          )}
          {result.parseError && <p className="mt-1 text-gold">{result.parseError}</p>}
        </div>
      )}
    </Card>
  );
}
