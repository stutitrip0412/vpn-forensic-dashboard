import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'vpn_forensic_token';
const USER_KEY = 'vpn_forensic_user';

// Role hierarchy mirrors backend/config/constants.js ROLE_HIERARCHY exactly.
// Kept in sync manually since frontend/backend are separate deployables —
// see README for the "if you add a role, update both" note.
const ROLE_LEVEL = {
  admin: 4,
  lead_investigator: 3,
  analyst: 2,
  viewer: 1,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // On mount, if we have a token, verify it's still valid by fetching /me
  // rather than trusting the possibly-stale cached user object.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .fetchMe()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {
        // client.js's 401 interceptor already clears storage and redirects
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, user: loggedInUser } = await authApi.login(username, password);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the server call fails (e.g. token already expired), still
      // clear local state — the user's intent to log out should always win.
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (minimumRole) => {
      if (!user) return false;
      return (ROLE_LEVEL[user.role] || 0) >= (ROLE_LEVEL[minimumRole] || 0);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
