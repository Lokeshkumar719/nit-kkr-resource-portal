import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { verifyAuth, logout as apiLogout } from '../services/api.js';

const AuthContext = createContext(null);

// Synchronously hydrate from localStorage to prevent flash/redirect on refresh
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('nitkkr_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('nitkkr_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await verifyAuth();
      if (response.data && response.data.data) {
        setUser(response.data.data);
        localStorage.setItem('nitkkr_user', JSON.stringify(response.data.data));
      } else {
        setUser(null);
        localStorage.removeItem('nitkkr_user');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('nitkkr_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('nitkkr_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('nitkkr_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checkAuth,
        checkSession: checkAuth, // alias for backwards compatibility in my components
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
