const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const Pipeline = require('./models/Pipeline');
const DemandCenter = require('./models/DemandCenter');
const Storage = require('./models/Storage');
const RegulatoryZone = require('./models/RegulatoryZone');
require('dotenv').config();

/**
 * Database Seeding Script for H2 Optimize
 * Creates sample data for hackathon demo
 */

const mockData = {
  plants: [
    {
      name: "Jamnagar Green Hydrogen Plant",
      capacity: 120, // MW
      status: "operational",
      location: {
        type: "Point",
        coordinates: [70.0667, 22.4697] // Jamnagar, Gujarat
      }
    },
    {
      name: "Kutch Solar H2 Facility",
      capacity: 200,
      status: "under-construction",
      location: {
        type: "Point",
        coordinates: [69.8597, 23.7337] // Kutch, Gujarat
      }
    },
    {
      name: "Ahmedabad Industrial H2 Center",
      capacity: 85,
      status: "operational",
      location: {
        type: "Point",
        coordinates: [72.5714, 23.0225] // Ahmedabad, Gujarat
      }
    },
    {
      name: "Kandla Port H2 Production Unit",
      capacity: 150,
      status: "planned",
      location: {
        type: "Point",
        coordinates: [70.2167, 23.0333] // Kandla Port, Gujarat
      }
    },
    {
      name: "Mumbai Green Energy Hub",
      capacity: 180,
      status: "under-construction",
      location: {
        type: "Point",
        coordinates: [72.8777, 19.0760] // Mumbai, Maharashtra
      }
    },
    {
      name: "Chennai Renewable H2 Plant",
      capacity: 95,
      status: "planned",
      location: {
        type: "Point",
        coordinates: [80.2707, 13.0827] // Chennai, Tamil Nadu
      }
    }
  ],

  demandCenters: [
    {
      name: "Reliance Jamnagar Refinery",
      demand: 3500, // tonnes/year
      type: "industrial",
      location: {
        type: "Point",
        coordinates: [70.0667, 22.4697] // Jamnagar, Gujarat
      }
    },
    {
      name: "GIDC Ankleshwar Industrial Complex",
      demand: 2800,
      type: "industrial",
      location: {
        type: "Point",
        coordinates: [72.9881, 21.6279] // Ankleshwar, Gujarat
      }
    },
    {
      name: "Kandla Port Authority",
      demand: 1800,
      type: "transport",
      location: {
        type: "Point",
        coordinates: [70.2167, 23.0333] // Kandla Port, Gujarat
      }
    },
    {
      name: "Tata Steel Jamshedpur",
      demand: 4200,
      type: "industrial",
      location: {
        type: "Point",
        coordinates: [86.1844, 22.8046] // Jamshedpur, Jharkhand
      }
    },
    {
      name: "Mumbai Port Trust",
      demand: 2500,
      type: "transport",
      location: {
        type: "Point",
        coordinates: [72.8777, 19.0760] // Mumbai, Maharashtra
      }
    },
    {
      name: "Delhi NCR Transport Hub",
      demand: 3200,
      type: "transport",
      location: {
        type: "Point",
        coordinates: [77.1025, 28.7041] // Delhi, NCR
      }
    },
    {
      name: "Pune Automotive Cluster",
      demand: 1900,
      type: "industrial",
      location: {
        type: "Point",
        coordinates: [73.8567, 18.5204] // Pune, Maharashtra
      }
    },
    {
      name: "Hyderabad Pharma City",
      demand: 1400,
      type: "industrial",
      location: {
        type: "Point",
        coordinates: [78.4867, 17.3850] // Hyderabad, Telangana
      }
    }
  ],

  storage: [
    {
      name: "Gujarat State H2 Storage Hub",
      capacity: 1200, // tonnes
      type: "underground",
      status: "operational",
      location: {
        type: "Point",
        coordinates: [72.1262, 22.3072] // Vadodara, Gujarat
      }
    },
    {
      name: "Kutch Salt Cavern Storage",
      capacity: 2000,
      type: "underground",
      status: "planned",
      location: {
        type: "Point",
        coordinates: [69.8597, 23.7337] // Kutch, Gujarat
      }
    },
    {
      name: "Mumbai Industrial Storage",
      capacity: 800,
      type: "compressed",
      status: "under-construction",
      location: {
        type: "Point",
        coordinates: [72.8777, 19.0760] // Mumbai, Maharashtra
      }
    },
    {
      name: "Chennai Port Storage Facility",
      capacity: 600,
      type: "compressed",
      status: "operational",
      location: {
        type: "Point",
        coordinates: [80.2707, 13.0827] // Chennai, Tamil Nadu
      }
    },
    {
      name: "Delhi NCR Central Storage",
      capacity: 950,
      type: "compressed",
      status: "planned",
      location: {
        type: "Point",
        coordinates: [77.1025, 28.7041] // Delhi, NCR
      }
    }
  ],

  pipelines: [
    {
      name: "Gujarat Green H2 Corridor",
      capacity: 400, // MW equivalent
      status: "under-construction",
      path: {
        type: "LineString",
        coordinates: [
          [70.0667, 22.4697], // Jamnagar
          [72.1262, 22.3072], // Vadodara
          [72.5714, 23.0225], // Ahmedabad
          [70.2167, 23.0333]  // Kandla Port
        ]
      }
    },
    {
      name: "Western India H2 Pipeline",
      capacity: 350,
      status: "planned",
      path: {
        type: "LineString",
        coordinates: [
          [72.5714, 23.0225], // Ahmedabad
          [72.8777, 19.0760], // Mumbai
          [73.8567, 18.5204]  // Pune
        ]
      }
    },
    {
      name: "East-West H2 Transmission Line",
      capacity: 500,
      status: "planned",
      path: {
        type: "LineString",
        coordinates: [
          [72.8777, 19.0760], // Mumbai
          [77.1025, 28.7041], // Delhi
          [86.1844, 22.8046]  // Jamshedpur
        ]
      }
    },
    {
      name: "South India H2 Network",
      capacity: 280,
      status: "planned",
      path: {
        type: "LineString",
        coordinates: [
          [80.2707, 13.0827], // Chennai
          [78.4867, 17.3850], // Hyderabad
          [77.5946, 12.9716]  // Bangalore
        ]
      }
    }
  ],

  regulatoryZones: [
    {
      name: "Gujarat Green Hydrogen Policy Zone",
      type: "hydrogen-priority-zone",
      jurisdiction: "state",
      boundary: {
        type: "Polygon",
        coordinates: [[
          [68.5, 20.0],   // Southwest corner
          [74.5, 20.0],   // Southeast corner
          [74.5, 24.5],   // Northeast corner
          [68.5, 24.5],   // Northwest corner
          [68.5, 20.0]    // Close the polygon
        ]]
      },
      policies: {
        hydrogenIncentives: true,
        subsidyPercentage: 25,
        fastTrackApproval: true,
        environmentalClearanceRequired: true,
        landAcquisitionSupport: true,
        infrastructureSupport: true
      },
      restrictions: {
        maxCapacity: null,
        environmentalLimitations: ['water-usage-limit'],
        seasonalRestrictions: []
      },
      approvalTimeline: 120,
      contactInfo: {
        authority: "Gujarat Energy Development Agency",
        email: "hydrogen@geda.gujarat.gov.in",
        phone: "+91-79-2327-6000",
        website: "https://geda.gujarat.gov.in"
      },
      effectiveDate: new Date('2023-01-01'),
      status: "active"
    },
    {
      name: "Kandla Port Authority Zone",
      type: "port-authority",
      jurisdiction: "port-authority",
      boundary: {
        type: "Polygon",
        coordinates: [[
          [70.0, 22.8],   // Southwest
          [70.5, 22.8],   // Southeast
          [70.5, 23.2],   // Northeast
          [70.0, 23.2],   // Northwest
          [70.0, 22.8]    // Close
        ]]
      },
      policies: {
        hydrogenIncentives: true,
        subsidyPercentage: 15,
        fastTrackApproval: true,
        environmentalClearanceRequired: true,
        landAcquisitionSupport: false,
        infrastructureSupport: true
      },
      restrictions: {
        maxCapacity: 500,
        environmentalLimitations: ['emission-limit', 'noise-restriction'],
        seasonalRestrictions: []
      },
      approvalTimeline: 90,
      contactInfo: {
        authority: "Kandla Port Trust",
        email: "info@kandlaport.gov.in",
        phone: "+91-2836-270200",
        website: "https://kandlaport.gov.in"
      },
      effectiveDate: new Date('2022-06-01'),
      status: "active"
    },
    {
      name: "Delhi NCR Industrial Corridor",
      type: "industrial-zone",
      jurisdiction: "central",
      boundary: {
        type: "Polygon",
        coordinates: [[
          [76.5, 28.0],   // Southwest
          [78.0, 28.0],   // Southeast
          [78.0, 29.5],   // Northeast
          [76.5, 29.5],   // Northwest
          [76.5, 28.0]    // Close
        ]]
      },
      policies: {
        hydrogenIncentives: false,
        subsidyPercentage: 10,
        fastTrackApproval: false,
        environmentalClearanceRequired: true,
        landAcquisitionSupport: false,
        infrastructureSupport: true
      },
      restrictions: {
        maxCapacity: 200,
        environmentalLimitations: ['emission-limit', 'water-usage-limit', 'noise-restriction'],
        seasonalRestrictions: [
          {
            months: ['nov', 'dec', 'jan', 'feb'],
            reason: 'Air quality restrictions during winter months'
          }
        ]
      },
      approvalTimeline: 240,
      contactInfo: {
        authority: "Delhi Pollution Control Committee",
        email: "member.secy@dpcc.delhigovt.nic.in",
        phone: "+91-11-2370-0846",
        website: "https://dpcc.delhigovt.nic.in"
      },
      effectiveDate: new Date('2021-04-01'),
      status: "active"
    },
    {
      name: "Maharashtra Renewable Energy Zone",
      type: "renewable-energy-zone",
      jurisdiction: "state",
      boundary: {
        type: "Polygon",
        coordinates: [[
          [72.0, 18.0],   // Southwest
          [75.0, 18.0],   // Southeast
          [75.0, 20.5],   // Northeast
          [72.0, 20.5],   // Northwest
          [72.0, 18.0]    // Close
        ]]
      },
      policies: {
        hydrogenIncentives: true,
        subsidyPercentage: 20,
        fastTrackApproval: false,
        environmentalClearanceRequired: true,
        landAcquisitionSupport: true,
        infrastructureSupport: false
      },
      restrictions: {
        maxCapacity: null,
        environmentalLimitations: ['land-use-restriction'],
        seasonalRestrictions: []
      },
      approvalTimeline: 180,
      contactInfo: {
        authority: "Maharashtra Energy Development Agency",
        email: "info@mahaurja.com",
        phone: "+91-20-2553-2733",
        website: "https://mahaurja.com"
      },
      effectiveDate: new Date('2022-03-01'),
      status: "active"
    },
    {
      name: "Rajasthan Solar Park Zone",
      type: "renewable-energy-zone",
      jurisdiction: "state",
      boundary: {
        type: "Polygon",
        coordinates: [[
          [69.0, 24.0],   // Southwest
          [78.0, 24.0],   // Southeast
          [78.0, 30.0],   // Northeast
          [69.0, 30.0],   // Northwest
          [69.0, 24.0]    // Close
        ]]
      },
      policies: {
        hydrogenIncentives: true,
        subsidyPercentage: 30,
        fastTrackApproval: true,
        environmentalClearanceRequired: false,
        landAcquisitionSupport: true,
        infrastructureSupport: true
      },
      restrictions: {
        maxCapacity: null,
        environmentalLimitations: ['water-usage-limit'],
        seasonalRestrictions: []
      },
      approvalTimeline: 90,
      contactInfo: {
        authority: "Rajasthan Renewable Energy Corporation",
        email: "info@rrecl.com",
        phone: "+91-141-2385500",
        website: "https://energy.rajasthan.gov.in"
      },
      effectiveDate: new Date('2023-04-01'),
      status: "active"
    },
    {
      name: "Western Ghats Environmental Sensitive Zone",
      type: "environmental-sensitive",
      jurisdiction: "central",
      boundary: {
        type: "Polygon",
        coordinates: [[
          [73.0, 15.0],   // Southwest
          [77.0, 15.0],   // Southeast
          [77.0, 21.0],   // Northeast
          [73.0, 21.0],   // Northwest
          [73.0, 15.0]    // Close
        ]]
      },
      policies: {
        hydrogenIncentives: false,
        subsidyPercentage: 0,
        fastTrackApproval: false,
        environmentalClearanceRequired: true,
        landAcquisitionSupport: false,
        infrastructureSupport: false
      },
      restrictions: {
        maxCapacity: 50,
        environmentalLimitations: ['emission-limit', 'noise-restriction', 'land-use-restriction', 'water-usage-limit'],
        seasonalRestrictions: [
          {
            months: ['jun', 'jul', 'aug', 'sep'],
            reason: 'Monsoon season environmental protection'
          }
        ]
      },
      approvalTimeline: 365,
      contactInfo: {
        authority: "Ministry of Environment, Forest and Climate Change",
        email: "secy-moef@nic.in",
        phone: "+91-11-2436-0668",
        website: "https://moef.gov.in"
      },
      effectiveDate: new Date('2020-01-01'),
      status: "active"
    }
  ]
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/h2-optimize';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await RegulatoryZone.deleteMany({});

    // Insert mock data
    console.log('🌱 Seeding database with mock data...');

    
    const regulatoryZones = await RegulatoryZone.insertMany(mockData.regulatoryZones);
    console.log(`   ⚖️  Created ${regulatoryZones.length} regulatory zones`);

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Plants: ${plants.length}`);
    console.log(`   Demand Centers: ${demandCenters.length}`);
    console.log(`   Storage Facilities: ${storage.length}`);
    console.log(`   Pipelines: ${pipelines.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, mockData };
