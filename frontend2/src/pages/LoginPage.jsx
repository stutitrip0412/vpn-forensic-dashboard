import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, TextInput, Card } from '../components/common/ui.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/cases';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Invalid username or password.'
          : err.response?.status === 429
            ? 'Too many attempts. Wait a few minutes and try again.'
            : 'Could not sign in. Check that the API server is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-lo">Forensic Analyzer</p>
          <h1 className="mt-1 font-mono text-lg text-text-hi">VPN Log Platform</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextInput
              label="Username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <TextInput
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p role="alert" className="rounded border border-critical/40 bg-critical/10 px-3 py-2 text-xs text-critical">
                {error}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting} className="mt-2 w-full py-2">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-text-lo">
          Accounts are provisioned by an administrator. Contact yours if you need access.
        </p>
      </div>
    </div>
  );
}
