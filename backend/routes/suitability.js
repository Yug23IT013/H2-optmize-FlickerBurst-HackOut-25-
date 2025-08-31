const express = require('express');
const router = express.Router();
const { calculateSuitability, analyzeArea } = require('../controllers/suitabilityController');

/**
 * Suitability Routes - Endpoints for site suitability analysis
 */

// POST /api/suitability - Calculate suitability score for a location
// Body: { lat: number, lng: number }
// Response: { score: number, details: {...}, location: {...}, ... }
router.post('/', calculateSuitability);

// POST /api/suitability/area - Analyze area defined by 4 points
// Body: { bounds: { north, south, east, west }, polygon: [[lat, lng], ...], gridResolution?: number }
// Response: { bestSite: {...}, sites: [...], areaStats: {...}, ... }
router.post('/area', analyzeArea);

module.exports = router;
