const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const Pipeline = require('./models/Pipeline');
const DemandCenter = require('./models/DemandCenter');
const Storage = require('./models/Storage');
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
    await Plant.deleteMany({});
    await Pipeline.deleteMany({});
    await DemandCenter.deleteMany({});
    await Storage.deleteMany({});

    // Insert mock data
    console.log('🌱 Seeding database with mock data...');
    
    const plants = await Plant.insertMany(mockData.plants);
    console.log(`   📍 Created ${plants.length} plants`);
    
    const demandCenters = await DemandCenter.insertMany(mockData.demandCenters);
    console.log(`   🏭 Created ${demandCenters.length} demand centers`);
    
    const storage = await Storage.insertMany(mockData.storage);
    console.log(`   🏪 Created ${storage.length} storage facilities`);
    
    const pipelines = await Pipeline.insertMany(mockData.pipelines);
    console.log(`   🔗 Created ${pipelines.length} pipelines`);

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
