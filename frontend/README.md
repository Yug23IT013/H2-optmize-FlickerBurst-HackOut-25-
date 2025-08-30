# H2 Optimize Frontend

React frontend for the Green Hydrogen Infrastructure Mapping and Optimization platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── MapView.js         # Interactive Leaflet map
│   ├── Sidebar.js         # Layer controls & filters
│   ├── Dashboard.js       # Analytics & charts
│   └── PopupInfo.js       # Suitability popup details
├── services/
│   └── api.js             # Backend API integration
├── App.js                 # Main application component
├── index.js               # React entry point
└── index.css              # TailwindCSS & custom styles
```

## 🗺️ Features

### Interactive Map (MapView)
- **Base Map:** OpenStreetMap tiles centered on Gujarat, India
- **Asset Layers:** Plants, pipelines, storage facilities, demand centers
- **Custom Icons:** Color-coded markers for different asset types
- **Click Analysis:** Click anywhere to get suitability scores
- **Responsive Popups:** Detailed asset information and analysis results

### Control Sidebar
- **Layer Toggles:** Show/hide different infrastructure types
- **Suitability Mode:** Enable/disable site analysis
- **Asset Counters:** Real-time counts of visible assets
- **Legend:** Color coding reference

### Analytics Dashboard
- **Suitability Scores:** Large, color-coded score display
- **Score Breakdown:** Detailed analysis of scoring factors
- **Asset Charts:** Bar chart of infrastructure distribution
- **Renewable Zones:** Pie chart of potential distribution
- **Key Metrics:** Total assets and location info

## 🎨 Design System

### Colors
- **Primary (Hydrogen):** `#22c55e` (Green)
- **Secondary (Energy):** `#f59e0b` (Amber) 
- **Accent Colors:** Blue, Purple for different asset types
- **Background:** Gradient from hydrogen-50 to energy-50

### Components
- **Glass Panels:** Semi-transparent backgrounds with blur effects
- **Smooth Animations:** Framer Motion for transitions
- **Responsive Design:** Mobile-first approach with TailwindCSS
- **Custom Icons:** Heroicons with asset-specific markers

## 🔗 API Integration

### Asset Loading
```javascript
// Load all infrastructure data
const assets = await assetsAPI.getAllAssets();
```

### Suitability Analysis
```javascript
// Analyze site suitability
const result = await suitabilityAPI.calculateSuitability(lat, lng);
```

### Data Flow
1. App loads → Fetch all assets from backend
2. User clicks map → Send coordinates to suitability API
3. Backend responds → Update dashboard with results
4. Layer toggles → Show/hide asset types on map

## 🛠️ Development

### Available Scripts
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Key Dependencies
- **React 18:** Modern React with concurrent features
- **React-Leaflet:** Map integration
- **Leaflet:** Core mapping library
- **Recharts:** Chart components
- **Framer Motion:** Smooth animations
- **Heroicons:** Beautiful icon set
- **TailwindCSS:** Utility-first styling
- **Axios:** HTTP client for API calls

### Environment Configuration
Create `.env` file for custom API URL:
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 📱 User Experience

### Desktop Flow
1. **Landing:** Full dashboard with sidebar, map, and analytics
2. **Layer Control:** Toggle infrastructure types from sidebar
3. **Site Analysis:** Click "Analyze Site Suitability" → Click map
4. **Results:** View score in popup and detailed breakdown in dashboard

### Mobile Responsive
- Sidebar collapses to overlay on mobile
- Map takes full screen width
- Dashboard stacks vertically
- Touch-friendly controls

### Performance
- Lazy loading for large datasets
- Optimized re-renders with React.memo
- Efficient geospatial queries
- Smooth 60fps animations

## 🎯 Hackathon Features

### Demo-Ready
- **Mock Data Integration:** Works with seeded backend data
- **Visual Appeal:** Professional UI with smooth animations
- **Interactive Demo:** Click-to-analyze workflow
- **Real-time Updates:** Dynamic charts and counters

### Extensible
- **Modular Components:** Easy to add new features
- **API Service Layer:** Clean separation of concerns
- **Theme System:** Customizable colors and styling
- **Component Library:** Reusable UI components

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify:** Drag & drop `build/` folder
- **Vercel:** Connect GitHub repository
- **AWS S3:** Static website hosting
- **Docker:** Containerized deployment

### Environment Variables
```bash
REACT_APP_API_URL=https://your-backend-api.com
```

## 🐛 Troubleshooting

### Common Issues

**Map not loading:**
- Check Leaflet CSS imports in `index.css`
- Verify map container has height set

**API connection failed:**
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify proxy setting in `package.json`

**Icons not showing:**
- Check Leaflet icon configuration in `MapView.js`
- Verify marker icon URLs are accessible

## 📋 TODO / Future Enhancements

- [ ] Add authentication with JWT
- [ ] Implement real-time updates with WebSockets
- [ ] Add data export functionality
- [ ] Integrate with real renewable energy APIs
- [ ] Add drawing tools for custom areas
- [ ] Implement advanced filtering options
- [ ] Add multi-language support
- [ ] PWA features for offline use

## 🤝 Contributing

This is a hackathon prototype. For production use, consider:

- Add comprehensive testing (Jest, React Testing Library)
- Implement error boundaries
- Add accessibility features (ARIA labels, keyboard navigation)
- Performance optimization (virtualization for large datasets)
- SEO optimization
- Security hardening

## 📄 License

MIT License - Built for sustainable energy planning.
