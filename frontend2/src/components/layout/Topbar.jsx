import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../common/ui.jsx';

const ROLE_LABEL = {
  admin: 'Admin',
  lead_investigator: 'Lead Investigator',
  analyst: 'Analyst',
  viewer: 'Viewer',
};

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-5">
      <div />
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="font-mono text-xs text-text-hi">{user.username}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-lo">
              {ROLE_LABEL[user.role] || user.role}
            </p>
          </div>
        )}
        <Button variant="ghost" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
