const mongoose = require('mongoose');

/**
 * DemandCenter Model - Represents hydrogen demand/consumption centers
 * Includes GeoJSON Point location for spatial queries
 */
const demandCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
  },
  demand: {
    type: Number,
    required: true,
    min: 0,
    description: 'Annual hydrogen demand in tonnes'
  },
  type: {
    type: String,
    enum: ['industrial', 'transport', 'residential', 'mixed'],
    default: 'industrial'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
demandCenterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DemandCenter', demandCenterSchema);
