const DemandCenter = require('../models/DemandCenter');
const { calculateDistance, calculateSuitabilityScore, generateWindSpeed, generateInfrastructureAccess } = require('../utils/scoring');

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

/**
 * Calculate best suitable sites within a defined area
 * POST /api/suitability/area
 * Body: { 
 *   bounds: { north, south, east, west },
 *   polygon: [[lat, lng], ...],
 *   gridResolution?: number 
 * }
 */
const analyzeArea = async (req, res) => {
  try {
    const { bounds, polygon, gridResolution = 20 } = req.body;
    
    // Validate input
    if (!bounds || !polygon) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Both bounds and polygon are required'
      });
    }
    
    const { north, south, east, west } = bounds;
    
    // Validate bounds
    if (north <= south || east <= west) {
      return res.status(400).json({
        error: 'Invalid bounds',
        message: 'North must be greater than south, east must be greater than west'
      });
    }
    
    // Create a grid of points within the bounds
    const sites = [];
    const latStep = (north - south) / gridResolution;
    const lngStep = (east - west) / gridResolution;
    
    console.log(`Analyzing area: ${gridResolution}x${gridResolution} grid`);
    console.log(`Bounds: N:${north}, S:${south}, E:${east}, W:${west}`);
    
    // Reduce grid resolution to prevent timeout - use 8x8 grid (64 points max)
    const actualGridResolution = Math.min(gridResolution, 8);
    
    // Get all demand centers once for the entire analysis (within reasonable distance)
    const centerLat = (north + south) / 2;
    const centerLng = (east + west) / 2;
    
    const demandCenters = await DemandCenter.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [centerLng, centerLat], 
            100 / 6378.1 // 100km radius in radians
          ]
        }
      }
    }).limit(20); // Limit to 20 nearest centers to improve performance
    
    console.log(`Found ${demandCenters.length} demand centers in region`);
    
    // Pre-calculate demand center coordinates for faster access
    const demandCenterCoords = demandCenters.map(center => ({
      lat: center.location.coordinates[1],
      lng: center.location.coordinates[0]
    }));
    
    // Generate grid points within the square area (fixed loop bounds)
    for (let i = 0; i < actualGridResolution; i++) {
      for (let j = 0; j < actualGridResolution; j++) {
        const lat = south + ((i + 0.5) * latStep);
        const lng = west + ((j + 0.5) * lngStep);
        
        try {
          // Find nearest demand center for this point (optimized search)
          let minDistance = 100; // Default fallback
          
          if (demandCenterCoords.length > 0) {
            for (const center of demandCenterCoords) {
              const distance = calculateDistance(lat, lng, center.lat, center.lng);
              if (distance < minDistance) {
                minDistance = distance;
                // Early break for very close centers to save computation
                if (distance < 5) break;
              }
            }
          }
          
          // Calculate suitability score for this point
          const siteResult = calculateSuitabilityScore(lat, lng, minDistance);
          siteResult.location = { lat, lng };
          siteResult.interpretation = getScoreInterpretation(siteResult.score);
          
          sites.push(siteResult);
        } catch (error) {
          // Skip this point if there's an error (e.g., invalid coordinates)
          console.warn(`Skipping point [${lat}, ${lng}]: ${error.message}`);
        }
      }
    }
    
    // Sort sites by score (descending)
    sites.sort((a, b) => b.score - a.score);
    
    // Calculate area statistics
    const areaStats = calculateAreaStats(sites, bounds, polygon);
    
    // Get best site
    const bestSite = sites.length > 0 ? sites[0] : null;
    
    const result = {
      bestSite,
      sites: sites.slice(0, 10), // Return top 10 sites
      areaStats,
      timestamp: new Date().toISOString(),
      gridResolution: actualGridResolution,
      totalSitesAnalyzed: sites.length,
      analysisType: 'square'
    };
    
    console.log(`Analysis complete: Found ${sites.length} sites, best score: ${bestSite?.score || 0}`);
    
    res.json(result);
    
  } catch (error) {
    console.error('Error analyzing area:', error);
    res.status(500).json({
      error: 'Failed to analyze area',
      message: error.message
    });
  }
};

/**
 * Calculate statistics for the analyzed square area
 * @param {Array} sites - Array of analyzed sites
 * @param {Object} bounds - Area bounds
 * @param {Array} polygon - Polygon coordinates (not used for square)
 * @returns {Object} Area statistics
 */
function calculateAreaStats(sites, bounds, polygon) {
  const scores = sites.map(site => site.score);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;
  
  // Calculate actual square area using Haversine formula for more accuracy
  const latDiff = bounds.north - bounds.south;
  const lngDiff = bounds.east - bounds.west;
  
  // Convert degrees to kilometers (approximate)
  const latKm = latDiff * 111; // 1 degree latitude ≈ 111 km
  const lngKm = lngDiff * 111 * Math.cos(((bounds.north + bounds.south) / 2) * Math.PI / 180); // Adjust for longitude at this latitude
  
  const areaKm2 = Math.abs(latKm * lngKm);
  
  // Count suitable sites (score >= 60)
  const suitableSites = sites.filter(site => site.score >= 60).length;
  
  return {
    sitesAnalyzed: sites.length,
    avgScore: Math.round(avgScore * 100) / 100,
    maxScore: Math.round(maxScore * 100) / 100,
    minScore: Math.round(minScore * 100) / 100,
    areaSize: Math.round(areaKm2 * 100) / 100,
    suitableSites,
    excellentSites: sites.filter(site => site.score >= 80).length,
    goodSites: sites.filter(site => site.score >= 60 && site.score < 80).length,
    fairSites: sites.filter(site => site.score >= 40 && site.score < 60).length,
    poorSites: sites.filter(site => site.score < 40).length,
    // Additional square-specific stats
    squareDimensions: {
      latitudeSpan: Math.round(latKm * 100) / 100,
      longitudeSpan: Math.round(lngKm * 100) / 100
    }
  };
}

module.exports = {
  calculateSuitability,
  analyzeArea
};
