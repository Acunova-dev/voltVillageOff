'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const fetchUserData = useCallback(async (token) => {
    if (!token) return false;
    
    try {
      const response = await fetch('https://voltvillage-api.onrender.com/api/v1/users/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token) {
          setAccessToken(token);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          const success = await fetchUserData(token);
          if (!success) {
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        logout();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [fetchUserData, logout]);

  const login = async (token, initialUserData) => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      setIsLoading(true);
      setAccessToken(token);
      setUser(initialUserData);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(initialUserData));
      
      await fetchUserData(token);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    accessToken,
    user,
    login,
    logout,
    isLoading,
    isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};