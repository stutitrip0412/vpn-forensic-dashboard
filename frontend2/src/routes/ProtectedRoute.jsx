import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Gates a route behind authentication, and optionally a minimum role.
 * This is a UX convenience only — every real permission check happens
 * server-side (see backend middleware/rbac.js FR7.3 comment). Hiding a
 * nav item or route here just avoids showing someone a page they'll get
 * a 403 from; it is never the actual security boundary.
 */
export function ProtectedRoute({ children, minimumRole }) {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text-lo font-mono text-sm">
        Verifying session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (minimumRole && !hasRole(minimumRole)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-bg text-center">
        <p className="font-mono text-sm text-critical">Access restricted</p>
        <p className="max-w-sm text-sm text-text-lo">
          This area requires the "{minimumRole}" role or higher. You're signed in as "{user.role}".
        </p>
      </div>
    );
  }

  return children;
}
