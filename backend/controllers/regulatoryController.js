const RegulatoryZone = require('../models/RegulatoryZone');

/**
 * Regulatory Zone Controller - Handle regulatory zone operations
 * Provides regulatory data and zone analysis for site suitability
 */

/**
 * Get all regulatory zones as GeoJSON
 * GET /api/regulatory/zones
 */
const getRegulatoryZones = async (req, res) => {
  try {
    const { type, jurisdiction, status = 'active' } = req.query;
    
    // Build query filter
    const filter = { status };
    if (type) filter.type = type;
    if (jurisdiction) filter.jurisdiction = jurisdiction;
    
    const zones = await RegulatoryZone.find(filter);
    
    // Convert to GeoJSON FeatureCollection format
    const geojson = {
      type: 'FeatureCollection',
      features: zones.map(zone => ({
        type: 'Feature',
        properties: {
          id: zone._id,
          name: zone.name,
          type: zone.type,
          jurisdiction: zone.jurisdiction,
          policies: zone.policies,
          restrictions: zone.restrictions,
          approvalTimeline: zone.approvalTimeline,
          contactInfo: zone.contactInfo,
          effectiveDate: zone.effectiveDate,
          expiryDate: zone.expiryDate,
          status: zone.status,
          regulatoryScore: zone.calculateRegulatoryScore(),
          createdAt: zone.createdAt,
          updatedAt: zone.updatedAt
        },
        geometry: zone.boundary
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching regulatory zones:', error);
    res.status(500).json({
      error: 'Failed to fetch regulatory zones',
      message: error.message
    });
  }
};

/**
 * Find regulatory zones containing a specific point
 * POST /api/regulatory/zones/containing-point
 * Body: { lat: number, lng: number }
 */
const getZonesContainingPoint = async (req, res) => {
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
    
    // Find zones containing the point using geospatial query
    const zones = await RegulatoryZone.find({
      boundary: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      },
      status: 'active'
    });
    
    // Calculate regulatory analysis
    const analysis = analyzeRegulatoryEnvironment(zones, lat, lng);
    
    res.json({
      location: { lat, lng },
      zones: zones.map(zone => ({
        id: zone._id,
        name: zone.name,
        type: zone.type,
        jurisdiction: zone.jurisdiction,
        policies: zone.policies,
        restrictions: zone.restrictions,
        approvalTimeline: zone.approvalTimeline,
        regulatoryScore: zone.calculateRegulatoryScore(),
        contactInfo: zone.contactInfo
      })),
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error finding zones containing point:', error);
    res.status(500).json({
      error: 'Failed to analyze regulatory zones',
      message: error.message
    });
  }
};

/**
 * Get regulatory zone statistics
 * GET /api/regulatory/stats
 */
const getRegulatoryStats = async (req, res) => {
  try {
    const stats = await RegulatoryZone.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgApprovalTime: { $avg: '$approvalTimeline' },
          avgSubsidy: { $avg: '$policies.subsidyPercentage' },
          incentiveZones: {
            $sum: { $cond: ['$policies.hydrogenIncentives', 1, 0] }
          },
          fastTrackZones: {
            $sum: { $cond: ['$policies.fastTrackApproval', 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const jurisdictionStats = await RegulatoryZone.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$jurisdiction',
          count: { $sum: 1 },
          totalIncentiveZones: {
            $sum: { $cond: ['$policies.hydrogenIncentives', 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      zoneTypes: stats,
      jurisdictions: jurisdictionStats,
      totalZones: await RegulatoryZone.countDocuments({ status: 'active' }),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting regulatory stats:', error);
    res.status(500).json({
      error: 'Failed to get regulatory statistics',
      message: error.message
    });
  }
};

/**
 * Analyze regulatory environment for a location
 * @param {Array} zones - Array of regulatory zones
 * @param {Number} lat - Latitude
 * @param {Number} lng - Longitude
 * @returns {Object} Regulatory analysis
 */
function analyzeRegulatoryEnvironment(zones, lat, lng) {
  if (zones.length === 0) {
    return {
      overallScore: 30, // Neutral/unknown regulatory environment
      level: 'Unknown',
      color: '#9ca3af',
      description: 'No specific regulatory zones identified. Standard approval processes apply.',
      recommendations: [
        'Consult local authorities for specific requirements',
        'Consider proximity to industrial zones for better support',
        'Check for any upcoming policy changes'
      ],
      incentives: [],
      restrictions: [],
      approvalTimeline: '6-12 months (estimated)',
      keyContacts: []
    };
  }
  
  // Calculate weighted average score
  const scores = zones.map(zone => zone.calculateRegulatoryScore());
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  
  // Collect incentives and restrictions
  const incentives = [];
  const restrictions = [];
  let shortestApproval = Infinity;
  const contacts = [];
  
  zones.forEach(zone => {
    // Collect incentives
    if (zone.policies.hydrogenIncentives) {
      incentives.push(`${zone.name}: Hydrogen development incentives available`);
    }
    if (zone.policies.subsidyPercentage > 0) {
      incentives.push(`${zone.name}: ${zone.policies.subsidyPercentage}% subsidy available`);
    }
    if (zone.policies.fastTrackApproval) {
      incentives.push(`${zone.name}: Fast-track approval process`);
    }
    if (zone.policies.landAcquisitionSupport) {
      incentives.push(`${zone.name}: Land acquisition support provided`);
    }
    if (zone.policies.infrastructureSupport) {
      incentives.push(`${zone.name}: Infrastructure development support`);
    }
    
    // Collect restrictions
    if (zone.restrictions.maxCapacity) {
      restrictions.push(`${zone.name}: Maximum capacity ${zone.restrictions.maxCapacity} MW`);
    }
    zone.restrictions.environmentalLimitations.forEach(limitation => {
      restrictions.push(`${zone.name}: ${limitation.replace('-', ' ')}`);
    });
    zone.restrictions.seasonalRestrictions.forEach(restriction => {
      restrictions.push(`${zone.name}: Seasonal restrictions during ${restriction.months.join(', ')}`);
    });
    
    // Track shortest approval timeline
    if (zone.approvalTimeline < shortestApproval) {
      shortestApproval = zone.approvalTimeline;
    }
    
    // Collect contact information
    if (zone.contactInfo.authority) {
      contacts.push({
        zone: zone.name,
        authority: zone.contactInfo.authority,
        email: zone.contactInfo.email,
        phone: zone.contactInfo.phone,
        website: zone.contactInfo.website
      });
    }
  });
  
  // Determine level and recommendations
  let level, color, description, recommendations;
  
  if (overallScore >= 80) {
    level = 'Highly Favorable';
    color = '#22c55e';
    description = 'Excellent regulatory environment with strong government support and incentives.';
    recommendations = [
      'Proceed with detailed feasibility study',
      'Engage with local authorities early for fast-track processing',
      'Leverage available incentives and subsidies'
    ];
  } else if (overallScore >= 60) {
    level = 'Favorable';
    color = '#84cc16';
    description = 'Good regulatory environment with some incentives and reasonable approval processes.';
    recommendations = [
      'Review specific zone requirements in detail',
      'Consider timing to optimize incentive utilization',
      'Prepare comprehensive environmental assessments'
    ];
  } else if (overallScore >= 40) {
    level = 'Moderate';
    color = '#eab308';
    description = 'Mixed regulatory environment. Some benefits but also restrictions to consider.';
    recommendations = [
      'Conduct thorough regulatory due diligence',
      'Consider phased development approach',
      'Engage regulatory consultants familiar with local requirements'
    ];
  } else if (overallScore >= 20) {
    level = 'Challenging';
    color = '#f97316';
    description = 'Complex regulatory environment with significant restrictions or lengthy processes.';
    recommendations = [
      'Assess if benefits justify regulatory complexity',
      'Consider alternative locations with better regulatory support',
      'Plan for extended development timeline'
    ];
  } else {
    level = 'Unfavorable';
    color = '#ef4444';
    description = 'Difficult regulatory environment with major restrictions or lack of support.';
    recommendations = [
      'Strongly consider alternative locations',
      'If proceeding, engage specialized regulatory experts',
      'Plan for significant time and resource investment'
    ];
  }
  
  return {
    overallScore,
    level,
    color,
    description,
    recommendations: recommendations.slice(0, 3), // Limit to top 3
    incentives: incentives.slice(0, 5), // Limit to top 5
    restrictions: restrictions.slice(0, 5), // Limit to top 5
    approvalTimeline: shortestApproval === Infinity ? '6-12 months (estimated)' : `${Math.ceil(shortestApproval / 30)} months`,
    keyContacts: contacts.slice(0, 3), // Limit to top 3
    affectedZones: zones.length
  };
}

module.exports = {
  getRegulatoryZones,
  getZonesContainingPoint,
  getRegulatoryStats
};
