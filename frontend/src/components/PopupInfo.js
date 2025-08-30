import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  StarIcon,
  MapPinIcon,
  BoltIcon,
  SignalIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

/**
 * PopupInfo Component - Displays suitability analysis results in map popups
 * Shows detailed breakdown of scoring factors and recommendations
 */

const PopupInfo = ({ data }) => {
  // Handle error state
  if (data?.error) {
    return (
      <div className="p-4 max-w-sm">
        <div className="flex items-center text-red-600 mb-2">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">Analysis Failed</span>
        </div>
        <p className="text-sm text-gray-600">
          {data.message || 'Unable to calculate suitability for this location'}
        </p>
      </div>
    );
  }

  const { score, details, interpretation, location, nearestDemandCenter } = data;

  // Score color based on interpretation
  const scoreColor = interpretation?.color || '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="p-4 max-w-sm"
    >
      {/* Header with score */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center">
          <StarIcon className="w-5 h-5 mr-2" style={{ color: scoreColor }} />
          Site Suitability
        </h3>
        
        <div className="mb-2">
          <div 
            className="text-3xl font-bold"
            style={{ color: scoreColor }}
          >
            {score?.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">out of 100</div>
        </div>

        {/* Interpretation badge */}
        {interpretation && (
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: interpretation.color + '20',
              color: interpretation.color,
              border: `1px solid ${interpretation.color}40`
            }}
          >
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: interpretation.color }}
            ></div>
            {interpretation.level}
          </div>
        )}

        {interpretation?.description && (
          <p className="text-xs text-gray-600 mt-2">
            {interpretation.description}
          </p>
        )}
      </div>

      {/* Detailed breakdown */}
      {details && (
        <div className="space-y-3 mb-4">
          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Analysis Breakdown
            </h4>
            
            {/* Renewable Potential */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <BoltIcon className="w-4 h-4 text-energy-500 mr-2" />
                <span className="text-sm text-gray-600">Renewable Potential</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {details.renewablePotential} kWh/m²/year
                </div>
                {details.breakdown?.renewableScore && (
                  <div className="text-xs text-gray-500">
                    Score: {details.breakdown.renewableScore}/40
                  </div>
                )}
              </div>
            </div>

            {/* Distance to Demand */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <TruckIcon className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Distance to Demand</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {details.distanceToDemand?.toFixed(1)} km
                </div>
                {details.breakdown?.demandScore && (
                  <div className="text-xs text-gray-500">
                    Score: {details.breakdown.demandScore}/30
                  </div>
                )}
              </div>
            </div>

            {/* Distance to Grid */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <SignalIcon className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">Distance to Grid</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  {details.distanceToGrid?.toFixed(1)} km
                </div>
                {details.breakdown?.gridScore && (
                  <div className="text-xs text-gray-500">
                    Score: {details.breakdown.gridScore}/30
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Information */}
      <div className="border-t border-gray-200 pt-3 space-y-2">
        {location && (
          <div className="flex items-start">
            <MapPinIcon className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
            <div className="text-sm">
              <span className="text-gray-600">Location: </span>
              <span className="font-medium text-gray-800">
                {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
              </span>
            </div>
          </div>
        )}

        {nearestDemandCenter && (
          <div className="flex items-start">
            <TruckIcon className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
            <div className="text-sm">
              <span className="text-gray-600">Nearest Demand: </span>
              <span className="font-medium text-gray-800">
                {nearestDemandCenter.name}
              </span>
              <div className="text-xs text-gray-500 mt-1">
                {nearestDemandCenter.demand} tonnes/year • {nearestDemandCenter.type}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {score && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">
            Recommendation
          </h5>
          <p className="text-xs text-gray-600">
            {score >= 80 
              ? "Excellent location for hydrogen infrastructure development. High renewable potential and good infrastructure access."
              : score >= 60
              ? "Good location with favorable conditions. Consider for development with minor optimization."
              : score >= 40
              ? "Moderate suitability. May require additional infrastructure investment."
              : score >= 20
              ? "Limited suitability. Significant challenges may impact project viability."
              : "Not recommended for hydrogen infrastructure development due to poor conditions."
            }
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PopupInfo;
