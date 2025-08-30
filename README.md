# Project: H2 Optimize

## Overview
H2 Optimize is a hackathon prototype for **Green Hydrogen Infrastructure Mapping and Optimization**.
It is a **MERN-stack web app** that helps planners, energy companies, and policymakers 
decide where to place new hydrogen infrastructure (plants, storage, pipelines, demand centers).  
It uses **maps + data layers + a suitability scoring engine** to recommend the best sites.

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
node seedDatabase.js  # Load demo data
npm run dev          # Start on port 5000
```

### Frontend Setup  
```bash
cd frontend
npm install
npm start           # Start on port 3000
```

Visit `http://localhost:3000` to see the app!

## Core Features
- **Interactive Map (React + Leaflet)**:
  - Show existing/planned assets (plants, pipelines, storage, demand centers).
  - Toggle layers on/off.
  - Click on map → see a "Suitability Score".

- **Backend API (Node + Express + MongoDB)**:
  - MongoDB stores assets as **GeoJSON** (with 2dsphere indexes for spatial queries).
  - Routes:
    - GET /api/assets/plants
    - GET /api/assets/pipelines
    - GET /api/assets/demand-centers
    - GET /api/assets/storage
    - POST /api/suitability { lat, lng }
  - Suitability logic:
    - Higher renewable potential = higher score.
    - Closer to demand centers = higher score.
    - Closer to grid = higher score.
    - Return JSON: `{ score, details: { renewablePotential, distanceToDemand, distanceToGrid } }`.

- **Dashboard (React + Charts)**:
  - Visualize infrastructure distribution.
  - Compare suitability scores across sites.
  - Real-time suitability analysis results.

## Tech Stack
- **Frontend:** React 18, Leaflet.js, Recharts, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (GeoJSON + 2dsphere geospatial indexes)
- **Styling:** TailwindCSS with custom hydrogen/energy color scheme
- **Icons:** Heroicons, custom map markers
- **Animations:** Framer Motion for smooth transitions

## Project Structure
```
Project 1/
├── backend/              # Node.js + Express API
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Scoring algorithms
│   └── server.js        # Main server file
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API integration
│   │   └── App.js       # Main app component
│   └── public/          # Static assets
└── README.md            # This file
```

## 🎯 Demo Workflow

1. **Load App:** View Gujarat map with infrastructure layers
2. **Toggle Layers:** Show/hide plants, pipelines, storage, demand centers
3. **Analyze Sites:** Click "Analyze Site Suitability" → click anywhere on map
4. **View Results:** See suitability score (0-100) with detailed breakdown
5. **Dashboard:** Charts show infrastructure distribution and analysis

## 🧮 Suitability Algorithm

```javascript
score = (renewablePotential/2000 * 40) 
      + (1 / (distanceToDemand + 1) * 30)
      + (1 / (distanceToGrid + 1) * 30)
```

**Scoring Factors:**
- **Renewable Potential (40%):** Solar/wind availability (1500-2000 kWh/m²/year)
- **Distance to Demand (30%):** Proximity to hydrogen consumers
- **Distance to Grid (30%):** Electrical grid infrastructure access

## 📊 Key Features

### Interactive Map
- Gujarat-centered view with OpenStreetMap tiles
- Custom markers for different asset types
- Real-time layer toggling
- Click-to-analyze functionality
- Responsive popups with detailed information

### Smart Analytics
- Live suitability scoring
- Color-coded results (Excellent → Very Poor)
- Infrastructure distribution charts
- Renewable potential zone analysis
- Asset counting and metrics

### Modern UI/UX
- Glass-morphism design with backdrop blur
- Smooth Framer Motion animations
- Mobile-responsive layout
- Professional color scheme
- Intuitive three-panel layout

## 🛠️ Development

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Modern web browser

### Environment Setup
**Backend (.env):**
```bash
MONGODB_URI=mongodb://localhost:27017/h2-optimize
PORT=5000
CLIENT_URL=http://localhost:3000
```


- ✅ **MERN stack implementation**
- ✅ **Geospatial functionality**
