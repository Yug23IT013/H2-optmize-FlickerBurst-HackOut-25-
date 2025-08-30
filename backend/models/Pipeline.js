const mongoose = require('mongoose');

/**
 * Pipeline Model - Represents hydrogen transport pipelines
 * Uses GeoJSON LineString for pipeline paths
 */
const pipelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true
    },
    coordinates: {
      type: [[Number]],
      required: true,
      validate: {
        validator: function(v) {
          // LineString must have at least 2 coordinate pairs
          if (v.length < 2) return false;
          // Each coordinate pair must be [longitude, latitude]
          return v.every(coord => 
            coord.length === 2 &&
            coord[0] >= -180 && coord[0] <= 180 && // longitude
            coord[1] >= -90 && coord[1] <= 90      // latitude
          );
        },
        message: 'LineString must have at least 2 valid coordinate pairs [longitude, latitude]'
      }
    }
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['operational', 'planned', 'under-construction', 'decommissioned'],
    default: 'planned'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
pipelineSchema.index({ path: '2dsphere' });

module.exports = mongoose.model('Pipeline', pipelineSchema);
