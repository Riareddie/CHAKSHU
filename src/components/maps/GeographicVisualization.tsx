
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Filter, TrendingUp, AlertTriangle } from 'lucide-react';

interface FraudLocation {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  fraud_type: string;
  status: string;
  amount_involved: number | null;
  created_at: string;
}

interface GeographicVisualizationProps {
  height?: string;
  showFilters?: boolean;
}

const GeographicVisualization: React.FC<GeographicVisualizationProps> = ({
  height = "400px",
  showFilters = true
}) => {
  const [locations, setLocations] = useState<FraudLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFraudType, setSelectedFraudType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  useEffect(() => {
    fetchFraudLocations();
  }, [selectedFraudType, selectedState]);

  const fetchFraudLocations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('reports')
        .select('id, title, latitude, longitude, city, state, fraud_type, status, amount_involved, created_at')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (selectedFraudType !== 'all') {
        query = query.eq('fraud_type', selectedFraudType);
      }

      if (selectedState !== 'all') {
        query = query.eq('state', selectedState);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      console.error('Error fetching fraud locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for Indian states and major cities since we don't have real coordinates
  const mockLocations: FraudLocation[] = [
    {
      id: '1',
      title: 'UPI Fraud Case',
      latitude: 28.6139,
      longitude: 77.2090,
      city: 'New Delhi',
      state: 'Delhi',
      fraud_type: 'phishing',
      status: 'under_review',
      amount_involved: 25000,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Investment Scam',
      latitude: 19.0760,
      longitude: 72.8777,
      city: 'Mumbai',
      state: 'Maharashtra',
      fraud_type: 'investment_scam',
      status: 'resolved',
      amount_involved: 150000,
      created_at: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      title: 'Tech Support Fraud',
      latitude: 12.9716,
      longitude: 77.5946,
      city: 'Bangalore',
      state: 'Karnataka',
      fraud_type: 'tech_support_scam',
      status: 'pending',
      amount_involved: 50000,
      created_at: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      title: 'SMS Phishing',
      latitude: 13.0827,
      longitude: 80.2707,
      city: 'Chennai',
      state: 'Tamil Nadu',
      fraud_type: 'sms_fraud',
      status: 'under_review',
      amount_involved: 30000,
      created_at: '2024-01-12T16:45:00Z'
    },
    {
      id: '5',
      title: 'Online Shopping Fraud',
      latitude: 22.5726,
      longitude: 88.3639,
      city: 'Kolkata',
      state: 'West Bengal',
      fraud_type: 'other',
      status: 'resolved',
      amount_involved: 12000,
      created_at: '2024-01-11T11:30:00Z'
    }
  ];

  const displayLocations = locations.length > 0 ? locations : mockLocations;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getFraudTypeColor = (type: string) => {
    switch (type) {
      case 'phishing': return 'bg-red-500';
      case 'investment_scam': return 'bg-orange-500';
      case 'tech_support_scam': return 'bg-purple-500';
      case 'sms_fraud': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Amount not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = {
    totalCases: displayLocations.length,
    totalAmount: displayLocations.reduce((sum, loc) => sum + (loc.amount_involved || 0), 0),
    resolvedCases: displayLocations.filter(loc => loc.status === 'resolved').length,
    pendingCases: displayLocations.filter(loc => loc.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold">{stats.totalCases}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">₹{(stats.totalAmount / 100000).toFixed(1)}L</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolvedCases}</p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingCases}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution of Fraud Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mock India Map with Case Markers */}
          <div 
            className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border"
            style={{ height }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Interactive Map Visualization</p>
                <p className="text-sm text-gray-500">
                  This would show an interactive map of India with fraud case markers
                </p>
              </div>
            </div>

            {/* Mock location markers */}
            {displayLocations.slice(0, 5).map((location, index) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
                title={`${location.city}, ${location.state} - ${location.fraud_type}`}
              >
                <div className={`w-4 h-4 rounded-full ${getFraudTypeColor(location.fraud_type)} border-2 border-white shadow-lg`}></div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Phishing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Investment Scam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Tech Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">SMS Fraud</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Other</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Cases by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayLocations.slice(0, 10).map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getFraudTypeColor(location.fraud_type)}`}></div>
                  <div>
                    <h4 className="font-medium">{location.title}</h4>
                    <p className="text-sm text-gray-600">
                      {location.city}, {location.state}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(location.status)}>
                    {location.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatAmount(location.amount_involved)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicVisualization;
