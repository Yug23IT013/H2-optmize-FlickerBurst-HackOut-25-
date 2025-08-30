import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const savedUser = localStorage.getItem('h2_optimize_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('h2_optimize_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // For demo purposes, we'll simulate authentication
      // In production, this would make an API call to your backend
      const mockUser = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        role: 'analyst',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=22c55e&color=ffffff`
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo, accept any email/password combo
      // In production, validate against backend
      if (email && password) {
        setUser(mockUser);
        localStorage.setItem('h2_optimize_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (email, password, name) => {
    try {
      // For demo purposes, we'll simulate registration
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        email: email,
        name: name || email.split('@')[0],
        role: 'analyst',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=22c55e&color=ffffff`
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo, accept any valid inputs
      if (email && password && email.includes('@')) {
        setUser(mockUser);
        localStorage.setItem('h2_optimize_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      } else {
        throw new Error('Valid email and password are required');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('h2_optimize_user');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    register,
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
