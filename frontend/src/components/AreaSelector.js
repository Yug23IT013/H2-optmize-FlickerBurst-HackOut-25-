import React, { useState } from 'react';
import { Marker, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

/**
 * AreaSelector Component - Allows users to define an area by placing 4 dots
 * Creates a polygon from the 4 points and enables area-based suitability analysis
 */

// Custom icon for area selection dots
const createAreaDotIcon = (number, isActive = false) => {
  return L.divIcon({
    className: 'area-dot-icon',
    html: `
      <div style="
        background-color: ${isActive ? '#ef4444' : '#6366f1'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        font-size: 12px;
        font-weight: bold;
        color: white;
        cursor: pointer;
      ">
        ${number}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

// Map click handler for placing area dots
function AreaClickHandler({ onAreaClick, isAreaMode, dotsCount }) {
  useMapEvents({
    click(e) {
      if (isAreaMode && dotsCount < 4) {
        onAreaClick(e.latlng);
      }
    },
  });
  return null;
}

const AreaSelector = ({ 
  isAreaMode, 
  onAreaComplete, 
  onAreaChange, 
  onReset,
  className = "" 
}) => {
  const [areaDots, setAreaDots] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle placing area dots
  const handleAreaClick = (latlng) => {
    if (areaDots.length < 4) {
      const newDots = [...areaDots, { lat: latlng.lat, lng: latlng.lng, id: areaDots.length + 1 }];
      setAreaDots(newDots);
      
      // If we have 4 dots, create a square from the bounding box
      if (newDots.length === 4) {
        const lats = newDots.map(dot => dot.lat);
        const lngs = newDots.map(dot => dot.lng);
        
        const north = Math.max(...lats);
        const south = Math.min(...lats);
        const east = Math.max(...lngs);
        const west = Math.min(...lngs);
        
        // Create a square using the bounding box
        const squareCoords = [
          [north, west], // Top-left
          [north, east], // Top-right
          [south, east], // Bottom-right
          [south, west], // Bottom-left
          [north, west]  // Close the square
        ];
        
        setPolygon(squareCoords);
      }
      
      if (onAreaChange) {
        onAreaChange(newDots);
      }
    }
  };

  // Handle removing a specific dot
  const handleRemoveDot = (indexToRemove) => {
    const newDots = areaDots.filter((_, index) => index !== indexToRemove)
      .map((dot, index) => ({ ...dot, id: index + 1 }));
    
    setAreaDots(newDots);
    setPolygon(null);
    
    if (onAreaChange) {
      onAreaChange(newDots);
    }
  };

  // Reset area selection
  const handleReset = () => {
    setAreaDots([]);
    setPolygon(null);
    setIsAnalyzing(false);
    if (onReset) {
      onReset();
    }
  };

  // Calculate area bounds for analysis (as a square)
  const getAreaBounds = () => {
    if (areaDots.length < 4) return null;
    
    const lats = areaDots.map(dot => dot.lat);
    const lngs = areaDots.map(dot => dot.lng);
    
    const north = Math.max(...lats);
    const south = Math.min(...lats);
    const east = Math.max(...lngs);
    const west = Math.min(...lngs);
    
    // Return square bounds
    return {
      north,
      south,
      east,
      west,
      // Square polygon coordinates
      polygon: [
        [north, west], // Top-left
        [north, east], // Top-right
        [south, east], // Bottom-right
        [south, west]  // Bottom-left
      ]
    };
  };

  // Handle area analysis
  const handleAnalyzeArea = async () => {
    if (areaDots.length !== 4) return;
    
    setIsAnalyzing(true);
    const bounds = getAreaBounds();
    
    try {
      if (onAreaComplete) {
        await onAreaComplete(bounds);
      }
    } catch (error) {
      console.error('Error analyzing area:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAreaMode) {
    return null;
  }

  return (
    <>
      {/* Area click handler */}
      <AreaClickHandler
        onAreaClick={handleAreaClick}
        isAreaMode={isAreaMode}
        dotsCount={areaDots.length}
      />

      {/* Area dots markers */}
      {areaDots.map((dot, index) => (
        <Marker
          key={`area-dot-${index}`}
          position={[dot.lat, dot.lng]}
          icon={createAreaDotIcon(dot.id)}
          eventHandlers={{
            click: () => handleRemoveDot(index)
          }}
        />
      ))}

      {/* Square overlay */}
      {polygon && (
        <Polygon
          positions={polygon}
          pathOptions={{
            color: '#6366f1',
            weight: 3,
            opacity: 0.9,
            fillColor: '#6366f1',
            fillOpacity: 0.15,
            dashArray: '8, 8'
          }}
        />
      )}

      {/* Area selection controls */}
      <div className="absolute top-20 left-4 z-[1000] space-y-2">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel px-4 py-3 max-w-xs"
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Square Area Selection
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Click on map to place dots ({areaDots.length}/4) - Forms a square area
          </p>
          <p className="text-xs text-gray-500 mt-1">
            The system will create a square from the outermost points
          </p>
          {areaDots.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Click on any dot to remove it
            </p>
          )}
        </motion.div>

        {/* Area info */}
        {areaDots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel px-4 py-3"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Dots Placed: {areaDots.length}/4
              </p>
              
              {polygon && (
                <div className="text-xs text-gray-600">
                  <p>Square area defined successfully!</p>
                  <p className="text-green-600 font-medium">Ready for analysis</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col space-y-2">
          {areaDots.length === 4 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleAnalyzeArea}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analyze Area</span>
                </>
              )}
            </motion.button>
          )}

          {areaDots.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
};

export default AreaSelector;
