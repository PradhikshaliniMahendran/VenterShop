'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface IUserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE' | 'ADMIN';
  communityId?: string | null;
  communityStatus?: string;
  preferredLanguage?: 'en' | 'ta';
  phone?: string;
  createdAt?: string;
  addresses?: {
    _id: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
    addressType: 'Home' | 'Business' | 'Other';
    isDefault: boolean;
  }[];
}

interface AuthContextType {
  user: IUserSession | null;
  isLoading: boolean;
  loginUser: (userData: IUserSession) => void;
  logoutUser: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginUser = (userData: IUserSession) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginUser, logoutUser, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
