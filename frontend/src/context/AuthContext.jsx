import { createContext, useEffect, useState } from "react";

import { login as loginService, getCurrentUser } from "../services/auth.service";

import {
  getToken,
  saveToken,
  removeToken,
} from "../utils/token";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {

    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {

      const data = await getCurrentUser();

      setUser(data.user);

    } catch (err) {

      removeToken();

      setUser(null);

    }

    setLoading(false);

  };

  const login = async (username, password) => {

    const data = await loginService(
      username,
      password
    );

    saveToken(data.token);

    setUser(data.user);

    return data;

  };

  const logout = () => {

    removeToken();

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;