import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ConnectionStatus {
  connected: boolean;
  error?: string;
  tablesAvailable: string[];
  lastChecked: string;
}

const DatabaseConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    tablesAvailable: [],
    lastChecked: "",
  });
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    const checkTime = new Date().toLocaleTimeString();

    try {
      // Test basic connectivity
      const { data, error } = await supabase
        .from("reports")
        .select("id")
        .limit(1);

      if (error) {
        setStatus({
          connected: false,
          error: `${error.message} (${error.code})`,
          tablesAvailable: [],
          lastChecked: checkTime,
        });
      } else {
        // Test other tables
        const tablesToCheck = [
          "reports",
          "notifications",
          "user_analytics_preferences",
        ];
        const availableTables = [];

        for (const table of tablesToCheck) {
          try {
            await supabase.from(table).select("*").limit(1);
            availableTables.push(table);
          } catch (err) {
            console.warn(`Table ${table} not accessible`);
          }
        }

        setStatus({
          connected: true,
          tablesAvailable: availableTables,
          lastChecked: checkTime,
        });
      }
    } catch (error) {
      setStatus({
        connected: false,
        error:
          error instanceof Error ? error.message : "Unknown connection error",
        tablesAvailable: [],
        lastChecked: checkTime,
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className={status.connected ? "border-green-200" : "border-red-200"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                status.connected
                  ? "text-green-600 border-green-200"
                  : "text-red-600 border-red-200"
              }
            >
              {status.connected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              disabled={checking}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`}
              />
              Check
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status.error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Error:</strong> {status.error}
            </AlertDescription>
          </Alert>
        )}

        {status.connected && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Database connection successful
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Available Tables:</h4>
              <div className="flex flex-wrap gap-2">
                {status.tablesAvailable.map((table) => (
                  <Badge key={table} variant="secondary" className="text-xs">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {!status.connected && !status.error && (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Checking database connection...
            </p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t text-xs text-gray-500">
          Last checked: {status.lastChecked || "Never"}
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConnectionStatus;
