import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql } from '@/lib/graphqlClient';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const verifySession = async () => {
    try {
      const result = await gql<{ me: User | null }>('query { me { _id name email role } }');
      setUser(result.me || null);
    } catch (_error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    const mutation = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user { _id name email role }
        }
      }
    `;

    const result = await gql<{ login: { token: string; user: User } }>(mutation, {
      input: { email: email.trim().toLowerCase(), password }
    });

    if (!result?.login?.user) throw new Error('Invalid login response');
    setUser(result.login.user);
  };

  const logout = async () => {
    try {
      await gql<{ logout: boolean }>('mutation { logout }');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
