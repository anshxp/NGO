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
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      // Verify token is still valid by fetching current user
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (authToken: string) => {
    try {
      const query = `query { me { _id name email role } }`;
      const result = await gql(query, {}, authToken) as { me: User };
      if (result.me) {
        setUser(result.me);
      } else {
        localStorage.removeItem('authToken');
        setToken(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const mutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            user {
              _id
              name
              email
              role
            }
          }
        }
      `;

      const result = await gql(mutation, { input: { email, password } }) as { login: { token: string; user: User } };
      console.log('✅ GraphQL response:', result);

      if (result?.login?.token && result?.login?.user) {
        const authToken = result.login.token;
        console.log('✅ Login successful, setting token');
        setToken(authToken);
        setUser(result.login.user);
        localStorage.setItem('authToken', authToken);
        console.log('✅ Auth state updated');
      } else {
        console.error('❌ Invalid response structure:', result);
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
