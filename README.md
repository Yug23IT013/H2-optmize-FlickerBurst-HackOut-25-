
# H2 Optimize

**Green Hydrogen Infrastructure Mapping and Optimization Platform**

H2 Optimize is a MERN-stack web application designed to help planners, energy companies, and policymakers make data-driven decisions about where to place new hydrogen infrastructure (plants, storage, pipelines, demand centers). It combines interactive mapping, geospatial analytics, and a suitability scoring engine to recommend optimal sites for green hydrogen assets.

---

## 🌟 Motivation
Accelerating the green hydrogen economy requires smart, data-driven infrastructure planning. H2 Optimize empowers stakeholders to visualize, analyze, and optimize hydrogen asset placement for maximum impact and efficiency.

---

## 🚀 Quick Start

### Backend Setup ([details](./backend/README.md))
```bash
cd backend
npm install
node seedDatabase.js  # Load demo data
npm run dev           # Start backend (port 5000)
```

### Frontend Setup ([details](./frontend/README.md))
```bash
cd frontend
npm install
npm start             # Start frontend (port 3000)
```

Visit [http://localhost:3000](http://localhost:3000) to use the app!

---

## 🗺️ Core Features

- **Interactive Map (React + Leaflet):**
  - Visualize existing and planned assets (plants, pipelines, storage, demand centers)
  - Toggle layers on/off
  - Click any location to analyze site suitability

- **Backend API (Node + Express + MongoDB):**
  - Assets stored as GeoJSON with 2dsphere indexes for spatial queries
  - Example routes:
    - `GET /api/assets/plants`
    - `GET /api/assets/pipelines`
    - `GET /api/assets/demand-centers`
    - `GET /api/assets/storage`
    - `POST /api/suitability { lat, lng }`
  - Suitability logic considers renewable potential, proximity to demand, and grid access

- **Dashboard & Analytics:**
  - Visualize infrastructure distribution and suitability scores
  - Real-time analysis and comparison across sites

---

## 🏗️ Project Structure
```
backend/    # Node.js + Express API
  controllers/   # Request handlers
  models/        # MongoDB schemas
  routes/        # API routes
  utils/         # Scoring algorithms
  server.js      # Main server file
frontend/   # React application
  src/
    components/  # React components
    services/    # API integration
    App.js       # Main app component
  public/        # Static assets
README.md   # Project overview (this file)
```

---

## 🎯 Demo Workflow
1. **Load App:** View global map with infrastructure layers (demo data focused on Gujarat, India)
2. **Toggle Layers:** Show/hide plants, pipelines, storage, demand centers
3. **Analyze Sites:** Click "Analyze Site Suitability" and select any map location globally
4. **View Results:** See suitability score (0-100) with detailed breakdown
5. **Dashboard:** Charts show infrastructure distribution and analysis

---

## 🧮 Suitability Algorithm
```js
score = (renewablePotential/2000 * 40) 
      + (1 / (distanceToDemand + 1) * 30)
      + (1 / (distanceToGrid + 1) * 30)
```
**Scoring Factors:**
- **Renewable Potential (40%)**: Solar/wind availability (1500-2000 kWh/m²/year)
- **Distance to Demand (30%)**: Proximity to hydrogen consumers
- **Distance to Grid (30%)**: Electrical grid infrastructure access

---

## 📊 Key Features

### Interactive Map
- Global world view with OpenStreetMap tiles (demo data in Gujarat, India region)
- Custom markers for different asset types
- Real-time layer toggling
- Click-to-analyze functionality anywhere on the map
- Responsive popups with detailed information
- Single world view prevents tile duplication

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

---

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

---

## 📂 More Info
- [Backend README](./backend/README.md) — API details, endpoints, and environment setup
- [Frontend README](./frontend/README.md) — React app structure and usage

---

## 🤝 Contributing
Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is for hackathon/demo purposes. For other use, please contact the authors.

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
