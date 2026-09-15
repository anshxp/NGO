import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/apiClient';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getCurrentUser()
      .then((response) => setUser(response.data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email.trim().toLowerCase(), password);
    if (!response.data?.user) throw new Error('Invalid login response');
    setUser(response.data.user);
  };

  const logout = async () => {
    try { await authAPI.logout(); } finally { setUser(null); }
  };

  return (
    <AuthContext.Provider value={{ user, token: null, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
