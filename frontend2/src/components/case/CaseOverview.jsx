import { useState } from 'react';
import * as casesApi from '../../api/cases.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button, Card, TextInput } from '../common/ui.jsx';

export function CaseOverview({ caseData, onUpdated }) {
  const { hasRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(caseData.name);
  const [description, setDescription] = useState(caseData.description || '');
  const [status, setStatus] = useState(caseData.status);
  const [legalHold, setLegalHold] = useState(caseData.legalHold);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const canEdit = hasRole('lead_investigator');

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const updated = await casesApi.updateCase(caseData._id, { name, description, status, legalHold });
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isEditing) {
    return (
      <Card className="p-5">
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <TextInput label="Case name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-lo">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded border border-border bg-surface-alt px-3 py-2 text-sm text-text-hi focus:border-accent"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-text-hi">
            <input type="checkbox" checked={legalHold} onChange={(e) => setLegalHold(e.target.checked)} />
            Legal hold (prevents automatic retention deletion)
          </label>
          {error && <p className="text-xs text-critical">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-text-lo">Status</p>
          <p className="mt-0.5 font-mono text-sm text-text-hi">
            {caseData.status}
            {caseData.legalHold && <span className="ml-2 text-gold">· LEGAL HOLD</span>}
          </p>
        </div>
        {canEdit && (
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
      {caseData.description && (
        <p className="mt-4 border-t border-border pt-4 text-sm text-text-hi">{caseData.description}</p>
      )}
      <p className="mt-4 border-t border-border pt-4 font-mono text-[11px] text-text-lo">
        Created by {caseData.createdBy?.username || 'unknown'} on {new Date(caseData.createdAt).toLocaleString()}
      </p>
    </Card>
  );
}
