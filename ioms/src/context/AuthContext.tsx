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



  

  const login = (userData: User, authToken: string) => {
    setCurrentUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  
    const expiryTime = new Date().getTime() + 15 * 60 * 1000;
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    
  
    setTimeout(() => {
      logout(); 
    }, 15 * 60 * 1000);
   
  };

  const logout = () => {
  setCurrentUser(null);
  setToken('');
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
 
};


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
  
    if (storedToken && expiry) {
      const now = new Date().getTime();
      const expiryTime = parseInt(expiry);
  
      if (now < expiryTime) {
        setToken(storedToken);
        const remainingTime = expiryTime - now;
        setTimeout(() => {
          logout();
        }, remainingTime);
      } else {
        logout(); 
      }
    }
  
    setLoading(false);
  }, []);



  const value: AuthContextType = {
    currentUser,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !! token,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};