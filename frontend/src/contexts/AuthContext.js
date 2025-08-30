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
      try {
        const token = localStorage.getItem('h2_optimize_token') || sessionStorage.getItem('h2_optimize_token');
        const savedUser = localStorage.getItem('h2_optimize_user') || sessionStorage.getItem('h2_optimize_user');
        
        if (token && savedUser) {
          try {
            // Parse saved user data
            const userData = JSON.parse(savedUser);
            
            // Try to verify token is still valid by fetching current user
            const response = await authAPI.getCurrentUser();
            if (response.success) {
              setUser(response.user);
              console.log('✅ Authentication restored from localStorage');
            } else {
              // If token verification fails, restore from localStorage anyway
              // This allows offline functionality and handles network issues
              setUser(userData);
              console.log('⚠️ Token verification failed, but user restored from localStorage');
            }
          } catch (error) {
            // If API call fails (network issues, server down, etc.), 
            // still restore user from localStorage
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              console.log('⚠️ Token verification failed, but user restored from localStorage:', error.message);
            } catch (parseError) {
              console.error('❌ Failed to parse saved user data:', parseError);
              // Clear corrupted data
              localStorage.removeItem('h2_optimize_token');
              localStorage.removeItem('h2_optimize_user');
            }
          }
        } else {
          console.log('ℹ️ No saved authentication found');
        }
      } catch (error) {
        console.error('❌ Error during auth initialization:', error);
      } finally {
        setLoading(false);
      }
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
        
        // Save authentication data to both localStorage and sessionStorage
        localStorage.setItem('h2_optimize_token', response.token);
        localStorage.setItem('h2_optimize_user', JSON.stringify(response.user));
        sessionStorage.setItem('h2_optimize_token', response.token);
        sessionStorage.setItem('h2_optimize_user', JSON.stringify(response.user));
        
        console.log('✅ User logged in and data saved to localStorage');
        return { success: true, user: response.user };
      } else {
        console.error('❌ Login failed:', response.error);
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      console.log('✅ Server logout successful');
    } catch (error) {
      console.error('⚠️ Server logout failed, but continuing with local logout:', error);
    } finally {
      // Always clear local state and storage
      setUser(null);
      localStorage.removeItem('h2_optimize_token');
      localStorage.removeItem('h2_optimize_user');
      sessionStorage.removeItem('h2_optimize_token');
      sessionStorage.removeItem('h2_optimize_user');
      console.log('✅ Local logout completed - user data cleared');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Refresh authentication state (useful for debugging)
  const refreshAuth = async () => {
    const token = localStorage.getItem('h2_optimize_token');
    const savedUser = localStorage.getItem('h2_optimize_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Authentication state refreshed');
        return true;
      } catch (error) {
        console.error('❌ Failed to refresh auth state:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    register,
    login,
    logout,
    isAuthenticated,
    refreshAuth,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
