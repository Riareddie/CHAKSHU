
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const FraudHotspotsMap = () => {
  // Mock data for fraud hotspots
  const hotspots = [
    { id: 1, area: "Downtown", incidents: 23, risk: "High", x: 30, y: 40 },
    { id: 2, area: "Sector 1", incidents: 15, risk: "Medium", x: 60, y: 30 },
    { id: 3, area: "Mall Area", incidents: 18, risk: "High", x: 45, y: 60 },
    { id: 4, area: "Residential", incidents: 8, risk: "Low", x: 75, y: 70 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
        {/* Mock map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 opacity-50"></div>
        
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-gray-300 dark:border-gray-600 opacity-30"></div>
            ))}
          </div>
        </div>

        {/* Hotspot markers */}
        {hotspots.map((spot) => (
          <div
            key={spot.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <div className={`w-4 h-4 rounded-full ${getRiskColor(spot.risk)} border-2 border-white shadow-lg animate-pulse`}></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                <p className="font-medium">{spot.area}</p>
                <p className="text-gray-600 dark:text-light-yellow">{spot.incidents} incidents</p>
                <Badge variant="outline" className="text-xs">
                  {spot.risk} Risk
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Low Risk</span>
        </div>
      </div>

      {/* Area List */}
      <div className="mt-4 space-y-2">
        {hotspots.map((spot) => (
          <div key={spot.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{spot.area}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-light-yellow">{spot.incidents} incidents</span>
              <Badge variant="outline" className={`text-xs ${
                spot.risk === 'High' ? 'border-red-500 text-red-600' :
                spot.risk === 'Medium' ? 'border-yellow-500 text-yellow-600' :
                'border-green-500 text-green-600'
              }`}>
                {spot.risk}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudHotspotsMap;
