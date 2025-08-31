
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
  - **NEW: Regulatory zones layer** with color-coded policy boundaries
  - Toggle layers on/off with enhanced controls
  - Click any location to analyze site suitability with regulatory factors
  - Real-time policy-aware recommendations

- **Backend API (Node + Express + MongoDB):**
  - Assets stored as GeoJSON with 2dsphere indexes for spatial queries
  - **Enhanced API routes:**
    - `GET /api/assets/plants`
    - `GET /api/assets/pipelines`
    - `GET /api/assets/demand-centers`
    - `GET /api/assets/storage`
    - **`GET /api/assets/regulatory-zones`** *(NEW)*
    - `POST /api/suitability { lat, lng }` *(Enhanced with regulatory analysis)*
    - **`GET /api/regulatory/zones`** *(NEW)*
    - **`POST /api/regulatory/zones/containing-point`** *(NEW)*
    - **`GET /api/regulatory/stats`** *(NEW)*
  - **4-Factor Suitability Algorithm** considers renewable potential, demand proximity, grid access, and **regulatory environment**

- **Policy-Aware Analytics:**
  - Visualize infrastructure distribution and suitability scores
  - **Regulatory environment assessment** with incentives and restrictions
  - **Government policy integration** with approval timelines
  - Real-time analysis and comparison across sites

---

## 🏗️ Project Structure
```
backend/    # Node.js + Express API
  controllers/   # Request handlers
    assetController.js         # Asset management
    suitabilityController.js   # Enhanced 4-factor scoring
    regulatoryController.js    # NEW: Regulatory zone analysis
  models/        # MongoDB schemas
    Plant.js, Pipeline.js, DemandCenter.js, Storage.js
    RegulatoryZone.js         # NEW: Policy boundary model
  routes/        # API routes
    assets.js                 # Enhanced with regulatory zones
    suitability.js           # Updated with regulatory factors
    regulatory.js            # NEW: Regulatory zone endpoints
  utils/         # Scoring algorithms
    scoring.js               # Enhanced 4-factor algorithm
  server.js      # Main server file
frontend/   # React application
  src/
    components/  # React components
      MapView.js             # Enhanced with regulatory layer
      Sidebar.js            # Updated with regulatory controls
      PopupInfo.js          # Enhanced with policy information
    services/    # API integration
      api.js                # Added regulatory API methods
    App.js       # Main app component
  public/        # Static assets
README.md   # Project overview (this file)
```

---

## 🎯 Demo Workflow
1. **Load App:** View global map with infrastructure layers (demo data focused on Gujarat, India)
2. **Toggle Layers:** Show/hide plants, pipelines, storage, demand centers, **and regulatory zones**
3. **Analyze Sites:** Click "Analyze Site Suitability" and select any map location globally
4. **View Results:** See enhanced suitability score (0-100) with **4-factor breakdown** including regulatory analysis
5. **Policy Insights:** Review government incentives, restrictions, and approval timelines
6. **Dashboard:** Charts show infrastructure distribution, regulatory statistics, and analysis

---

## 🧮 Enhanced Suitability Algorithm
```js
// NEW 4-Factor Algorithm (was 3-factor)
score = (renewablePotential/2000 * 30)     // Reduced from 40%
      + (1 / (distanceToDemand + 1) * 25)  // Reduced from 30%
      + (1 / (distanceToGrid + 1) * 25)    // Reduced from 30%
      + (regulatoryScore/100 * 20)         // NEW: Regulatory factor
```
**Enhanced Scoring Factors:**
- **Renewable Potential (30%)**: Solar/wind availability (1500-2000 kWh/m²/year)
- **Distance to Demand (25%)**: Proximity to hydrogen consumers
- **Distance to Grid (25%)**: Electrical grid infrastructure access
- **🆕 Regulatory Environment (20%)**: Government policies, incentives, and approval processes

### Regulatory Scoring Includes:
- **Government Incentives**: Hydrogen development support programs
- **Subsidies**: Percentage-based financial incentives (0-30%)
- **Approval Processes**: Fast-track vs. standard timelines (90-365 days)
- **Policy Support**: Land acquisition and infrastructure assistance
- **Environmental Restrictions**: Limitations and seasonal constraints
- **Zone Types**: Priority zones, industrial areas, environmental sensitive regions

---

## 📊 Key Features

### Interactive Map
- Global world view with OpenStreetMap tiles (demo data in Gujarat, India region)
- Custom markers for different asset types
- **🆕 Regulatory zones layer** with color-coded policy boundaries
- Real-time layer toggling with enhanced controls
- Click-to-analyze functionality anywhere on the map
- **Enhanced popups** with regulatory information and policy details
- Single world view prevents tile duplication

### Smart Analytics
- **4-factor suitability scoring** with regulatory analysis
- Color-coded results (Excellent → Very Poor)
- **Policy-aware recommendations** with government incentives
- Infrastructure distribution charts
- **Regulatory environment assessment** with approval timelines
- Renewable potential zone analysis
- Asset counting and regulatory zone metrics

### Policy Integration
- **🆕 6 Comprehensive regulatory zones** covering major Indian regions:
  - Gujarat Green Hydrogen Policy Zone (High incentives)
  - Kandla Port Authority Zone (Port-specific policies)
  - Delhi NCR Industrial Corridor (Urban restrictions)
  - Maharashtra Renewable Energy Zone (State incentives)
  - Rajasthan Solar Park Zone (Maximum solar support)
  - Western Ghats Environmental Zone (Protected restrictions)
- **Government contact information** for regulatory authorities
- **Incentive tracking** with subsidy percentages and support programs
- **Risk assessment** with approval timeline estimates

### Modern UI/UX
- Glass-morphism design with backdrop blur
- Smooth Framer Motion animations
- Mobile-responsive layout
- Professional color scheme
- **Enhanced three-panel layout** with regulatory insights

---

## 🆕 New: Regulatory Zone Integration

**Policy-Aware Infrastructure Planning**

H2 Optimize now includes comprehensive regulatory zone integration, making it the first hydrogen infrastructure platform to combine technical suitability with real-world policy factors.

### Key Regulatory Features:
- **🏛️ Government Policy Integration**: Real government incentives, subsidies, and approval processes
- **🗺️ Interactive Regulatory Zones**: Visual policy boundaries with color-coded favorability
- **📋 Compliance Assessment**: Environmental restrictions and seasonal limitations
- **⚡ Fast-Track Identification**: Zones with expedited approval processes
- **💰 Incentive Tracking**: Subsidy percentages and financial support programs
- **📞 Authority Contacts**: Direct contact information for regulatory bodies

### Regulatory Zone Types:
| Zone Type | Example | Key Benefits |
|-----------|---------|-------------|
| 🎯 Hydrogen Priority Zones | Gujarat Green H2 Zone | 25% subsidy, fast-track approval |
| 🌊 Port Authority Zones | Kandla Port Zone | Infrastructure support, logistics advantages |
| 🏭 Industrial Corridors | Delhi NCR Corridor | Existing infrastructure, demand proximity |
| ⚡ Renewable Energy Zones | Rajasthan Solar Zone | 30% renewable subsidies, land support |
| 🌲 Environmental Sensitive | Western Ghats ESZ | Protected areas, strict limitations |

### Enhanced Decision Making:
- **Risk Assessment**: Understand approval complexity and timelines
- **Investment Optimization**: Identify locations with maximum government support  
- **Compliance Planning**: Early awareness of environmental and operational restrictions
- **Stakeholder Engagement**: Connect directly with relevant regulatory authorities

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
- [Regulatory Zones README](./REGULATORY_ZONES_README.md) — Detailed regulatory integration documentation

---

## � Recent Updates

### v2.0 - Regulatory Zone Integration (August 2025)
- ✅ **4-Factor Suitability Algorithm** with regulatory environment assessment
- ✅ **Interactive Regulatory Zones Layer** with policy boundary visualization
- ✅ **Government Policy Database** with real incentives and restrictions
- ✅ **Enhanced API Endpoints** for regulatory zone queries and analysis
- ✅ **Policy-Aware Recommendations** with approval timelines and contact info
- ✅ **Comprehensive Demo Data** covering 6 major regulatory environments

### v1.0 - Core Platform (Initial Release)
- ✅ **Interactive Hydrogen Asset Mapping** with plants, pipelines, storage, demand centers
- ✅ **3-Factor Suitability Scoring** based on renewable potential, demand, and grid access
- ✅ **Real-time Analysis** with click-to-analyze functionality
- ✅ **Modern React Frontend** with Leaflet mapping and smooth animations
- ✅ **Robust Node.js Backend** with MongoDB and GeoJSON support

---

## 🤝 Contributing
Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you would like to change.

**Priority Areas for Contribution:**
- Real-time data integration (weather APIs, government databases)
- Advanced optimization algorithms (route planning, cost modeling)
- Additional regulatory jurisdictions and policy updates
- Mobile app development
- Machine learning for demand forecasting

---

## 📄 License
This project is for hackathon/demo purposes. For commercial use or collaboration opportunities, please contact the development team.

---

**🎯 H2 Optimize - Powering the Green Hydrogen Revolution with Smart, Policy-Aware Infrastructure Planning**
