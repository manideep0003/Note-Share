import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContextDef';
import authService from '../services/authService';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Synchronize token and user to localStorage using the unified TOKEN_KEY
  const saveAuthData = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const clearAuthData = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const existingToken = localStorage.getItem(TOKEN_KEY);
      if (!existingToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (isMounted) {
          const userData = response?.user || response?.data?.user || response?.data;
          if (userData) {
            setUser(userData);
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Session expired or invalid token:', err?.response?.data?.message || err.message);
          clearAuthData();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifySession();

    // Listen for unauthorized 401 events dispatched by Axios interceptor
    const handleUnauthorized = () => {
      if (isMounted) {
        clearAuthData();
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearAuthData]);

  /**
   * Log in user
   * Reads token from response.token (or response.data.data.token) and user from response.user
   */
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const resolvedToken = response?.token || response?.data?.token || response?.data?.data?.token;
    const resolvedUser = response?.user || response?.data?.user || response?.data?.data?.user;

    if (resolvedToken && resolvedUser) {
      saveAuthData(resolvedToken, resolvedUser);
    }

    return response;
  };

  /**
   * Register user
   * Handles immediate token return or registration confirmation
   */
  const register = async (userData) => {
    const response = await authService.register(userData);
    const resolvedToken = response?.token || response?.data?.token || response?.data?.data?.token;
    const resolvedUser = response?.user || response?.data?.user || response?.data?.data?.user;

    if (resolvedToken && resolvedUser) {
      saveAuthData(resolvedToken, resolvedUser);
    }

    return response;
  };

  /**
   * Log out user
   */
  const logout = () => {
    clearAuthData();
  };

  /**
   * Update user object in state and localStorage
   */
  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  /**
   * Re-verify session from backend
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userData = response?.user || response?.data?.user || response?.data;
      if (userData) {
        updateUser(userData);
      }
      return userData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
