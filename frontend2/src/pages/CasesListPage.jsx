import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as casesApi from '../api/cases.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Card, TextInput } from '../components/common/ui.jsx';

const STATUS_DOT = {
  open: 'bg-verified',
  closed: 'bg-text-lo',
  archived: 'bg-text-lo/50',
};

function CreateCaseForm({ onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const created = await casesApi.createCase({ name, description });
      setName('');
      setDescription('');
      setIsOpen(false);
      onCreated(created);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create the case.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        + New case
      </Button>
    );
  }

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput
          label="Case name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          placeholder='e.g. "Case 2026-0142 — Unauthorized VPN Access"'
        />
        <TextInput
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief context for this investigation"
        />
        {error && <p className="text-xs text-critical">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create case'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function CasesListPage() {
  const { hasRole } = useAuth();
  const [cases, setCases] = useState(null);
  const [error, setError] = useState('');

  function loadCases() {
    casesApi
      .listCases()
      .then(setCases)
      .catch(() => setError('Could not load cases.'));
  }

  useEffect(loadCases, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-mono text-xl text-text-hi">Cases</h1>
        <p className="mt-1 text-sm text-text-lo">Every investigation starts here — evidence is always scoped to a case.</p>
      </div>

      {hasRole('analyst') && <CreateCaseForm onCreated={(c) => setCases((prev) => [c, ...(prev || [])])} />}

      {error && <p className="text-sm text-critical">{error}</p>}

      {cases === null && !error && <p className="text-sm text-text-lo">Loading cases…</p>}

      {cases !== null && cases.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-text-lo">
            No cases yet. {hasRole('analyst') ? 'Create one to start uploading evidence.' : 'An analyst or lead investigator needs to create one.'}
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {cases?.map((c) => (
          <Link key={c._id} to={`/cases/${c._id}`}>
            <Card className="flex items-center justify-between p-4 transition-colors hover:border-accent/50">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[c.status] || STATUS_DOT.open}`} />
                <div>
                  <p className="font-mono text-sm text-text-hi">{c.name}</p>
                  {c.description && <p className="mt-0.5 text-xs text-text-lo">{c.description}</p>}
                </div>
              </div>
              <div className="text-right">
                {c.legalHold && (
                  <span className="mb-1 inline-block rounded border border-gold/40 bg-gold/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                    Legal hold
                  </span>
                )}
                <p className="font-mono text-[11px] text-text-lo">{c.createdBy?.username || 'unknown'}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
