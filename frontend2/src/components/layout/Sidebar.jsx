import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/cases', label: 'Cases' },
  { to: '/admin/users', label: 'Users', minimumRole: 'admin' },
];

export function Sidebar() {
  const { hasRole } = useAuth();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-lo">Forensic Analyzer</p>
        <p className="mt-0.5 font-mono text-sm text-text-hi">VPN Log Platform</p>
      </div>
      <nav className="flex flex-col gap-0.5 p-2">
        {NAV_ITEMS.filter((item) => !item.minimumRole || hasRole(item.minimumRole)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                isActive ? 'bg-accent/15 text-accent' : 'text-text-lo hover:bg-surface-alt hover:text-text-hi'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
