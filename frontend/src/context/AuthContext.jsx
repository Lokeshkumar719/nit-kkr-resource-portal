import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { authApi } from '../services/api.js';
import { createContext, useContext, useEffect, useState } from "react";

import { verifyAuth, logout } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true — checking session

  // On mount: try to restore session from backend cookie
  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      if (res.data && res.data.success && res.data.data) {
        setUser(res.data.data);
        localStorage.setItem('nitkkr_user', JSON.stringify(res.data.data));
      } else {
        setUser(null);
        localStorage.removeItem('nitkkr_user');
      }
    } catch (err) {
      // No valid session
      setUser(null);
      localStorage.removeItem('nitkkr_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Quick hydrate from localStorage (avoids flash), then verify
    const stored = localStorage.getItem('nitkkr_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('nitkkr_user');
      }
    }
    checkSession();
  }, [checkSession]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('nitkkr_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('nitkkr_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkSession }}>

  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await verifyAuth();

      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checkAuth,
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