import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';

interface User {
  email: string;
  
}

interface AuthContextType {
  currentUser: User | null;
  token: string;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
  
    if (storedToken) {
      setToken(storedToken);
      
    }
    setLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    setCurrentUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    currentUser,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};