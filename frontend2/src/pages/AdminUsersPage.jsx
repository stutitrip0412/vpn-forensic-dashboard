import { useEffect, useState } from 'react';
import * as usersApi from '../api/users.js';
import { Button, Card, TextInput } from '../components/common/ui.jsx';

const ROLES = ['viewer', 'analyst', 'lead_investigator', 'admin'];

function CreateUserForm({ onCreated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('analyst');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await usersApi.createUser({ username, password, role });
      onCreated(user);
      setUsername('');
      setPassword('');
      setRole('analyst');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create user.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mb-6 p-4">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-text-lo">Create account</p>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <TextInput label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <TextInput
          label="Temporary password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-lo">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded border border-border bg-surface-alt px-3 py-2 text-sm text-text-hi focus:border-accent"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create'}
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-critical">{error}</p>}
    </Card>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');

  function loadUsers() {
    usersApi
      .listUsers()
      .then(setUsers)
      .catch(() => setError('Could not load users.'));
  }

  useEffect(loadUsers, []);

  async function handleDeactivate(id) {
    const updated = await usersApi.deactivateUser(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-mono text-xl text-text-hi">Users</h1>
        <p className="mt-1 text-sm text-text-lo">
          There is no public signup — every account is provisioned here by an administrator.
        </p>
      </div>

      <CreateUserForm onCreated={(u) => setUsers((prev) => [u, ...(prev || [])])} />

      {error && <p className="text-sm text-critical">{error}</p>}
      {users === null && !error && <p className="text-sm text-text-lo">Loading users…</p>}

      <Card className="divide-y divide-border p-0">
        {users?.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-mono text-sm text-text-hi">
                {u.username}
                {!u.isActive && <span className="ml-2 text-xs text-critical">(deactivated)</span>}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-text-lo">{u.role}</p>
            </div>
            {u.isActive && (
              <Button variant="danger" onClick={() => handleDeactivate(u.id)}>
                Deactivate
              </Button>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
