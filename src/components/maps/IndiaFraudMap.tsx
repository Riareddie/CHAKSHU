import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, RotateCcw, Info, AlertTriangle, Eye } from "lucide-react";

interface FraudIncident {
  id: string;
  state: string;
  city: string;
  lat: number;
  lng: number;
  count: number;
  fraudType: string;
  severity: "low" | "medium" | "high" | "critical";
  recentIncidents: number;
}

interface MapFilters {
  fraudType: string;
  severity: string;
}

// Sample data for Indian cities with fraud incidents
const mockFraudData: FraudIncident[] = [
  {
    id: "1",
    state: "Maharashtra",
    city: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    count: 1250,
    fraudType: "UPI Fraud",
    severity: "critical",
    recentIncidents: 45,
  },
  {
    id: "2",
    state: "Maharashtra",
    city: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    count: 890,
    fraudType: "Phone Calls",
    severity: "high",
    recentIncidents: 32,
  },
  {
    id: "3",
    state: "Delhi",
    city: "New Delhi",
    lat: 28.6139,
    lng: 77.209,
    count: 1180,
    fraudType: "SMS Fraud",
    severity: "critical",
    recentIncidents: 38,
  },
  {
    id: "4",
    state: "Karnataka",
    city: "Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    count: 1020,
    fraudType: "Email Spam",
    severity: "high",
    recentIncidents: 35,
  },
  {
    id: "5",
    state: "Tamil Nadu",
    city: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    count: 780,
    fraudType: "WhatsApp Fraud",
    severity: "high",
    recentIncidents: 28,
  },
  {
    id: "6",
    state: "West Bengal",
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    count: 650,
    fraudType: "Banking Fraud",
    severity: "medium",
    recentIncidents: 22,
  },
  {
    id: "7",
    state: "Rajasthan",
    city: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    count: 420,
    fraudType: "Investment Scam",
    severity: "medium",
    recentIncidents: 15,
  },
  {
    id: "8",
    state: "Gujarat",
    city: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    count: 380,
    fraudType: "Job Fraud",
    severity: "medium",
    recentIncidents: 12,
  },
  {
    id: "9",
    state: "Uttar Pradesh",
    city: "Lucknow",
    lat: 26.8467,
    lng: 80.9462,
    count: 520,
    fraudType: "Lottery Scam",
    severity: "medium",
    recentIncidents: 18,
  },
  {
    id: "10",
    state: "Punjab",
    city: "Chandigarh",
    lat: 30.7333,
    lng: 76.7794,
    count: 310,
    fraudType: "Social Media",
    severity: "medium",
    recentIncidents: 11,
  },
  {
    id: "11",
    state: "Haryana",
    city: "Gurgaon",
    lat: 28.4595,
    lng: 77.0266,
    count: 460,
    fraudType: "Crypto Fraud",
    severity: "high",
    recentIncidents: 16,
  },
  {
    id: "12",
    state: "Kerala",
    city: "Kochi",
    lat: 9.9312,
    lng: 76.2673,
    count: 340,
    fraudType: "Romance Scam",
    severity: "medium",
    recentIncidents: 13,
  },
  {
    id: "13",
    state: "Telangana",
    city: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    count: 720,
    fraudType: "Investment Scam",
    severity: "high",
    recentIncidents: 25,
  },
  {
    id: "14",
    state: "Odisha",
    city: "Bhubaneswar",
    lat: 20.2961,
    lng: 85.8245,
    count: 180,
    fraudType: "Phone Calls",
    severity: "low",
    recentIncidents: 6,
  },
  {
    id: "15",
    state: "Jharkhand",
    city: "Ranchi",
    lat: 23.3441,
    lng: 85.3096,
    count: 150,
    fraudType: "SMS Fraud",
    severity: "low",
    recentIncidents: 5,
  },
  {
    id: "16",
    state: "Chhattisgarh",
    city: "Raipur",
    lat: 21.2514,
    lng: 81.6296,
    count: 120,
    fraudType: "Email Spam",
    severity: "low",
    recentIncidents: 4,
  },
  {
    id: "17",
    state: "Assam",
    city: "Guwahati",
    lat: 26.1445,
    lng: 91.7362,
    count: 200,
    fraudType: "UPI Fraud",
    severity: "low",
    recentIncidents: 7,
  },
  {
    id: "18",
    state: "Madhya Pradesh",
    city: "Bhopal",
    lat: 23.2599,
    lng: 77.4126,
    count: 280,
    fraudType: "Banking Fraud",
    severity: "medium",
    recentIncidents: 9,
  },
  {
    id: "19",
    state: "Andhra Pradesh",
    city: "Visakhapatnam",
    lat: 17.6868,
    lng: 83.2185,
    count: 190,
    fraudType: "Job Fraud",
    severity: "low",
    recentIncidents: 8,
  },
  {
    id: "20",
    state: "Bihar",
    city: "Patna",
    lat: 25.5941,
    lng: 85.1376,
    count: 240,
    fraudType: "Lottery Scam",
    severity: "medium",
    recentIncidents: 10,
  },
];

const IndiaFraudMap: React.FC = () => {
  const [filters, setFilters] = useState<MapFilters>({
    fraudType: "all",
    severity: "all",
  });
  const [selectedCity, setSelectedCity] = useState<FraudIncident | null>(null);

  const filteredData = useMemo(() => {
    return mockFraudData.filter((incident) => {
      if (
        filters.fraudType !== "all" &&
        !incident.fraudType
          .toLowerCase()
          .includes(filters.fraudType.toLowerCase())
      )
        return false;
      if (filters.severity !== "all" && incident.severity !== filters.severity)
        return false;
      return true;
    });
  }, [filters]);

  const getDotSize = (count: number) => {
    if (count > 1000) return "w-6 h-6"; // 24px
    if (count > 500) return "w-5 h-5"; // 20px
    if (count > 200) return "w-4 h-4"; // 16px
    return "w-3 h-3"; // 12px
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Very High Risk";
      case "high":
        return "High Risk";
      case "medium":
        return "Medium Risk";
      case "low":
        return "Low Risk";
      default:
        return "Unknown";
    }
  };

  // Convert lat/lng to map position (simplified for India)
  const getMapPosition = (lat: number, lng: number) => {
    // India bounds roughly: lat 6-37, lng 68-97
    const x = ((lng - 68) / (97 - 68)) * 100;
    const y = ((37 - lat) / (37 - 6)) * 100;
    return {
      left: Math.max(5, Math.min(95, x)),
      top: Math.max(5, Math.min(95, y)),
    };
  };

  const resetFilters = () => {
    setFilters({ fraudType: "all", severity: "all" });
    setSelectedCity(null);
  };

  const totalIncidents = filteredData.reduce(
    (sum, incident) => sum + incident.count,
    0,
  );
  const highRiskCities = filteredData.filter(
    (incident) =>
      incident.severity === "critical" || incident.severity === "high",
  ).length;

  // Proper Indian Political Map SVG
  const IndiaPoliticalMapSVG = `
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="indiaMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e0f2fe;stop-opacity:1" />
        </linearGradient>
        <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" stroke-width="1" opacity="0.3"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.2"/>

      <!-- Main India Border -->
      <path d="M 200 150
               L 230 120 L 280 110 L 350 105 L 420 110 L 480 115 L 550 120 L 620 125 L 680 140 L 730 160 L 770 190 L 800 230 L 820 280 L 830 340 L 825 400 L 810 460 L 790 520 L 765 580 L 730 640 L 690 700 L 640 750 L 580 790 L 520 820 L 460 840 L 400 850 L 340 845 L 280 835 L 220 815 L 170 780 L 130 740 L 100 690 L 85 630 L 80 570 L 85 510 L 95 450 L 110 390 L 130 330 L 155 270 L 175 210 Z"
            fill="url(#indiaMapGrad)"
            stroke="#1e40af"
            stroke-width="3"
            opacity="0.8"/>

      <!-- Kashmir Region -->
      <path d="M 200 150 L 280 110 L 350 105 L 380 130 L 360 180 L 320 200 L 280 190 L 240 170 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            stroke-width="2"
            opacity="0.6"/>

      <!-- Rajasthan -->
      <path d="M 130 330 L 220 315 L 280 330 L 320 380 L 300 450 L 250 480 L 180 470 L 140 420 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            stroke-width="2"
            opacity="0.6"/>
      <text x="225" y="400" text-anchor="middle" font-family="Arial" font-size="14" fill="#92400e" font-weight="bold">RAJASTHAN</text>

      <!-- Gujarat -->
      <path d="M 140 420 L 180 470 L 170 520 L 140 550 L 110 580 L 100 540 L 105 480 Z"
            fill="#dcfce7"
            stroke="#16a34a"
            stroke-width="2"
            opacity="0.6"/>
      <text x="135" y="520" text-anchor="middle" font-family="Arial" font-size="12" fill="#166534" font-weight="bold">GUJARAT</text>

      <!-- Maharashtra -->
      <path d="M 180 470 L 250 480 L 320 490 L 350 540 L 320 600 L 270 620 L 220 610 L 170 580 L 170 520 Z"
            fill="#fef2f2"
            stroke="#dc2626"
            stroke-width="2"
            opacity="0.6"/>
      <text x="260" y="560" text-anchor="middle" font-family="Arial" font-size="14" fill="#991b1b" font-weight="bold">MAHARASHTRA</text>

      <!-- Karnataka -->
      <path d="M 220 610 L 270 620 L 320 640 L 340 700 L 300 740 L 250 730 L 200 710 L 190 660 Z"
            fill="#f3e8ff"
            stroke="#9333ea"
            stroke-width="2"
            opacity="0.6"/>
      <text x="265" y="690" text-anchor="middle" font-family="Arial" font-size="14" fill="#7c3aed" font-weight="bold">KARNATAKA</text>

      <!-- Tamil Nadu -->
      <path d="M 300 740 L 340 700 L 380 720 L 400 760 L 390 800 L 350 820 L 310 810 L 290 780 Z"
            fill="#ecfdf5"
            stroke="#059669"
            stroke-width="2"
            opacity="0.6"/>
      <text x="345" y="770" text-anchor="middle" font-family="Arial" font-size="14" fill="#047857" font-weight="bold">TAMIL NADU</text>

      <!-- Kerala -->
      <path d="M 250 730 L 300 740 L 290 780 L 280 820 L 250 830 L 220 820 L 210 780 L 220 740 Z"
            fill="#f0fdf4"
            stroke="#16a34a"
            stroke-width="2"
            opacity="0.6"/>
      <text x="255" y="790" text-anchor="middle" font-family="Arial" font-size="12" fill="#166534" font-weight="bold">KERALA</text>

      <!-- Andhra Pradesh -->
      <path d="M 320 600 L 380 610 L 420 650 L 400 700 L 380 720 L 340 700 L 320 640 Z"
            fill="#fef7cd"
            stroke="#eab308"
            stroke-width="2"
            opacity="0.6"/>
      <text x="370" y="660" text-anchor="middle" font-family="Arial" font-size="12" fill="#a16207" font-weight="bold">ANDHRA PRADESH</text>

      <!-- Telangana -->
      <path d="M 350 540 L 400 550 L 420 590 L 400 620 L 380 610 L 360 580 Z"
            fill="#e0e7ff"
            stroke="#3b82f6"
            stroke-width="2"
            opacity="0.6"/>
      <text x="385" y="580" text-anchor="middle" font-family="Arial" font-size="12" fill="#1d4ed8" font-weight="bold">TELANGANA</text>

      <!-- Odisha -->
      <path d="M 420 550 L 480 560 L 500 600 L 480 640 L 440 650 L 420 620 L 420 580 Z"
            fill="#fdf4ff"
            stroke="#c026d3"
            stroke-width="2"
            opacity="0.6"/>
      <text x="460" y="600" text-anchor="middle" font-family="Arial" font-size="12" fill="#a21caf" font-weight="bold">ODISHA</text>

      <!-- Chhattisgarh -->
      <path d="M 380 490 L 440 500 L 460 540 L 440 580 L 400 570 L 380 530 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            stroke-width="2"
            opacity="0.6"/>
      <text x="420" y="540" text-anchor="middle" font-family="Arial" font-size="11" fill="#92400e" font-weight="bold">CHHATTISGARH</text>

      <!-- Madhya Pradesh -->
      <path d="M 250 480 L 320 490 L 380 490 L 420 500 L 440 460 L 400 420 L 340 430 L 280 440 L 240 450 Z"
            fill="#ddd6fe"
            stroke="#7c3aed"
            stroke-width="2"
            opacity="0.6"/>
      <text x="340" y="460" text-anchor="middle" font-family="Arial" font-size="14" fill="#5b21b6" font-weight="bold">MADHYA PRADESH</text>

      <!-- Uttar Pradesh -->
      <path d="M 320 380 L 420 390 L 520 400 L 560 440 L 540 480 L 480 490 L 420 480 L 360 470 L 320 450 Z"
            fill="#fecaca"
            stroke="#ef4444"
            stroke-width="2"
            opacity="0.6"/>
      <text x="440" y="440" text-anchor="middle" font-family="Arial" font-size="14" fill="#dc2626" font-weight="bold">UTTAR PRADESH</text>

      <!-- Bihar -->
      <path d="M 520 400 L 580 410 L 600 450 L 580 480 L 540 480 L 520 440 Z"
            fill="#fed7d7"
            stroke="#f56565"
            stroke-width="2"
            opacity="0.6"/>
      <text x="560" y="445" text-anchor="middle" font-family="Arial" font-size="12" fill="#c53030" font-weight="bold">BIHAR</text>

      <!-- Jharkhand -->
      <path d="M 540 480 L 580 480 L 600 520 L 580 560 L 540 550 L 520 520 Z"
            fill="#c6f6d5"
            stroke="#48bb78"
            stroke-width="2"
            opacity="0.6"/>
      <text x="560" y="520" text-anchor="middle" font-family="Arial" font-size="11" fill="#2f855a" font-weight="bold">JHARKHAND</text>

      <!-- West Bengal -->
      <path d="M 600 450 L 650 460 L 670 500 L 650 540 L 620 550 L 600 520 L 600 480 Z"
            fill="#bee3f8"
            stroke="#4299e1"
            stroke-width="2"
            opacity="0.6"/>
      <text x="635" y="500" text-anchor="middle" font-family="Arial" font-size="12" fill="#2b6cb0" font-weight="bold">WEST BENGAL</text>

      <!-- Delhi -->
      <circle cx="400" cy="370" r="15" fill="#fed7d7" stroke="#e53e3e" stroke-width="2"/>
      <text x="400" y="375" text-anchor="middle" font-family="Arial" font-size="10" fill="#c53030" font-weight="bold">DELHI</text>

      <!-- Punjab -->
      <path d="M 280 330 L 340 340 L 360 380 L 320 390 L 280 380 L 260 350 Z"
            fill="#c6f6d5"
            stroke="#48bb78"
            stroke-width="2"
            opacity="0.6"/>
      <text x="310" y="360" text-anchor="middle" font-family="Arial" font-size="12" fill="#2f855a" font-weight="bold">PUNJAB</text>

      <!-- Haryana -->
      <path d="M 320 390 L 360 380 L 380 420 L 340 430 L 320 410 Z"
            fill="#fbb6ce"
            stroke="#ed64a6"
            stroke-width="2"
            opacity="0.6"/>
      <text x="350" y="405" text-anchor="middle" font-family="Arial" font-size="11" fill="#b83280" font-weight="bold">HARYANA</text>

      <!-- Assam -->
      <path d="M 670 500 L 720 510 L 740 540 L 720 570 L 690 580 L 670 550 Z"
            fill="#e6fffa"
            stroke="#38b2ac"
            stroke-width="2"
            opacity="0.6"/>
      <text x="705" y="545" text-anchor="middle" font-family="Arial" font-size="12" fill="#285e61" font-weight="bold">ASSAM</text>

      <!-- Other Northeastern States -->
      <path d="M 720 510 L 750 520 L 765 550 L 740 570 L 720 550 Z"
            fill="#f0fff4"
            stroke="#68d391"
            stroke-width="2"
            opacity="0.6"/>
      <text x="745" y="545" text-anchor="middle" font-family="Arial" font-size="9" fill="#276749" font-weight="bold">NE STATES</text>

      <!-- Goa -->
      <circle cx="200" cy="650" r="10" fill="#fed7d7" stroke="#e53e3e" stroke-width="2"/>
      <text x="215" y="655" font-family="Arial" font-size="9" fill="#c53030" font-weight="bold">GOA</text>

      <!-- Major Cities -->
      <circle cx="200" cy="580" r="3" fill="#1a202c"/>
      <text x="205" y="575" font-family="Arial" font-size="8" fill="#1a202c">Mumbai</text>

      <circle cx="400" cy="370" r="3" fill="#1a202c"/>
      <text x="405" y="365" font-family="Arial" font-size="8" fill="#1a202c">Delhi</text>

      <circle cx="320" cy="680" r="3" fill="#1a202c"/>
      <text x="325" y="675" font-family="Arial" font-size="8" fill="#1a202c">Bangalore</text>

      <circle cx="350" cy="770" r="3" fill="#1a202c"/>
      <text x="355" y="765" font-family="Arial" font-size="8" fill="#1a202c">Chennai</text>

      <circle cx="650" cy="500" r="3" fill="#1a202c"/>
      <text x="655" y="495" font-family="Arial" font-size="8" fill="#1a202c">Kolkata</text>

      <circle cx="400" cy="580" r="3" fill="#1a202c"/>
      <text x="405" y="575" font-family="Arial" font-size="8" fill="#1a202c">Hyderabad</text>

      <!-- Title -->
      <text x="500" y="50" text-anchor="middle" font-family="Arial" font-size="28" fill="#1a365d" font-weight="bold">INDIA</text>
      <text x="500" y="80" text-anchor="middle" font-family="Arial" font-size="16" fill="#4a5568">States and Union Territories</text>

      <!-- Compass -->
      <g transform="translate(50,50)">
        <circle cx="0" cy="0" r="25" fill="white" stroke="#4a5568" stroke-width="2" opacity="0.9"/>
        <text x="0" y="-15" text-anchor="middle" font-family="Arial" font-size="12" fill="#2d3748" font-weight="bold">N</text>
        <text x="15" y="5" text-anchor="middle" font-family="Arial" font-size="10" fill="#4a5568">E</text>
        <text x="0" y="20" text-anchor="middle" font-family="Arial" font-size="10" fill="#4a5568">S</text>
        <text x="-15" y="5" text-anchor="middle" font-family="Arial" font-size="10" fill="#4a5568">W</text>
        <polygon points="0,-18 3,-8 0,-5 -3,-8" fill="#e53e3e"/>
      </g>
    </svg>
  `;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-india-saffron" />
            India Fraud Incident Map
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {filteredData.length} cities
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Interactive map of India showing states, union territories, and fraud
          incident locations. Click on colored dots to see fraud details for
          each city.
        </p>

        {/* Simple Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
          <span className="text-sm font-medium text-gray-700">Show me:</span>

          <Select
            value={filters.fraudType}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, fraudType: value }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fraud Types</SelectItem>
              <SelectItem value="upi">UPI/Payment Fraud</SelectItem>
              <SelectItem value="phone">Phone Call Fraud</SelectItem>
              <SelectItem value="sms">SMS Fraud</SelectItem>
              <SelectItem value="email">Email Spam</SelectItem>
              <SelectItem value="whatsapp">WhatsApp Fraud</SelectItem>
              <SelectItem value="banking">Banking Fraud</SelectItem>
              <SelectItem value="investment">Investment Scams</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.severity}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, severity: value }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="critical">Very High Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Clear Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Political Map of India */}
        <div className="relative w-full h-[600px] bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* India Political Map SVG */}
          <div
            className="absolute inset-0 w-full h-full"
            dangerouslySetInnerHTML={{ __html: IndiaPoliticalMapSVG }}
          />

          {/* City Fraud Dots Overlay */}
          {filteredData.map((incident) => {
            const position = getMapPosition(incident.lat, incident.lng);
            const isSelected = selectedCity?.id === incident.id;

            return (
              <button
                key={incident.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-all duration-200 cursor-pointer ${getDotSize(incident.count)} ${getRiskColor(incident.severity)} ${isSelected ? "ring-4 ring-blue-300" : ""}`}
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  zIndex: isSelected ? 20 : 15,
                }}
                onClick={() => setSelectedCity(incident)}
                title={`${incident.city}, ${incident.state} - ${incident.count} cases`}
              />
            );
          })}

          {/* Selected City Info */}
          {selectedCity && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg border max-w-sm z-30">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-lg">{selectedCity.city}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCity(null)}
                  className="h-6 w-6 p-0 text-gray-500"
                >
                  ×
                </Button>
              </div>
              <p className="text-gray-600 mb-3">{selectedCity.state}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Total Reports:</span>
                  <span className="font-bold text-lg">
                    {selectedCity.count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Main Type:</span>
                  <span className="font-medium">{selectedCity.fraudType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Risk Level:</span>
                  <Badge
                    className={`text-xs text-white ${getRiskColor(selectedCity.severity)}`}
                  >
                    {getRiskLabel(selectedCity.severity)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>New This Week:</span>
                  <span className="font-medium text-orange-600">
                    +{selectedCity.recentIncidents}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Map Instructions */}
          <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-md text-xs max-w-48 z-10">
            <div className="flex items-center gap-1 mb-1">
              <Eye className="h-3 w-3" />
              <span className="font-medium">Map Guide:</span>
            </div>
            <p>
              This shows India's state boundaries. Click fraud dots for details.
            </p>
          </div>
        </div>

        {/* Map Legend and Stats */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Map Legend
            </h4>
            <div className="text-sm text-gray-600">
              Total Reports:{" "}
              <span className="font-bold text-lg text-black">
                {totalIncidents.toLocaleString()}
              </span>{" "}
              • High Risk Cities:{" "}
              <span className="font-bold text-red-600">{highRiskCities}</span> •
              States Shown:{" "}
              <span className="font-bold text-blue-600">28 + 8 UTs</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fraud Dot Guide */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Fraud Incident Markers
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Very High Risk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">High Risk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Medium Risk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Low Risk</span>
                </div>
              </div>
            </div>

            {/* Political Features */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Map Features
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• 28 States clearly marked</p>
                <p>• 8 Union Territories shown</p>
                <p>• State boundaries defined</p>
                <p>• Major cities labeled</p>
                <p>• Compass for orientation</p>
                <p>• Official administrative divisions</p>
              </div>
            </div>

            {/* Top Affected States */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Most Affected States
              </p>
              <div className="space-y-1">
                {filteredData
                  .reduce(
                    (acc, incident) => {
                      const existing = acc.find(
                        (item) => item.state === incident.state,
                      );
                      if (existing) {
                        existing.count += incident.count;
                      } else {
                        acc.push({
                          state: incident.state,
                          count: incident.count,
                        });
                      }
                      return acc;
                    },
                    [] as { state: string; count: number }[],
                  )
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 6)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-600 flex justify-between"
                    >
                      <span>{item.state}:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Map Information */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Official Map:
                </p>
                <p className="text-xs text-gray-600">
                  This map shows India's official boundaries as per the Survey
                  of India. State boundaries and names are based on current
                  administrative divisions. Fraud incident data is overlaid to
                  show regional patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndiaFraudMap;
