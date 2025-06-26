import React, { useState, useEffect } from "react";
import {
  checkSupabaseHealth,
  SupabaseHealthCheck,
} from "@/lib/supabase-health";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, isDemoMode } from "@/integrations/supabase/client";

const SupabaseConnectionStatus: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<SupabaseHealthCheck | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const status = await checkSupabaseHealth();
      setHealthStatus(status);
      setLastChecked(new Date());
    } catch (error) {
      setHealthStatus({
        isAvailable: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusIcon = () => {
    if (loading) return <Clock className="h-4 w-4 animate-spin" />;
    if (healthStatus?.isAvailable)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (loading) return <Badge variant="secondary">Checking...</Badge>;
    if (isDemoMode) return <Badge variant="outline">Demo Mode</Badge>;
    if (healthStatus?.isAvailable)
      return (
        <Badge variant="default" className="bg-green-500">
          Connected
        </Badge>
      );
    return <Badge variant="destructive">Disconnected</Badge>;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getStatusIcon()}
          Supabase Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge()}
        </div>

        {healthStatus?.responseTime && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Response Time:
            </span>
            <span className="text-sm font-mono">
              {healthStatus.responseTime}ms
            </span>
          </div>
        )}

        {healthStatus?.error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
            <strong>Error:</strong> {healthStatus.error}
          </div>
        )}

        {lastChecked && (
          <div className="text-xs text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}

        <Button
          onClick={checkConnection}
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Check Connection
        </Button>

        {!isDemoMode && (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
            <strong>Config:</strong> Real Supabase connection configured
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionStatus;
