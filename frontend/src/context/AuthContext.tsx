'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  demoLogin: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial cookie session on mount
    api
      .getMe()
      .then((existingUser) => {
        setUser(existingUser);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await api.login({ email, password });
    setIsLoading(false);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Login failed' };
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const result = await api.signup({ name, email, password });
    setIsLoading(false);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Signup failed' };
  };

  const logout = async () => {
    setIsLoading(true);
    await api.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('paypilot_studio_turns');
      } catch {}
    }
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const demoLogin = async () => {
    return login('demo@paypilot.ai', 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
