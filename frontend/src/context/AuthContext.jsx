import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken = null) => {
    const normalizedToken = authToken || localStorage.getItem(TOKEN_STORAGE_KEY);

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    if (normalizedToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
      setToken(normalizedToken);
    }

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);