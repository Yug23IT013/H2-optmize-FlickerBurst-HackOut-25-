import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { suitabilityAPI } from '../services/api';
import PopupInfo from './PopupInfo';

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
  onSuitabilityResult,
  className = "" 
}) => {
  const [loading, setLoading] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const mapRef = useRef();

  // Gujarat, India coordinates (center of the state)
  const gujaratCenter = [23.0225, 72.5714];
  const gujaratZoom = 7;

  /**
   * Handle map click for suitability scoring
   */
  const handleMapClick = async (latlng) => {
    if (!suitabilityMode) return;

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
    <div className={`relative ${className}`}>
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

      {/* Map container */}
      <MapContainer
        center={gujaratCenter}
        zoom={gujaratZoom}
        className="h-full w-full rounded-xl"
        ref={mapRef}
      >
        {/* Base tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map click handler */}
        <MapClickHandler
          onMapClick={handleMapClick}
          suitabilityMode={suitabilityMode}
        />

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
    </div>
  );
};

export default MapView;
