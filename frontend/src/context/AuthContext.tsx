import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/axios';
import type { User } from '../types/auth.types';
import type { Organization } from '../types/organization.types';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  role: 'admin' | 'member' | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasOrganization: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password_hash: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setOrganization(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      // Fetch profile
      const profileRes = await api.get('/auth/profile');
      const userData = profileRes.data.user;
      setUser(userData);

      // Fetch organization
      const orgRes = await api.get('/organizations/me');
      const orgs = orgRes.data.data; // Response format: { status, message, data: [...] }
      if (orgs && orgs.length > 0) {
        setOrganization(orgs[0]);
        setRole(orgs[0].role);
      } else {
        setOrganization(null);
        setRole(null);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      // In case of error, if tokens are invalid/expired, axios interceptor will dispatch auth-logout
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleAuthLogout = () => {
      setUser(null);
      setOrganization(null);
      setRole(null);
      setLoading(false);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);

      // Fetch organization
      const orgRes = await api.get('/organizations/me');
      const orgs = orgRes.data.data;
      if (orgs && orgs.length > 0) {
        setOrganization(orgs[0]);
        setRole(orgs[0].role);
      } else {
        setOrganization(null);
        setRole(null);
      }
    } catch (error) {
      setUser(null);
      setOrganization(null);
      setRole(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password_hash: string) => {
    setLoading(true);
    try {
      // Sign up backend route is /auth/sign
      await api.post('/auth/sign', { name, email, password_hash });
      
      // Auto login after signup
      const res = await api.post('/auth/login', { email, password: password_hash });
      const { accessToken, refreshToken, user: userData } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setOrganization(null);
      setRole(null);
    } catch (error) {
      setUser(null);
      setOrganization(null);
      setRole(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setOrganization(null);
      setRole(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    organization,
    role,
    loading,
    isAuthenticated: !!user,
    hasOrganization: !!organization,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
