import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import MainDashboard from './components/MainDashboard';
import { motion } from 'framer-motion';

// Styles
import './index.css';

/**
 * Main App Component - H2 Optimize Frontend
 * Handles routing between landing page and authenticated dashboard
 */

// App Content Component (needs to be inside AuthProvider)
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-hydrogen-50 to-energy-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-panel p-8"
        >
          <div className="w-12 h-12 loading-spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading H2 Optimize
          </h2>
          <p className="text-gray-600">
            Initializing application...
          </p>
        </motion.div>
      </div>
    );
  }

  // Show dashboard if authenticated, landing page if not
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isAuthenticated() ? <MainDashboard /> : <LandingPage />}
    </motion.div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
