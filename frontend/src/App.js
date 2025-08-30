import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Components
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Services
import { assetsAPI } from './services/api';

// Styles
import './index.css';

/**
 * Main App Component - H2 Optimize Frontend
 * Manages application state and coordinates between components
 */

function App() {
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
    <div className="h-screen bg-gradient-to-br from-hydrogen-50 to-energy-50 overflow-hidden">
      {/* Main Layout Grid */}
      <div className="h-full grid grid-cols-12 gap-4 p-4">
        
        {/* Left Sidebar - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="col-span-3 lg:col-span-3 xl:col-span-2"
        >
          <Sidebar
            visibleLayers={visibleLayers}
            onLayerToggle={handleLayerToggle}
            suitabilityMode={suitabilityMode}
            onSuitabilityToggle={handleSuitabilityToggle}
            assetCounts={assetCounts}
          />
        </motion.div>

        {/* Center - Map View */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="col-span-6 lg:col-span-6 xl:col-span-7"
        >
          <div className="h-full glass-panel overflow-hidden">
            <MapView
              assets={assets}
              visibleLayers={visibleLayers}
              suitabilityMode={suitabilityMode}
              onSuitabilityResult={handleSuitabilityResult}
              className="h-full"
            />
          </div>
        </motion.div>

        {/* Right Dashboard - Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="col-span-3 lg:col-span-3 xl:col-span-3"
        >
          <Dashboard
            assetCounts={assetCounts}
            suitabilityResult={suitabilityResult}
          />
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
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #22c55e 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
    </div>
  );
}

export default App;
