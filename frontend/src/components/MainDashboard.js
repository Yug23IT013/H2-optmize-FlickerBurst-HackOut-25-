import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// Components
import MapView from './MapView';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

// Services
import { assetsAPI } from '../services/api';

/**
 * Main Dashboard Component - Protected Map View
 * Shows after user authentication
 */

const MainDashboard = () => {
  const { user, logout } = useAuth();
  
  // Debug: Log user data
  console.log('MainDashboard - User data:', user);
  
  // State management
  const [assets, setAssets] = useState({
    plants: null,
    pipelines: null,
    demandCenters: null,
    storage: null
  });
  
  const [visibleLayers, setVisibleLayers] = useState({
    plants: true,
    pipelines: true,
    demandCenters: true,
    storage: true
  });
  
  const [suitabilityMode, setSuitabilityMode] = useState(false);
  const [suitabilityResult, setSuitabilityResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  /**
   * Load all assets from the API on component mount
   */
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading assets from API...');
        
        // Add a timeout to detect if backend is not running
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Backend connection timeout - ensure server is running on port 5000')), 5000)
        );
        
        const assetData = await Promise.race([
          assetsAPI.getAllAssets(),
          timeoutPromise
        ]);
        
        setAssets(assetData);
        console.log('✅ Assets loaded successfully:', {
          plants: assetData.plants?.features?.length || 0,
          pipelines: assetData.pipelines?.features?.length || 0,
          demandCenters: assetData.demandCenters?.features?.length || 0,
          storage: assetData.storage?.features?.length || 0
        });
        
      } catch (error) {
        console.error('❌ Failed to load assets:', error);
        setError(`Failed to load data: ${error.message}. Make sure the backend server is running on port 5000.`);
        
        // Set mock data for demo if backend is not available
        console.log('🔄 Using mock data for demo...');
        setAssets({
          plants: { type: 'FeatureCollection', features: [] },
          pipelines: { type: 'FeatureCollection', features: [] },
          demandCenters: { type: 'FeatureCollection', features: [] },
          storage: { type: 'FeatureCollection', features: [] }
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  /**
   * Calculate asset counts for dashboard
   */
  const assetCounts = {
    plants: assets.plants?.features?.length || 0,
    pipelines: assets.pipelines?.features?.length || 0,
    demandCenters: assets.demandCenters?.features?.length || 0,
    storage: assets.storage?.features?.length || 0
  };

  /**
   * Handle layer visibility toggle
   */
  const handleLayerToggle = (layerKey) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  /**
   * Handle suitability mode toggle
   */
  const handleSuitabilityToggle = () => {
    setSuitabilityMode(prev => !prev);
    if (suitabilityMode) {
      setSuitabilityResult(null); // Clear result when disabling mode
    }
  };

  /**
   * Handle suitability analysis result
   */
  const handleSuitabilityResult = (result) => {
    setSuitabilityResult(result);
    console.log('📊 Suitability analysis result:', result);
  };

  /**
   * Retry loading assets
   */
  const retryLoad = () => {
    window.location.reload();
  };

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  /**
   * Confirm logout action
   */
  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, we should clear local state
      logout();
      setShowLogoutConfirm(false);
    }
  };

  /**
   * Cancel logout action
   */
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Loading state
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
            Fetching infrastructure data...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-panel p-8 max-w-md"
        >
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please ensure the backend server is running on port 5000.
          </p>
          <button
            onClick={retryLoad}
            className="btn-primary"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hydrogen-50 to-energy-50">
      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between relative z-10 shadow-sm sticky top-0"
      >
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-hydrogen-500 to-energy-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H2</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">H2 Optimize</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User Profile Section */}
          <div className="flex items-center space-x-3 bg-white/60 rounded-lg px-3 py-2">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-hydrogen-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Fallback avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-hydrogen-500 to-energy-500 flex items-center justify-center text-white font-semibold text-sm" style={{ display: user?.avatar ? 'none' : 'flex' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Analyst'}</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-white/60 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group border border-gray-200 hover:border-red-300 shadow-sm hover:shadow-md"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Layout Grid */}
      <div className="h-[calc(100vh-80px)] grid grid-cols-12 gap-4 p-4">
        
        {/* Left Sidebar - Controls - Made wider */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-3"
        >
          <div className="h-full">
            <Sidebar
              visibleLayers={visibleLayers}
              onLayerToggle={handleLayerToggle}
              suitabilityMode={suitabilityMode}
              onSuitabilityToggle={handleSuitabilityToggle}
              assetCounts={assetCounts}
            />
          </div>
        </motion.div>

        {/* Center - Map View - Made larger and full height */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="col-span-12 md:col-span-8 lg:col-span-5 xl:col-span-5"
        >
          <div className="h-full glass-panel">
            <MapView
              assets={assets}
              visibleLayers={visibleLayers}
              suitabilityMode={suitabilityMode}
              onSuitabilityResult={handleSuitabilityResult}
              className="h-full"
            />
          </div>
        </motion.div>

        {/* Right Dashboard - Analytics - Made larger and full height */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="col-span-12 lg:col-span-4 xl:col-span-4"
        >
          <div className="h-full glass-panel overflow-y-auto scrollbar-thin">
            <Dashboard
              assetCounts={assetCounts}
              suitabilityResult={suitabilityResult}
            />
          </div>
        </motion.div>
      </div>

      {/* Floating Notifications */}
      {suitabilityMode && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1000]"
        >
          <div className="glass-panel px-6 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-hydrogen-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Site analysis mode active - Click anywhere on the map
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #22c55e 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]"
          onClick={cancelLogout}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Logout
              </h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out of H2 Optimize? You'll need to sign in again to access your dashboard.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MainDashboard;
