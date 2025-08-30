const mongoose = require('mongoose');

/**
 * Storage Model - Represents hydrogen storage facilities
 * Includes GeoJSON Point location for spatial queries
 */
const storageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0,
    description: 'Storage capacity in tonnes of hydrogen'
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
  type: {
    type: String,
    enum: ['underground', 'above-ground', 'compressed', 'liquid'],
    default: 'compressed'
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
storageSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Storage', storageSchema);
