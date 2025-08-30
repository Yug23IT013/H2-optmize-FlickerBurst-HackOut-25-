const mongoose = require('mongoose');

/**
 * Plant Model - Represents hydrogen production plants
 * Includes GeoJSON Point location for spatial queries
 */
const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        },
        message: 'Coordinates must be [longitude, latitude] within valid ranges'
      }
    }
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
plantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Plant', plantSchema);
