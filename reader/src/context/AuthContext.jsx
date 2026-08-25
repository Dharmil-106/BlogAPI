import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'blog_token';

/**
 * Decode a JWT payload without verification (client-side only).
 * Returns null if the token is malformed or expired.
 */
function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) return null;
    const payload = decodeToken(saved);
    if (!payload) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return { id: payload.userId, role: payload.role };
  });

  // Keep user in sync with token changes
  useEffect(() => {
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        localStorage.setItem(TOKEN_KEY, token);
        setUser({ id: payload.userId, role: payload.role });
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  const login = useCallback((newToken) => {
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
