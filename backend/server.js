const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

/**
 * H2 Optimize Backend Server
 * Express.js server for Green Hydrogen Infrastructure Mapping & Optimization
 */

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const assetRoutes = require('./routes/assets');
const suitabilityRoutes = require('./routes/suitability');
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:3000'  // Create React App default port
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/h2-optimize';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/assets', assetRoutes);
app.use('/api/suitability', suitabilityRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'H2 Optimize API',
    version: '1.0.0',
    description: 'Backend API for Green Hydrogen Infrastructure Mapping and Optimization',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me'
      },
      assets: {
        plants: 'GET /api/assets/plants',
        pipelines: 'GET /api/assets/pipelines',
        demandCenters: 'GET /api/assets/demand-centers',
        storage: 'GET /api/assets/storage'
      },
      suitability: 'POST /api/suitability',
      health: 'GET /health'
    },
    documentation: 'https://github.com/your-repo/h2-optimize#api-documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /api',
      'GET /health',
      'GET /api/assets/plants',
      'GET /api/assets/pipelines',
      'GET /api/assets/demand-centers',
      'GET /api/assets/storage',
      'POST /api/suitability'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  
  try {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 H2 Optimize Backend Server Started');
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API Base URL: http://localhost:${PORT}/api`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log('');
});

// Export app for potential testing or deployment
module.exports = app;
