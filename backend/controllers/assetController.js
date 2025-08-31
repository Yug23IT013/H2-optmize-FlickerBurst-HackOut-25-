const Plant = require('../models/Plant');
const Pipeline = require('../models/Pipeline');
const DemandCenter = require('../models/DemandCenter');
const Storage = require('../models/Storage');
const RegulatoryZone = require('../models/RegulatoryZone');

/**
 * Asset Controllers - Handle CRUD operations for infrastructure assets
 * All responses return GeoJSON format for easy map integration
 */

/**
 * Get all plants as GeoJSON
 */
const getPlants = async (req, res) => {
  try {
    const plants = await Plant.find({});
    
    // Convert to GeoJSON FeatureCollection format
    const geojson = {
      type: 'FeatureCollection',
      features: plants.map(plant => ({
        type: 'Feature',
        properties: {
          id: plant._id,
          name: plant.name,
          capacity: plant.capacity,
          status: plant.status,
          createdAt: plant.createdAt,
          updatedAt: plant.updatedAt
        },
        geometry: plant.location
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ 
      error: 'Failed to fetch plants',
      message: error.message 
    });
  }
};

/**
 * Get all pipelines as GeoJSON
 */
const getPipelines = async (req, res) => {
  try {
    const pipelines = await Pipeline.find({});
    
    // Convert to GeoJSON FeatureCollection format
    const geojson = {
      type: 'FeatureCollection',
      features: pipelines.map(pipeline => ({
        type: 'Feature',
        properties: {
          id: pipeline._id,
          name: pipeline.name,
          capacity: pipeline.capacity,
          status: pipeline.status,
          createdAt: pipeline.createdAt,
          updatedAt: pipeline.updatedAt
        },
        geometry: pipeline.path
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pipelines',
      message: error.message 
    });
  }
};

/**
 * Get all demand centers as GeoJSON
 */
const getDemandCenters = async (req, res) => {
  try {
    const demandCenters = await DemandCenter.find({});
    
    // Convert to GeoJSON FeatureCollection format
    const geojson = {
      type: 'FeatureCollection',
      features: demandCenters.map(center => ({
        type: 'Feature',
        properties: {
          id: center._id,
          name: center.name,
          demand: center.demand,
          type: center.type,
          createdAt: center.createdAt,
          updatedAt: center.updatedAt
        },
        geometry: center.location
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching demand centers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch demand centers',
      message: error.message 
    });
  }
};

/**
 * Get all storage facilities as GeoJSON
 */
const getStorage = async (req, res) => {
  try {
    const storage = await Storage.find({});
    
    // Convert to GeoJSON FeatureCollection format
    const geojson = {
      type: 'FeatureCollection',
      features: storage.map(facility => ({
        type: 'Feature',
        properties: {
          id: facility._id,
          name: facility.name,
          capacity: facility.capacity,
          type: facility.type,
          status: facility.status,
          createdAt: facility.createdAt,
          updatedAt: facility.updatedAt
        },
        geometry: facility.location
      }))
    };
    
    res.json(geojson);
  } catch (error) {
    console.error('Error fetching storage facilities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch storage facilities',
      message: error.message 
    });
  }
};

/**
 * Get all regulatory zones as GeoJSON
 */
const getRegulatoryZones = async (req, res) => {
  try {
    const zones = await RegulatoryZone.find({ status: 'active' });
    
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

module.exports = {
  getPlants,
  getPipelines,
  getDemandCenters,
  getStorage,
  getRegulatoryZones
};
