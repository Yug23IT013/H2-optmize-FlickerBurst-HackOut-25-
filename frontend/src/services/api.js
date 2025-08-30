import axios from 'axios';

/**
 * API Service for H2 Optimize Frontend
 * Handles all communication with the backend API
 */

// Base URL for API calls - uses proxy in development
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'http://localhost:5000'
  : '';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (development only)
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Asset API calls
 */
export const assetsAPI = {
  /**
   * Get all hydrogen production plants
   * @returns {Promise} GeoJSON FeatureCollection of plants
   */
  getPlants: async () => {
    try {
      const response = await api.get('/api/assets/plants');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch plants: ${error.message}`);
    }
  },

  /**
   * Get all hydrogen pipelines
   * @returns {Promise} GeoJSON FeatureCollection of pipelines
   */
  getPipelines: async () => {
    try {
      const response = await api.get('/api/assets/pipelines');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch pipelines: ${error.message}`);
    }
  },

  /**
   * Get all demand centers
   * @returns {Promise} GeoJSON FeatureCollection of demand centers
   */
  getDemandCenters: async () => {
    try {
      const response = await api.get('/api/assets/demand-centers');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch demand centers: ${error.message}`);
    }
  },

  /**
   * Get all storage facilities
   * @returns {Promise} GeoJSON FeatureCollection of storage facilities
   */
  getStorage: async () => {
    try {
      const response = await api.get('/api/assets/storage');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch storage facilities: ${error.message}`);
    }
  },

  /**
   * Get all assets at once
   * @returns {Promise} Object with all asset types
   */
  getAllAssets: async () => {
    try {
      const [plants, pipelines, demandCenters, storage] = await Promise.all([
        assetsAPI.getPlants(),
        assetsAPI.getPipelines(),
        assetsAPI.getDemandCenters(),
        assetsAPI.getStorage(),
      ]);

      return {
        plants,
        pipelines,
        demandCenters,
        storage,
      };
    } catch (error) {
      throw new Error(`Failed to fetch assets: ${error.message}`);
    }
  },
};

/**
 * Suitability API calls
 */
export const suitabilityAPI = {
  /**
   * Calculate suitability score for a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise} Suitability score and details
   */
  calculateSuitability: async (lat, lng) => {
    try {
      const response = await api.post('/api/suitability', { lat, lng });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to calculate suitability: ${error.message}`);
    }
  },
};

/**
 * Health check API call
 */
export const healthAPI = {
  /**
   * Check server health
   * @returns {Promise} Server health status
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },
};

// Export default api instance for custom calls
export default api;
