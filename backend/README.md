# H2 Optimize Backend API

Backend API for Green Hydrogen Infrastructure Mapping and Optimization platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start MongoDB locally (if using local MongoDB):**
   ```bash
   mongod
   ```

4. **Seed the database with demo data:**
   ```bash
   node seedDatabase.js
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Asset Management
All responses are in GeoJSON format for easy map integration.

- **GET** `/api/assets/plants` - Get all hydrogen plants
- **GET** `/api/assets/pipelines` - Get all pipelines  
- **GET** `/api/assets/demand-centers` - Get all demand centers
- **GET** `/api/assets/storage` - Get all storage facilities

### Suitability Analysis
- **POST** `/api/suitability` - Calculate site suitability score
  
  **Request Body:**
  ```json
  {
    "lat": 34.0522,
    "lng": -118.2437
  }
  ```
  
  **Response:**
  ```json
  {
    "score": 67.45,
    "details": {
      "renewablePotential": 1850,
      "distanceToDemand": 5.2,
      "distanceToGrid": 12.8,
      "breakdown": {
        "renewableScore": 37.0,
        "demandScore": 4.84,
        "gridScore": 2.17
      }
    },
    "location": { "lat": 34.0522, "lng": -118.2437 },
    "nearestDemandCenter": {
      "name": "Port of Los Angeles",
      "demand": 1000,
      "type": "transport"
    },
    "interpretation": {
      "level": "Good",
      "color": "#84cc16",
      "description": "Good location with favorable conditions"
    }
  }
  ```

## 🗄️ Database Models

### Plant
```javascript
{
  name: String,
  capacity: Number, // MW
  status: 'operational' | 'planned' | 'under-construction' | 'decommissioned',
  location: GeoJSON Point
}
```

### Pipeline  
```javascript
{
  name: String,
  capacity: Number, // MW equivalent
  status: String,
  path: GeoJSON LineString
}
```

### DemandCenter
```javascript
{
  name: String,
  demand: Number, // tonnes/year
  type: 'industrial' | 'transport' | 'residential' | 'mixed',
  location: GeoJSON Point
}
```

### Storage
```javascript
{
  name: String,
  capacity: Number, // tonnes
  type: 'underground' | 'above-ground' | 'compressed' | 'liquid',
  status: String,
  location: GeoJSON Point
}
```

## 🧮 Suitability Scoring Algorithm

The scoring algorithm uses the following formula:

```
score = (renewablePotential/2000 * 40) 
      + (1 / (distanceToDemand + 1) * 30)
      + (1 / (distanceToGrid + 1) * 30)
```

**Components:**
- **Renewable Potential** (40%): Solar/wind energy potential (1500-2000 kWh/m²/year)
- **Distance to Demand** (30%): Proximity to hydrogen demand centers
- **Distance to Grid** (30%): Proximity to electrical grid infrastructure

**Score Ranges:**
- 80-100: Excellent (Highly suitable)
- 60-79: Good (Favorable conditions)
- 40-59: Fair (Moderate suitability)
- 20-39: Poor (Limited suitability)  
- 0-19: Very Poor (Not recommended)

## 🛠️ Development

### Scripts
```bash
npm start          # Production server
npm run dev        # Development server with nodemon
node seedDatabase.js  # Populate database with demo data
```

### Project Structure
```
backend/
├── controllers/     # Request handlers
├── models/         # MongoDB schemas
├── routes/         # Express routes
├── utils/          # Utility functions
├── .env           # Environment variables
├── server.js      # Main application file
└── seedDatabase.js # Database seeding script
```

### Adding New Features

1. **New Model:** Add to `models/` directory with GeoJSON fields
2. **New Routes:** Add to `routes/` directory  
3. **New Controllers:** Add business logic to `controllers/`
4. **Register Routes:** Import and use in `server.js`

### Environment Variables
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/h2-optimize
CLIENT_URL=http://localhost:3000
```

## 🔍 Testing the API

### Using curl:
```bash
# Get all plants
curl http://localhost:5000/api/assets/plants

# Calculate suitability
curl -X POST http://localhost:5000/api/suitability \
  -H "Content-Type: application/json" \
  -d '{"lat": 34.0522, "lng": -118.2437}'

# Health check
curl http://localhost:5000/health
```

### Using a REST client:
Import the following requests into Postman or similar:

**GET Plants:**
- URL: `http://localhost:5000/api/assets/plants`
- Method: GET

**Calculate Suitability:**
- URL: `http://localhost:5000/api/suitability`  
- Method: POST
- Body: `{"lat": 34.0522, "lng": -118.2437}`

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set appropriate CORS origins

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 🤝 Contributing

This is a hackathon prototype focused on rapid development and demo functionality. For production use, consider adding:

- Input validation & sanitization
- Rate limiting
- Authentication & authorization  
- Comprehensive error handling
- API documentation (OpenAPI/Swagger)
- Unit & integration tests
- Real renewable energy data integration
- Performance optimization

## 📝 License

MIT License - see LICENSE file for details.
