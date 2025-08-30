import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

/**
 * Authentication Context for H2 Optimize App
 * Manages user authentication state and provides auth methods
 */

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('h2_optimize_token');
      const savedUser = localStorage.getItem('h2_optimize_user');
      
      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const userData = await authAPI.getCurrentUser();
          if (userData.success) {
            setUser(userData.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('h2_optimize_token');
            localStorage.removeItem('h2_optimize_user');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('h2_optimize_token');
          localStorage.removeItem('h2_optimize_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register function
  const register = async (email, password, name) => {
    try {
      const response = await authAPI.register(email, password, name);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('h2_optimize_token', response.token);
        localStorage.setItem('h2_optimize_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('h2_optimize_token', response.token);
        localStorage.setItem('h2_optimize_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('h2_optimize_token');
      localStorage.removeItem('h2_optimize_user');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    register,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
