const mongoose = require('mongoose');

/**
 * RegulatoryZone Model - Represents regulatory boundaries and policies
 * Uses GeoJSON Polygon for zone boundaries with policy information
 */
const regulatoryZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'hydrogen-priority-zone',
      'industrial-zone', 
      'environmental-sensitive',
      'renewable-energy-zone',
      'port-authority',
      'special-economic-zone',
      'restricted-zone',
      'government-incentive-zone'
    ],
    required: true
  },
  jurisdiction: {
    type: String,
    enum: ['central', 'state', 'local', 'port-authority', 'industrial-authority'],
    required: true
  },
  boundary: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Polygon coordinates or MultiPolygon coordinates
      required: true,
      validate: {
        validator: function(v) {
          // Basic validation for polygon coordinates
          if (this.boundary.type === 'Polygon') {
            return v.length >= 1 && v[0].length >= 4;
          }
          return v.length >= 1;
        },
        message: 'Invalid polygon coordinates'
      }
    }
  },
  policies: {
    hydrogenIncentives: {
      type: Boolean,
      default: false
    },
    subsidyPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    fastTrackApproval: {
      type: Boolean,
      default: false
    },
    environmentalClearanceRequired: {
      type: Boolean,
      default: true
    },
    landAcquisitionSupport: {
      type: Boolean,
      default: false
    },
    infrastructureSupport: {
      type: Boolean,
      default: false
    }
  },
  restrictions: {
    maxCapacity: {
      type: Number,
      min: 0,
      default: null // null means no restriction
    },
    environmentalLimitations: [{
      type: String,
      enum: ['water-usage-limit', 'noise-restriction', 'emission-limit', 'land-use-restriction']
    }],
    seasonalRestrictions: [{
      months: [String], // e.g., ['jan', 'feb', 'mar']
      reason: String
    }]
  },
  approvalTimeline: {
    type: Number, // in days
    min: 0,
    default: 180 // default 6 months
  },
  contactInfo: {
    authority: String,
    email: String,
    phone: String,
    website: String
  },
  effectiveDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    default: null // null means indefinite
  },
  status: {
    type: String,
    enum: ['active', 'proposed', 'expired', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
regulatoryZoneSchema.index({ boundary: '2dsphere' });

// Index for efficient querying
regulatoryZoneSchema.index({ type: 1, status: 1 });
regulatoryZoneSchema.index({ jurisdiction: 1 });

/**
 * Calculate regulatory score for a zone
 * Higher score means more favorable for hydrogen development
 */
regulatoryZoneSchema.methods.calculateRegulatoryScore = function() {
  let score = 50; // Base score
  
  // Policy incentives
  if (this.policies.hydrogenIncentives) score += 20;
  score += (this.policies.subsidyPercentage / 100) * 15;
  if (this.policies.fastTrackApproval) score += 10;
  if (this.policies.landAcquisitionSupport) score += 10;
  if (this.policies.infrastructureSupport) score += 10;
  
  // Zone type bonuses
  const zoneTypeBonus = {
    'hydrogen-priority-zone': 25,
    'renewable-energy-zone': 20,
    'industrial-zone': 15,
    'special-economic-zone': 15,
    'port-authority': 10,
    'environmental-sensitive': -20,
    'restricted-zone': -30,
    'government-incentive-zone': 20
  };
  
  score += zoneTypeBonus[this.type] || 0;
  
  // Restrictions penalties
  if (this.restrictions.environmentalLimitations.length > 0) {
    score -= this.restrictions.environmentalLimitations.length * 5;
  }
  
  if (this.restrictions.seasonalRestrictions.length > 0) {
    score -= this.restrictions.seasonalRestrictions.length * 3;
  }
  
  // Approval timeline penalty (longer = worse)
  if (this.approvalTimeline > 365) score -= 10;
  else if (this.approvalTimeline > 180) score -= 5;
  else if (this.approvalTimeline <= 90) score += 5;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
};

module.exports = mongoose.model('RegulatoryZone', regulatoryZoneSchema);
