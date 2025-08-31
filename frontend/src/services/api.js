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

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('h2_optimize_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
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
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name (optional)
   * @returns {Promise} User data and token
   */
  register: async (email, password, name) => {
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        name,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Registration failed: ${message}`);
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} User data and token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Login failed: ${message}`);
    }
  },

  /**
   * Get current user information
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Failed to get user info: ${message}`);
    }
  },

  /**
   * Logout user (client-side only for JWT)
   * @returns {Promise} Success response
   */
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      // Even if logout fails on server, we should clear local data
      console.warn('Logout request failed, but clearing local data');
      return { success: true, message: 'Logged out locally' };
    }
  },
};

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
   * Get all regulatory zones
   * @returns {Promise} GeoJSON FeatureCollection of regulatory zones
   */
  getRegulatoryZones: async () => {
    try {
      const response = await api.get('/api/assets/regulatory-zones');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch regulatory zones: ${error.message}`);
    }
  },

  /**
   * Get all assets at once
   * @returns {Promise} Object with all asset types
   */
  getAllAssets: async () => {
    try {
      const [plants, pipelines, demandCenters, storage, regulatoryZones] = await Promise.all([
        assetsAPI.getPlants(),
        assetsAPI.getPipelines(),
        assetsAPI.getDemandCenters(),
        assetsAPI.getStorage(),
        assetsAPI.getRegulatoryZones(),
      ]);

      return {
        plants,
        pipelines,
        demandCenters,
        storage,
        regulatoryZones,
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

  /**
   * Analyze area defined by 4 points to find best suitable sites
   * @param {Object} bounds - { north, south, east, west }
   * @param {Array} polygon - Array of [lat, lng] coordinates
   * @param {number} gridResolution - Grid resolution for analysis (default: 8)
   * @returns {Promise} Best sites and area analysis
   */
  analyzeArea: async (bounds, polygon, gridResolution = 8) => {
    try {
      const response = await api.post('/api/suitability/area', { 
        bounds, 
        polygon, 
        gridResolution 
      }, {
        timeout: 30000 // 30 second timeout for area analysis
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to analyze area: ${error.message}`);
    }
  },
};

/**
 * Regulatory API calls
 */
export const regulatoryAPI = {
  /**
   * Get all regulatory zones
   * @param {string} type - Zone type filter (optional)
   * @param {string} jurisdiction - Jurisdiction filter (optional)
   * @returns {Promise} GeoJSON FeatureCollection of regulatory zones
   */
  getZones: async (type = null, jurisdiction = null) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (jurisdiction) params.append('jurisdiction', jurisdiction);
      
      const response = await api.get(`/api/regulatory/zones?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch regulatory zones: ${error.message}`);
    }
  },

  /**
   * Get regulatory zones containing a specific point
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise} Regulatory analysis for the location
   */
  getZonesContainingPoint: async (lat, lng) => {
    try {
      const response = await api.post('/api/regulatory/zones/containing-point', { 
        lat, 
        lng 
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to analyze regulatory environment: ${error.message}`);
    }
  },

  /**
   * Get regulatory zone statistics
   * @returns {Promise} Zone statistics by type and jurisdiction
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/regulatory/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch regulatory stats: ${error.message}`);
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
