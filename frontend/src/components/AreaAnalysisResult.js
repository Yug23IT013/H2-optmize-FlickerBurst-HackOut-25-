import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  StarIcon, 
  BoltIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

/**
 * AreaAnalysisResult Component - Displays analysis results for selected area
 * Shows best site recommendations, area statistics, and suitability metrics
 */

const AreaAnalysisResult = ({ 
  analysisResult, 
  onSiteSelect, 
  onClose,
  className = "" 
}) => {
  if (!analysisResult) return null;

  const { bestSite, areaStats, sites = [], error } = analysisResult;

  // Handle error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`glass-panel p-6 max-w-md ${className}`}
      >
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analysis Error
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {analysisResult.message || 'Failed to analyze the selected area'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass-panel p-6 max-w-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <ChartBarIcon className="w-5 h-5 text-indigo-600 mr-2" />
          Area Analysis Results
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Best Site Recommendation */}
      {bestSite && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
            Best Recommended Site
          </h4>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPinIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {bestSite.location?.lat?.toFixed(4) || 'N/A'}, {bestSite.location?.lng?.toFixed(4) || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <BoltIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Score:</span>
                    <span className="font-semibold text-green-600">
                      {bestSite.score?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: bestSite.interpretation?.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {bestSite.interpretation?.level}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">
                  {bestSite.interpretation?.description}
                </p>
                
                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Wind Speed:</span>
                    <span className="ml-1 font-medium">{bestSite.factors?.windSpeed?.toFixed(1) || 'N/A'} m/s</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Solar Irradiance:</span>
                    <span className="ml-1 font-medium">{bestSite.factors?.solarIrradiance?.toFixed(0) || 'N/A'} kWh/m²</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Distance to Demand:</span>
                    <span className="ml-1 font-medium">{bestSite.factors?.distanceToDemand?.toFixed(1) || 'N/A'} km</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Infrastructure:</span>
                    <span className="ml-1 font-medium">{bestSite.factors?.infrastructureAccess?.toFixed(1) || 'N/A'}/10</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onSiteSelect?.(bestSite)}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
              >
                <MapPinIcon className="w-4 h-4" />
                <span>View on Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area Statistics */}
      {areaStats && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Area Statistics
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-lg font-bold text-blue-600">
                {areaStats.sitesAnalyzed || 0}
              </div>
              <div className="text-xs text-blue-700">Sites Analyzed</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-lg font-bold text-green-600">
                {areaStats.avgScore?.toFixed(1) || '0.0'}
              </div>
              <div className="text-xs text-green-700">Average Score</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-lg font-bold text-purple-600">
                {areaStats.areaSize?.toFixed(1) || '0.0'}
              </div>
              <div className="text-xs text-purple-700">Square Area (km²)</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-lg font-bold text-orange-600">
                {areaStats.suitableSites || 0}
              </div>
              <div className="text-xs text-orange-700">Suitable Sites</div>
            </div>
          </div>
          
          {/* Square dimensions */}
          {areaStats.squareDimensions && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Square Dimensions:</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Width: {areaStats.squareDimensions.longitudeSpan?.toFixed(1) || 'N/A'} km</div>
                <div>Height: {areaStats.squareDimensions.latitudeSpan?.toFixed(1) || 'N/A'} km</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Sites List */}
      {sites.length > 1 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Top Sites in Area
          </h4>
          
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {sites.slice(0, 5).map((site, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSiteSelect?.(site)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: site.interpretation?.color }}
                    ></div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {site.location?.lat?.toFixed(4) || 'N/A'}, {site.location?.lng?.toFixed(4) || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">
                      Score: {site.score?.toFixed(1) || 'N/A'} - {site.interpretation?.level || 'Unknown'}
                    </div>
                  </div>
                </div>
                
                <MapPinIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis timestamp */}
      {analysisResult.timestamp && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <ClockIcon className="w-3 h-3" />
            <span>
              Analyzed: {new Date(analysisResult.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AreaAnalysisResult;
