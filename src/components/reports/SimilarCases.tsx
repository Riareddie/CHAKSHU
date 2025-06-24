import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Search } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type FraudType = Database['public']['Enums']['fraud_type'];

interface SimilarCase {
  id: string;
  title: string;
  fraud_type: FraudType;
  status: string;
  created_at: string;
  amount_involved: number | null;
}

interface SimilarCasesProps {
  reportId: string;
  fraudType: FraudType;
}

const SimilarCases = ({ reportId, fraudType }: SimilarCasesProps) => {
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarCases();
  }, [reportId, fraudType]);

  const fetchSimilarCases = async () => {
    try {
      setLoading(true);
      
      // Find reports with the same fraud type, excluding the current report
      const { data, error } = await supabase
        .from('reports')
        .select('id, title, fraud_type, status, created_at, amount_involved')
        .eq('fraud_type', fraudType)
        .neq('id', reportId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setSimilarCases(data || []);
    } catch (error: any) {
      console.error('Error fetching similar cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Similar Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-india-saffron"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Similar Cases
        </CardTitle>
        <CardDescription>
          Other {fraudType.replace('_', ' ')} reports that might be related
        </CardDescription>
      </CardHeader>
      <CardContent>
        {similarCases.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No similar cases found</p>
            <p className="text-sm">This appears to be a unique type of case</p>
          </div>
        ) : (
          <div className="space-y-4">
            {similarCases.map((case_) => (
              <div key={case_.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{case_.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(case_.status)}
                  <span className="text-sm font-medium text-green-600">
                    {formatAmount(case_.amount_involved)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>ID: {case_.id.slice(0, 8)}...</span>
                  <span>{formatDate(case_.created_at)}</span>
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" className="w-full">
                View All Similar Cases
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimilarCases;
