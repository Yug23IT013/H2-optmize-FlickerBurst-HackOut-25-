import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChartBarIcon, 
  StarIcon,
  BoltIcon,
  MapPinIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

/**
 * Dashboard Component - Charts and suitability score display
 * Shows asset distribution, suitability analysis, and key metrics
 */

const Dashboard = ({ 
  assetCounts, 
  suitabilityResult,
  areaAnalysisResult,
  className = "" 
}) => {

  // Prepare data for asset distribution chart
  const assetChartData = [
    { 
      name: 'Plants', 
      value: assetCounts.plants || 0, 
      color: '#22c55e' 
    },
    { 
      name: 'Storage', 
      value: assetCounts.storage || 0, 
      color: '#3b82f6' 
    },
    { 
      name: 'Demand', 
      value: assetCounts.demandCenters || 0, 
      color: '#8b5cf6' 
    },
    { 
      name: 'Pipelines', 
      value: assetCounts.pipelines || 0, 
      color: '#f59e0b' 
    }
  ];

  // Sample renewable potential data
  const renewablePotentialData = [
    { name: 'Excellent (1800-2000)', value: 25, color: '#22c55e' },
    { name: 'Good (1600-1799)', value: 35, color: '#84cc16' },
    { name: 'Fair (1400-1599)', value: 30, color: '#eab308' },
    { name: 'Poor (1200-1399)', value: 10, color: '#f97316' }
  ];

  const ScoreCard = ({ title, value, unit, icon: Icon, color, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-lg p-4 border border-gray-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </motion.div>
  );

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="pb-4 border-b border-gray-200 flex-shrink-0 px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ChartBarIcon className="w-7 h-7 text-hydrogen-600 mr-2" />
          Analytics
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Infrastructure insights & site analysis
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        
        {/* Suitability Score Section */}
        {suitabilityResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-hydrogen-50 to-energy-50 rounded-lg p-6 border border-hydrogen-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <StarIcon className="w-5 h-5 text-energy-500 mr-2" />
              Site Suitability Analysis
            </h3>
            
            {/* Score Display */}
            <div className="text-center mb-4">
              <div className="score-display mb-2">
                {suitabilityResult.score?.toFixed(1)}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}
                   style={{ 
                     backgroundColor: suitabilityResult.interpretation?.color + '20',
                     color: suitabilityResult.interpretation?.color 
                   }}>
                <div className="w-2 h-2 rounded-full mr-2" 
                     style={{ backgroundColor: suitabilityResult.interpretation?.color }}></div>
                {suitabilityResult.interpretation?.level}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {suitabilityResult.interpretation?.description}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 gap-3">
              <ScoreCard
                title="Renewable Potential"
                value={suitabilityResult.details?.renewablePotential}
                unit="kWh/m²/year"
                icon={BoltIcon}
                color="text-energy-600"
                bgColor="bg-energy-50"
              />
              <ScoreCard
                title="Distance to Demand"
                value={suitabilityResult.details?.distanceToDemand?.toFixed(1)}
                unit="km"
                icon={MapPinIcon}
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
              <ScoreCard
                title="Distance to Grid"
                value={suitabilityResult.details?.distanceToGrid?.toFixed(1)}
                unit="km"
                icon={SignalIcon}
                color="text-purple-600"
                bgColor="bg-purple-50"
              />
            </div>

            {/* Location Info */}
            {suitabilityResult.location && (
              <div className="mt-4 p-3 bg-white/60 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Analyzed Location:</span><br />
                  {suitabilityResult.location.lat.toFixed(4)}°N, {suitabilityResult.location.lng.toFixed(4)}°E
                </p>
                {suitabilityResult.nearestDemandCenter && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Nearest Demand:</span> {suitabilityResult.nearestDemandCenter.name}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
            <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Site Selected</h3>
            <p className="text-sm text-gray-500">
              Enable analysis mode and click on the map to evaluate site suitability
            </p>
          </div>
        )}

        {/* Area Analysis Section */}
        {areaAnalysisResult && !areaAnalysisResult.error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Area Analysis Results
            </h3>
            
            {/* Best Site Summary */}
            {areaAnalysisResult.bestSite && (
              <div className="mb-4 p-4 bg-white/60 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                  Best Site Found
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Score:</span> 
                    <span className="ml-2 font-bold" style={{ color: areaAnalysisResult.bestSite.interpretation?.color }}>
                      {areaAnalysisResult.bestSite.score.toFixed(1)} ({areaAnalysisResult.bestSite.interpretation?.level})
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> 
                    <span className="ml-2">
                      {areaAnalysisResult.bestSite.location.lat.toFixed(4)}, {areaAnalysisResult.bestSite.location.lng.toFixed(4)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Area Statistics */}
            {areaAnalysisResult.areaStats && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <ScoreCard
                  title="Sites Analyzed"
                  value={areaAnalysisResult.areaStats.sitesAnalyzed}
                  icon={MapPinIcon}
                  color="text-indigo-600"
                  bgColor="bg-indigo-50"
                />
                <ScoreCard
                  title="Average Score"
                  value={areaAnalysisResult.areaStats.avgScore?.toFixed(1)}
                  icon={ChartBarIcon}
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
                <ScoreCard
                  title="Suitable Sites"
                  value={areaAnalysisResult.areaStats.suitableSites}
                  icon={BoltIcon}
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <ScoreCard
                  title="Area Size"
                  value={areaAnalysisResult.areaStats.areaSize?.toFixed(1)}
                  unit="km²"
                  icon={SignalIcon}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />
              </div>
            )}
          </motion.div>
        ) : areaAnalysisResult?.error ? (
          <div className="bg-red-50 rounded-lg p-6 border border-red-200 text-center">
            <div className="w-12 h-12 text-red-400 mx-auto mb-3">⚠️</div>
            <h3 className="text-lg font-medium text-red-700 mb-2">Analysis Error</h3>
            <p className="text-sm text-red-600">
              {areaAnalysisResult.message || 'Failed to analyze the selected area'}
            </p>
          </div>
        ) : null}

        {/* Asset Distribution Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Infrastructure Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={assetChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Renewable Potential Distribution */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Renewable Potential Zones
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={renewablePotentialData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {renewablePotentialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Area Coverage']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-3 space-y-1">
            {renewablePotentialData.map((item, index) => (
              <div key={index} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-hydrogen-50 to-hydrogen-100 rounded-lg p-4 border border-hydrogen-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-hydrogen-700">
                {Object.values(assetCounts).reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="text-sm text-hydrogen-600 font-medium">
                Total Assets
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-energy-50 to-energy-100 rounded-lg p-4 border border-energy-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-energy-700">
                23.0°N
              </div>
              <div className="text-sm text-energy-600 font-medium">
                Gujarat Center
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <p className="text-xs text-gray-500 text-center">
            Real-time analysis powered by geospatial intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
