/**
 * Scoring Utilities for H2 Optimize
 * Contains functions for calculating site suitability scores
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} radians
 */
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Generate mock renewable energy potential for a given location
 * In a real system, this would query weather/solar irradiance data
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {number} Renewable potential in kWh/m²/year
 */
function generateRenewablePotential(lat, lng) {
  // Base potential with some randomness
  let basePotential = 1750; // Average solar potential
  
  // Gujarat region bonus (excellent solar potential)
  if (lat >= 20.0 && lat <= 24.5 && lng >= 68.0 && lng <= 74.5) {
    basePotential = 1900; // Higher base for Gujarat
  }
  
  // Rajasthan desert region bonus (highest solar potential in India)
  if (lat >= 24.0 && lat <= 30.0 && lng >= 69.0 && lng <= 78.0) {
    basePotential = 1950; // Highest for desert regions
  }
  
  const randomFactor = Math.random() * 200 - 100; // ±100 variation (reduced from ±250)
  
  // Factor in latitude (closer to equator = higher potential)
  const latitudeFactor = Math.cos(toRad(Math.abs(lat))) * 50; // Reduced impact
  
  const potential = basePotential + randomFactor + latitudeFactor;
  
  // Ensure it's within realistic bounds (1600-2000 kWh/m²/year for India)
  return Math.max(1600, Math.min(2000, Math.round(potential)));
}

/**
 * Generate mock grid distance
 * In a real system, this would query actual electrical grid infrastructure
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {number} Distance to nearest grid point in kilometers
 */
function generateGridDistance(lat, lng) {
  // Mock grid points (in a real system, these would be actual grid locations)
  const mockGridPoints = [
    { lat: 23.0225, lng: 72.5714 }, // Ahmedabad, Gujarat
    { lat: 19.0760, lng: 72.8777 }, // Mumbai, Maharashtra
    { lat: 28.7041, lng: 77.1025 }, // Delhi NCR
    { lat: 13.0827, lng: 80.2707 }, // Chennai, Tamil Nadu
    { lat: 17.3850, lng: 78.4867 }, // Hyderabad, Telangana
    { lat: 22.5726, lng: 88.3639 }, // Kolkata, West Bengal
    { lat: 18.5204, lng: 73.8567 }, // Pune, Maharashtra
    { lat: 12.9716, lng: 77.5946 }, // Bangalore, Karnataka
    { lat: 22.3072, lng: 72.1262 }, // Vadodara, Gujarat
    { lat: 21.1702, lng: 72.8311 }, // Surat, Gujarat
  ];
  
  // Find nearest grid point
  let minDistance = Infinity;
  mockGridPoints.forEach(gridPoint => {
    const distance = calculateDistance(lat, lng, gridPoint.lat, gridPoint.lng);
    if (distance < minDistance) {
      minDistance = distance;
    }
  });
  
  // Add some randomness for more realistic mock data
  const randomFactor = Math.random() * 10; // 0-10 km variation (reduced from 20)
  return Math.round((minDistance + randomFactor) * 100) / 100;
}

/**
 * Calculate suitability score for a given location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} distanceToDemand - Distance to nearest demand center in km
 * @returns {Object} Score object with overall score and breakdown
 */
function calculateSuitabilityScore(lat, lng, distanceToDemand) {
  // Generate renewable potential and grid distance
  const renewablePotential = generateRenewablePotential(lat, lng);
  const distanceToGrid = generateGridDistance(lat, lng);
  
  // Calculate score components using improved formula
  // Renewable potential: 35-40 points possible
  const renewableScore = (renewablePotential / 2000) * 40;
  
  // Demand accessibility: More forgiving distance penalty (0-30 points)
  // Uses exponential decay: closer = higher score, but not as punishing for medium distances
  const demandScore = Math.max(0, 30 * Math.exp(-distanceToDemand / 100));
  
  // Grid accessibility: More forgiving distance penalty (0-30 points)
  const gridScore = Math.max(0, 30 * Math.exp(-distanceToGrid / 150));
  
  // Total score (0-100 scale)
  const totalScore = renewableScore + demandScore + gridScore;
  
  return {
    score: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
    details: {
      renewablePotential,
      distanceToDemand: Math.round(distanceToDemand * 100) / 100,
      distanceToGrid,
      breakdown: {
        renewableScore: Math.round(renewableScore * 100) / 100,
        demandScore: Math.round(demandScore * 100) / 100,
        gridScore: Math.round(gridScore * 100) / 100
      }
    }
  };
}

module.exports = {
  calculateDistance,
  calculateSuitabilityScore,
  generateRenewablePotential,
  generateGridDistance
};
