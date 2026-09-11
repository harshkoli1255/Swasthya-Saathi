import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('doctor_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('doctor_token'));
  const [isLoading] = useState(false);

  const login = (data: AuthResponse) => {
    setToken(data.access_token);
    localStorage.setItem('doctor_token', data.access_token);
    const u = {
      id: data.user_id,
      username: '',
      full_name: data.full_name,
      role: data.role as 'DOCTOR' | 'ADMIN',
      is_active: true
    };
    setUser(u);
    localStorage.setItem('doctor_user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
