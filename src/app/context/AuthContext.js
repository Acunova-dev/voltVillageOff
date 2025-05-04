'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (token) => {
    try {
      console.log('Fetching user data with token:', token);
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
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        console.log('Initializing auth state with token: check 1', token);
        
        if (token) {
          console.log('Initializing auth state with token: check 2', token);
          setAccessToken(token);
          const success = await fetchUserData(token);
          if (!success) {
            setAccessToken(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token, initialUserData) => {
    try {
      console.log('Logging in with token:', token);
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

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    accessToken,
    user,
    login,
    logout,
    isLoading
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