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
  const basePotential = 1750; // Average solar potential
  const randomFactor = Math.random() * 500 - 250; // ±250 variation
  
  // Factor in latitude (closer to equator = higher potential)
  const latitudeFactor = Math.cos(toRad(Math.abs(lat))) * 100;
  
  const potential = basePotential + randomFactor + latitudeFactor;
  
  // Ensure it's within realistic bounds (1500-2000 kWh/m²/year)
  return Math.max(1500, Math.min(2000, Math.round(potential)));
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
    { lat: 40.7128, lng: -74.0060 }, // New York area
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles area
    { lat: 41.8781, lng: -87.6298 }, // Chicago area
    { lat: 29.7604, lng: -95.3698 }, // Houston area
    { lat: 39.9526, lng: -75.1652 }, // Philadelphia area
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
  const randomFactor = Math.random() * 20; // 0-20 km variation
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
  
  // Calculate score components using the specified formula
  const renewableScore = (renewablePotential / 2000) * 40;
  const demandScore = (1 / (distanceToDemand + 1)) * 30;
  const gridScore = (1 / (distanceToGrid + 1)) * 30;
  
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
