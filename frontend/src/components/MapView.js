import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { suitabilityAPI } from '../services/api';
import PopupInfo from './PopupInfo';
import AreaSelector from './AreaSelector';
import AreaAnalysisResult from './AreaAnalysisResult';

/**
 * MapView Component - Interactive Leaflet map with asset layers
 * Handles map interactions, asset visualization, and suitability scoring
 */

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for different asset types
const createCustomIcon = (color, iconType) => {
  const iconMap = {
    plant: '⚡',
    storage: '🏪',
    demand: '🏭',
    pipeline: '🔗'
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${iconMap[iconType] || '📍'}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

// Best site marker icon
const createBestSiteIcon = () => {
  return L.divIcon({
    className: 'best-site-icon',
    html: `
      <div style="
        background: linear-gradient(45deg, #22c55e, #16a34a);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        font-size: 16px;
        color: white;
        animation: pulse 2s infinite;
      ">
        ⭐
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// Asset styling configuration
const assetStyles = {
  plants: {
    icon: createCustomIcon('#22c55e', 'plant'),
    color: '#22c55e'
  },
  storage: {
    icon: createCustomIcon('#3b82f6', 'storage'),
    color: '#3b82f6'
  },
  demandCenters: {
    icon: createCustomIcon('#f59e0b', 'demand'),
    color: '#f59e0b'
  },
  pipelines: {
    color: '#8b5cf6',
    weight: 4,
    opacity: 0.8
  },
  regulatoryZones: {
    // Different colors for different zone types
    'hydrogen-priority-zone': { fillColor: '#22c55e', color: '#16a34a', fillOpacity: 0.2 },
    'renewable-energy-zone': { fillColor: '#3b82f6', color: '#1d4ed8', fillOpacity: 0.2 },
    'industrial-zone': { fillColor: '#f59e0b', color: '#d97706', fillOpacity: 0.2 },
    'port-authority': { fillColor: '#8b5cf6', color: '#7c3aed', fillOpacity: 0.2 },
    'special-economic-zone': { fillColor: '#06b6d4', color: '#0891b2', fillOpacity: 0.2 },
    'environmental-sensitive': { fillColor: '#ef4444', color: '#dc2626', fillOpacity: 0.3 },
    'restricted-zone': { fillColor: '#ef4444', color: '#dc2626', fillOpacity: 0.4 },
    'government-incentive-zone': { fillColor: '#84cc16', color: '#65a30d', fillOpacity: 0.2 }
  }
};

// Map click handler component
function MapClickHandler({ onMapClick, suitabilityMode }) {
  useMapEvents({
    click(e) {
      if (suitabilityMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

const MapView = ({ 
  assets, 
  visibleLayers, 
  suitabilityMode,
  areaMode = false,
  onSuitabilityResult,
  onAreaAnalysisResult,
  className = "" 
}) => {
  const [loading, setLoading] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [areaAnalysisResult, setAreaAnalysisResult] = useState(null);
  const [bestSiteMarker, setBestSiteMarker] = useState(null);
  const mapRef = useRef();

  // World map center coordinates
  const worldCenter = [20, 0]; // Center of world map
  const worldZoom = 3; // Zoom level to show entire world
  
  // Define world bounds to prevent tile repetition
  const worldBounds = [
    [-90, -180], // Southwest coordinates (South Pole, International Date Line West)
    [90, 180]    // Northeast coordinates (North Pole, International Date Line East)
  ];

  // Force map re-render after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        console.log('Map size invalidated for proper rendering');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle area analysis completion
   */
  const handleAreaAnalysis = async (bounds) => {
    setLoading(true);
    try {
      const result = await suitabilityAPI.analyzeArea(bounds, bounds.polygon, 20);
      setAreaAnalysisResult(result);
      
      // Show best site marker if available
      if (result.bestSite) {
        setBestSiteMarker({
          lat: result.bestSite.location.lat,
          lng: result.bestSite.location.lng,
          data: result.bestSite
        });
      }
      
      if (onAreaAnalysisResult) {
        onAreaAnalysisResult(result);
      }
    } catch (error) {
      console.error('Error analyzing area:', error);
      setAreaAnalysisResult({
        error: true,
        message: 'Failed to analyze area'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle site selection from area analysis
   */
  const handleSiteSelect = (site) => {
    // Center map on selected site
    if (mapRef.current) {
      mapRef.current.setView([site.location.lat, site.location.lng], 12);
    }
    
    // Show popup for selected site
    setPopupData(site);
    setPopupPosition([site.location.lat, site.location.lng]);
  };

  /**
   * Reset area analysis
   */
  const handleAreaReset = () => {
    setAreaAnalysisResult(null);
    setBestSiteMarker(null);
  };

  /**
   * Handle map click for suitability scoring
   */
  const handleMapClick = async (latlng) => {
    if (!suitabilityMode || areaMode) return;

    setLoading(true);
    try {
      const result = await suitabilityAPI.calculateSuitability(latlng.lat, latlng.lng);
      
      setPopupData(result);
      setPopupPosition([latlng.lat, latlng.lng]);
      
      if (onSuitabilityResult) {
        onSuitabilityResult(result);
      }
    } catch (error) {
      console.error('Error calculating suitability:', error);
      // Show error popup
      setPopupData({
        error: true,
        message: 'Failed to calculate suitability score'
      });
      setPopupPosition([latlng.lat, latlng.lng]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Style function for point features (plants, storage, demand centers)
   */
  const pointToLayer = (feature, latlng, assetType) => {
    const style = assetStyles[assetType];
    return L.marker(latlng, { icon: style.icon });
  };

  /**
   * Style function for line features (pipelines)
   */
  const pipelineStyle = (feature) => ({
    color: assetStyles.pipelines.color,
    weight: assetStyles.pipelines.weight,
    opacity: assetStyles.pipelines.opacity,
  });

  /**
   * Style function for regulatory zones (polygons)
   */
  const regulatoryZoneStyle = (feature) => {
    const zoneType = feature.properties.type;
    const style = assetStyles.regulatoryZones[zoneType] || assetStyles.regulatoryZones['industrial-zone'];
    
    return {
      fillColor: style.fillColor,
      color: style.color,
      fillOpacity: style.fillOpacity,
      weight: 2,
      opacity: 0.8,
      dashArray: '5, 5' // Dashed border to distinguish from solid fills
    };
  };

  /**
   * Popup content for assets
   */
  const onEachFeature = (feature, layer, assetType) => {
    const props = feature.properties;
    
    let popupContent = `
      <div class="p-2">
        <h3 class="font-bold text-lg text-gray-800">${props.name}</h3>
        <div class="mt-2 space-y-1 text-sm text-gray-600">
    `;

    // Add type-specific information
    switch (assetType) {
      case 'plants':
        popupContent += `
          <p><span class="font-medium">Capacity:</span> ${props.capacity} MW</p>
          <p><span class="font-medium">Status:</span> ${props.status}</p>
        `;
        break;
      case 'storage':
        popupContent += `
          <p><span class="font-medium">Capacity:</span> ${props.capacity} tonnes</p>
          <p><span class="font-medium">Type:</span> ${props.type}</p>
          <p><span class="font-medium">Status:</span> ${props.status}</p>
        `;
        break;
      case 'demandCenters':
        popupContent += `
          <p><span class="font-medium">Demand:</span> ${props.demand} tonnes/year</p>
          <p><span class="font-medium">Type:</span> ${props.type}</p>
        `;
        break;
      case 'pipelines':
        popupContent += `
          <p><span class="font-medium">Capacity:</span> ${props.capacity} MW</p>
          <p><span class="font-medium">Status:</span> ${props.status}</p>
        `;
        break;
      case 'regulatoryZones':
        const scoreColor = props.regulatoryScore >= 80 ? '#22c55e' : 
                          props.regulatoryScore >= 60 ? '#84cc16' :
                          props.regulatoryScore >= 40 ? '#eab308' :
                          props.regulatoryScore >= 20 ? '#f97316' : '#ef4444';
        
        popupContent += `
          <p><span class="font-medium">Type:</span> ${props.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          <p><span class="font-medium">Jurisdiction:</span> ${props.jurisdiction}</p>
          <div class="mt-2">
            <p class="font-medium">Regulatory Score:</p>
            <div class="flex items-center mt-1">
              <div class="w-12 h-3 bg-gray-200 rounded-full mr-2">
                <div 
                  class="h-full rounded-full" 
                  style="width: ${props.regulatoryScore}%; background-color: ${scoreColor}"
                ></div>
              </div>
              <span class="text-sm font-medium" style="color: ${scoreColor}">${props.regulatoryScore}</span>
            </div>
          </div>
          <div class="mt-2">
            <p class="font-medium text-green-600">Incentives:</p>
            ${props.policies.hydrogenIncentives ? '<p class="text-sm">• Hydrogen development incentives</p>' : ''}
            ${props.policies.subsidyPercentage > 0 ? `<p class="text-sm">• ${props.policies.subsidyPercentage}% subsidy available</p>` : ''}
            ${props.policies.fastTrackApproval ? '<p class="text-sm">• Fast-track approval process</p>' : ''}
          </div>
          <p class="text-sm mt-2"><span class="font-medium">Approval Timeline:</span> ${props.approvalTimeline} days</p>
        `;
        break;
      default:
        popupContent += `
          <p><span class="font-medium">Type:</span> ${assetType}</p>
        `;
        break;
    }

    popupContent += `
        </div>
      </div>
    `;

    layer.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup'
    });
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Loading overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[1000] flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-8 h-8 loading-spinner mx-auto mb-2"></div>
            <p className="text-gray-600">Calculating suitability...</p>
          </div>
        </motion.div>
      )}

      {/* Suitability mode indicator */}
      {suitabilityMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 z-[1000] glass-panel px-4 py-2"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-hydrogen-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Click on map to analyze site
            </span>
          </div>
        </motion.div>
      )}

      {/* Map container - simplified */}
      <MapContainer
        center={worldCenter}
        zoom={worldZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        maxBounds={worldBounds}
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
      >
        {/* Base tile layer - simplified for better loading */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map click handler */}
        <MapClickHandler
          onMapClick={handleMapClick}
          suitabilityMode={suitabilityMode && !areaMode}
        />

        {/* Area Selector */}
        {areaMode && (
          <AreaSelector
            isAreaMode={areaMode}
            onAreaComplete={handleAreaAnalysis}
            onReset={handleAreaReset}
          />
        )}

        {/* Best site marker from area analysis */}
        {bestSiteMarker && (
          <Marker
            position={[bestSiteMarker.lat, bestSiteMarker.lng]}
            icon={createBestSiteIcon()}
            eventHandlers={{
              click: () => {
                setPopupData(bestSiteMarker.data);
                setPopupPosition([bestSiteMarker.lat, bestSiteMarker.lng]);
              }
            }}
          />
        )}

        {/* Asset layers */}
        {assets.plants && visibleLayers.plants && (
          <GeoJSON
            key="plants"
            data={assets.plants}
            pointToLayer={(feature, latlng) => pointToLayer(feature, latlng, 'plants')}
            onEachFeature={(feature, layer) => onEachFeature(feature, layer, 'plants')}
          />
        )}

        {assets.storage && visibleLayers.storage && (
          <GeoJSON
            key="storage"
            data={assets.storage}
            pointToLayer={(feature, latlng) => pointToLayer(feature, latlng, 'storage')}
            onEachFeature={(feature, layer) => onEachFeature(feature, layer, 'storage')}
          />
        )}

        {assets.demandCenters && visibleLayers.demandCenters && (
          <GeoJSON
            key="demandCenters"
            data={assets.demandCenters}
            pointToLayer={(feature, latlng) => pointToLayer(feature, latlng, 'demandCenters')}
            onEachFeature={(feature, layer) => onEachFeature(feature, layer, 'demandCenters')}
          />
        )}

        {assets.pipelines && visibleLayers.pipelines && (
          <GeoJSON
            key="pipelines"
            data={assets.pipelines}
            style={pipelineStyle}
            onEachFeature={(feature, layer) => onEachFeature(feature, layer, 'pipelines')}
          />
        )}

        {assets.regulatoryZones && visibleLayers.regulatoryZones && (
          <GeoJSON
            key="regulatoryZones"
            data={assets.regulatoryZones}
            style={regulatoryZoneStyle}
            onEachFeature={(feature, layer) => onEachFeature(feature, layer, 'regulatoryZones')}
          />
        )}

        {/* Suitability result popup */}
        {popupData && popupPosition && (
          <Popup
            position={popupPosition}
            onClose={() => {
              setPopupData(null);
              setPopupPosition(null);
            }}
          >
            <PopupInfo data={popupData} />
          </Popup>
        )}
      </MapContainer>

      {/* Area Analysis Results Panel */}
      {areaAnalysisResult && (
        <div className="absolute top-4 right-4 z-[1000] max-w-md">
          <AreaAnalysisResult
            analysisResult={areaAnalysisResult}
            onSiteSelect={handleSiteSelect}
            onClose={() => setAreaAnalysisResult(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
