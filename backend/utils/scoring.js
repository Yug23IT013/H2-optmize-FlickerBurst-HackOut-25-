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
  
  // Delhi NCR region (good solar potential)
  if (lat >= 28.0 && lat <= 29.0 && lng >= 76.5 && lng <= 77.5) {
    basePotential = 1850; // Good potential for Delhi region
  }
  
  // Gujarat region bonus (excellent solar potential)
  if (lat >= 20.0 && lat <= 24.5 && lng >= 68.0 && lng <= 74.5) {
    basePotential = 1900; // Higher base for Gujarat
  }
  
  // Rajasthan desert region bonus (highest solar potential in India)
  if (lat >= 24.0 && lat <= 30.0 && lng >= 69.0 && lng <= 78.0) {
    basePotential = 1950; // Highest for desert regions
  }
  
  // Haryana region (near Delhi, good potential)
  if (lat >= 27.5 && lat <= 30.5 && lng >= 74.5 && lng <= 77.5) {
    basePotential = 1870; // Good potential for Haryana
  }
  
  const randomFactor = Math.random() * 150 - 75; // ±75 variation for more realistic spread
  
  // Factor in latitude (closer to equator = higher potential)
  const latitudeFactor = Math.cos(toRad(Math.abs(lat))) * 30; // Reduced impact
  
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
    { lat: 28.7041, lng: 77.1025 }, // Delhi NCR - Main
    { lat: 28.6139, lng: 77.2090 }, // New Delhi
    { lat: 28.5355, lng: 77.3910 }, // Faridabad
    { lat: 28.4595, lng: 77.0266 }, // Gurgaon
    { lat: 28.9845, lng: 77.7064 }, // Ghaziabad
    { lat: 29.1492, lng: 77.0460 }, // Panipat
    { lat: 23.0225, lng: 72.5714 }, // Ahmedabad, Gujarat
    { lat: 19.0760, lng: 72.8777 }, // Mumbai, Maharashtra
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
  
  // Generate additional factors for more detailed analysis
  const windSpeed = generateWindSpeed(lat, lng);
  const infrastructureAccess = generateInfrastructureAccess(lat, lng);
  
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
    },
    factors: {
      windSpeed: Math.round(windSpeed * 100) / 100,
      solarIrradiance: Math.round(renewablePotential * 100) / 100,
      distanceToDemand: Math.round(distanceToDemand * 100) / 100,
      infrastructureAccess: Math.round(infrastructureAccess * 100) / 100
    }
  };
}

/**
 * Generate mock wind speed for a given location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {number} Wind speed in m/s
 */
function generateWindSpeed(lat, lng) {
  // Base wind speed with some regional variations
  let baseWindSpeed = 6.5; // Average wind speed
  
  // Delhi NCR region (moderate wind speeds)
  if (lat >= 28.0 && lat <= 29.5 && lng >= 76.5 && lng <= 78.0) {
    baseWindSpeed = 7.2; // Moderate winds in Delhi region
  }
  
  // Coastal areas have higher wind speeds
  if (Math.abs(lat) < 20 && (lng < 75 || lng > 80)) {
    baseWindSpeed += 2.5; // Coastal bonus
  }
  
  // High altitude areas (Himalayas nearby)
  if (lat > 30) {
    baseWindSpeed += 1.8;
  }
  
  // Rajasthan desert winds
  if (lat >= 24.0 && lat <= 30.0 && lng >= 69.0 && lng <= 78.0) {
    baseWindSpeed += 1.2; // Desert wind bonus
  }
  
  // Add some randomness but keep it realistic
  const randomFactor = (Math.random() - 0.5) * 2.5; // ±1.25 m/s variation
  return Math.max(4.0, Math.min(12.0, Math.round((baseWindSpeed + randomFactor) * 10) / 10));
}

/**
 * Generate mock infrastructure access score for a given location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {number} Infrastructure access score (0-10)
 */
function generateInfrastructureAccess(lat, lng) {
  // Base infrastructure score
  let baseScore = 6.0;
  
  // Delhi NCR region has excellent infrastructure
  if (lat >= 28.0 && lat <= 29.5 && lng >= 76.5 && lng <= 78.0) {
    baseScore = 8.5; // Excellent infrastructure in Delhi region
  }
  
  // Major cities have better infrastructure
  const majorCities = [
    { lat: 19.0760, lng: 72.8777, score: 8.5 }, // Mumbai
    { lat: 13.0827, lng: 80.2707, score: 8.0 }, // Chennai
    { lat: 12.9716, lng: 77.5946, score: 8.0 }, // Bangalore
    { lat: 23.0225, lng: 72.5714, score: 7.8 }, // Ahmedabad
    { lat: 22.5726, lng: 88.3639, score: 7.5 }, // Kolkata
  ];
  
  // Check proximity to major cities
  for (const city of majorCities) {
    const distance = calculateDistance(lat, lng, city.lat, city.lng);
    if (distance < 50) { // Within 50km of major city
      baseScore = Math.max(baseScore, city.score - (distance / 50) * 2);
    }
  }
  
  // Industrial corridors bonus
  if (lat >= 27.0 && lat <= 30.0 && lng >= 76.0 && lng <= 78.5) {
    baseScore += 1.0; // Delhi-Mumbai industrial corridor
  }
  
  // Remote areas penalty
  if (Math.abs(lat) > 35 || Math.abs(lng) > 85 || Math.abs(lng) < 68) {
    baseScore -= 2.5;
  }
  
  // Add realistic variation
  const randomFactor = (Math.random() - 0.5) * 1.5; // ±0.75 variation
  const finalScore = Math.max(1, Math.min(10, baseScore + randomFactor));
  return Math.round(finalScore * 10) / 10;
}

module.exports = {
  calculateDistance,
  calculateSuitabilityScore,
  generateRenewablePotential,
  generateGridDistance,
  generateWindSpeed,
  generateInfrastructureAccess
};
