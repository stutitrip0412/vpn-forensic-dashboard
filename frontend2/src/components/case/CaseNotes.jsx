import { useEffect, useState } from 'react';
import * as casesApi from '../../api/cases.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button, Card } from '../common/ui.jsx';

export function CaseNotes({ caseId }) {
  const { hasRole } = useAuth();
  const [notes, setNotes] = useState(null);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    casesApi
      .listNotes(caseId, { targetType: 'case' })
      .then(setNotes)
      .catch(() => setError('Could not load notes.'));
  }, [caseId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      const note = await casesApi.createNote(caseId, { targetType: 'case', body });
      setNotes((prev) => [note, ...(prev || [])]);
      setBody('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add note.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {hasRole('analyst') && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a case-level note…"
              rows={3}
              className="rounded border border-border bg-surface-alt px-3 py-2 text-sm text-text-hi placeholder:text-text-lo/50 focus:border-accent"
            />
            {error && <p className="text-xs text-critical">{error}</p>}
            <div>
              <Button type="submit" disabled={isSubmitting || !body.trim()}>
                {isSubmitting ? 'Adding…' : 'Add note'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {notes === null && <p className="text-sm text-text-lo">Loading notes…</p>}
      {notes !== null && notes.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-text-lo">No case-level notes yet.</p>
        </Card>
      )}
      {notes?.map((n) => (
        <Card key={n._id} className="p-4">
          <p className="whitespace-pre-wrap text-sm text-text-hi">{n.body}</p>
          <p className="mt-2 font-mono text-[11px] text-text-lo">
            {n.authorId?.username || 'unknown'} · {new Date(n.createdAt).toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
