const express = require('express');
const router = express.Router();
const {
  getPlants,
  getPipelines,
  getDemandCenters,
  getStorage
} = require('../controllers/assetController');

/**
 * Asset Routes - RESTful endpoints for hydrogen infrastructure assets
 * All responses are in GeoJSON format for easy map integration
 */

// GET /api/assets/plants - Get all hydrogen production plants
router.get('/plants', getPlants);

// GET /api/assets/pipelines - Get all hydrogen pipelines
router.get('/pipelines', getPipelines);

// GET /api/assets/demand-centers - Get all hydrogen demand centers
router.get('/demand-centers', getDemandCenters);

// GET /api/assets/storage - Get all hydrogen storage facilities
router.get('/storage', getStorage);

module.exports = router;
