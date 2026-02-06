import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (mobile: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  'citizen': {
    id: 'user-1',
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    wardNumber: 5,
    role: 'citizen',
  },
  'admin': {
    id: 'admin-1',
    name: 'Admin Officer',
    mobile: '9999999999',
    wardNumber: 1,
    role: 'admin',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (mobile: string, role: UserRole) => {
    // For demo, we'll use mock users
    const mockUser = mockUsers[role];
    setUser({ ...mockUser, mobile });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
