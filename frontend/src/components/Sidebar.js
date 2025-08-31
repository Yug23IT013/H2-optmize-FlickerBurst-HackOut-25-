import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CogIcon, 
  BuildingOfficeIcon,
  TruckIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

/**
 * Sidebar Component - Controls and filters for the map
 * Handles layer toggles and suitability mode activation
 */

const Sidebar = ({ 
  visibleLayers, 
  onLayerToggle, 
  suitabilityMode, 
  onSuitabilityToggle,
  areaMode = false,
  onAreaModeToggle,
  assetCounts 
}) => {
  
  // Layer configuration with icons and descriptions
  const layerConfig = [
    {
      key: 'plants',
      label: 'Production Plants',
      icon: BoltIcon,
      color: 'text-hydrogen-600',
      bgColor: 'bg-hydrogen-50',
      borderColor: 'border-hydrogen-200',
      description: 'Hydrogen production facilities'
    },
    {
      key: 'storage',
      label: 'Storage Facilities',
      icon: BuildingOfficeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Hydrogen storage infrastructure'
    },
    {
      key: 'demandCenters',
      label: 'Demand Centers',
      icon: TruckIcon,
      color: 'text-energy-600',
      bgColor: 'bg-energy-50',
      borderColor: 'border-energy-200',
      description: 'Hydrogen consumption points'
    },
    {
      key: 'pipelines',
      label: 'Pipelines',
      icon: CogIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Hydrogen transport infrastructure'
    },
    {
      key: 'regulatoryZones',
      label: 'Regulatory Zones',
      icon: ShieldCheckIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description: 'Policy and regulatory boundaries'
    }
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sidebar-panel h-full flex flex-col"
    >
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <MapPinIcon className="w-8 h-8 text-hydrogen-600 mr-2" />
          H2 Optimize
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Green Hydrogen Infrastructure Mapping
        </p>
      </div>

      {/* Analysis Mode Toggles */}
      <div className="py-4 border-b border-gray-200 space-y-3">
        {/* Suitability Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSuitabilityToggle}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            suitabilityMode
              ? 'bg-gradient-to-r from-hydrogen-600 to-energy-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {suitabilityMode ? (
            <span className="flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
              Site Analysis Active
            </span>
          ) : (
            'Analyze Site Suitability'
          )}
        </motion.button>

        {/* Area Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAreaModeToggle}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            areaMode
              ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {areaMode ? (
            <span className="flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
              Area Analysis Active
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Analyze Area (4 Points)
            </span>
          )}
        </motion.button>
        
        {/* Mode descriptions */}
        {suitabilityMode && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-gray-500 px-1"
          >
            Click anywhere on the map to analyze site suitability
          </motion.p>
        )}
        
        {areaMode && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-gray-500 px-1"
          >
            Place 4 dots on the map to define an area for analysis
          </motion.p>
        )}
      </div>

      {/* Layer Controls */}
      <div className="flex-1 py-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Infrastructure Layers
        </h3>
        
        <div className="space-y-3">
          {layerConfig.map((layer) => {
            const Icon = layer.icon;
            const isVisible = visibleLayers[layer.key];
            const count = assetCounts[layer.key] || 0;
            
            return (
              <motion.div
                key={layer.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isVisible 
                    ? `${layer.bgColor} ${layer.borderColor} shadow-sm` 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onLayerToggle(layer.key)}
                    className="checkbox-custom mr-3"
                  />
                  
                  <Icon 
                    className={`w-5 h-5 mr-2 ${
                      isVisible ? layer.color : 'text-gray-400'
                    }`} 
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isVisible ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {layer.label}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        isVisible 
                          ? 'bg-white/80 text-gray-700' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {count}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${
                      isVisible ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {layer.description}
                    </p>
                  </div>
                </label>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-hydrogen-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Production</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Storage</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-energy-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Demand</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="text-gray-600">Pipeline</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <p className="text-xs text-gray-500 text-center">
          Built for sustainable energy planning
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
