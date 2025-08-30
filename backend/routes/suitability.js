const express = require('express');
const router = express.Router();
const { calculateSuitability } = require('../controllers/suitabilityController');

/**
 * Suitability Routes - Endpoints for site suitability analysis
 */

// POST /api/suitability - Calculate suitability score for a location
// Body: { lat: number, lng: number }
// Response: { score: number, details: {...}, location: {...}, ... }
router.post('/', calculateSuitability);

module.exports = router;
