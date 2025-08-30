const DemandCenter = require('../models/DemandCenter');
const { calculateDistance, calculateSuitabilityScore } = require('../utils/scoring');

/**
 * Suitability Controller - Calculate site suitability scores
 * Uses geospatial queries and mock data for hackathon demo
 */

/**
 * Calculate suitability score for a given location
 * POST /api/suitability
 * Body: { lat: number, lng: number }
 */
const calculateSuitability = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    // Validate input
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both lat and lng are required'
      });
    }
    
    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        error: 'Invalid coordinates',
        message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
      });
    }
    
    // Find nearest demand center using MongoDB geospatial query
    const nearestDemandCenter = await DemandCenter.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    });
    
    let distanceToDemand = 100; // Default fallback distance (km)
    let nearestDemandInfo = null;
    
    if (nearestDemandCenter) {
      // Calculate actual distance to nearest demand center
      const [demandLng, demandLat] = nearestDemandCenter.location.coordinates;
      distanceToDemand = calculateDistance(lat, lng, demandLat, demandLng);
      
      nearestDemandInfo = {
        name: nearestDemandCenter.name,
        demand: nearestDemandCenter.demand,
        type: nearestDemandCenter.type,
        coordinates: [demandLng, demandLat]
      };
    }
    
    // Calculate suitability score
    const result = calculateSuitabilityScore(lat, lng, distanceToDemand);
    
    // Add additional context information
    result.location = { lat, lng };
    result.nearestDemandCenter = nearestDemandInfo;
    result.timestamp = new Date().toISOString();
    
    // Add score interpretation for frontend
    result.interpretation = getScoreInterpretation(result.score);
    
    res.json(result);
    
  } catch (error) {
    console.error('Error calculating suitability:', error);
    res.status(500).json({
      error: 'Failed to calculate suitability score',
      message: error.message
    });
  }
};

/**
 * Get interpretation of suitability score
 * @param {number} score - Suitability score (0-100)
 * @returns {Object} Interpretation object
 */
function getScoreInterpretation(score) {
  if (score >= 80) {
    return {
      level: 'Excellent',
      color: '#22c55e', // Green
      description: 'Highly suitable location with excellent renewable potential and infrastructure access'
    };
  } else if (score >= 60) {
    return {
      level: 'Good',
      color: '#84cc16', // Light green
      description: 'Good location with favorable conditions for hydrogen infrastructure'
    };
  } else if (score >= 40) {
    return {
      level: 'Fair',
      color: '#eab308', // Yellow
      description: 'Moderately suitable location with some limitations'
    };
  } else if (score >= 20) {
    return {
      level: 'Poor',
      color: '#f97316', // Orange
      description: 'Limited suitability due to infrastructure or resource constraints'
    };
  } else {
    return {
      level: 'Very Poor',
      color: '#ef4444', // Red
      description: 'Not recommended due to poor renewable potential or infrastructure access'
    };
  }
}

module.exports = {
  calculateSuitability
};
