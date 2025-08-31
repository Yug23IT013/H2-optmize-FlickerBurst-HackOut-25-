const express = require('express');
const router = express.Router();
const { 
  getRegulatoryZones, 
  getZonesContainingPoint, 
  getRegulatoryStats 
} = require('../controllers/regulatoryController');

/**
 * Regulatory Zone Routes
 * Provides endpoints for regulatory zone data and analysis
 */

/**
 * @route   GET /api/regulatory/zones
 * @desc    Get all regulatory zones as GeoJSON
 * @query   type, jurisdiction, status
 * @access  Public
 */
router.get('/zones', getRegulatoryZones);

/**
 * @route   POST /api/regulatory/zones/containing-point
 * @desc    Find regulatory zones containing a specific point
 * @body    { lat: number, lng: number }
 * @access  Public
 */
router.post('/zones/containing-point', getZonesContainingPoint);

/**
 * @route   GET /api/regulatory/stats
 * @desc    Get regulatory zone statistics
 * @access  Public
 */
router.get('/stats', getRegulatoryStats);

module.exports = router;
