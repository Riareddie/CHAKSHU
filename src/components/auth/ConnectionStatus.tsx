import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { checkSupabaseHealth } from "@/lib/supabase-health";

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className }) => {
  const [status, setStatus] = useState<{
    isOnline: boolean;
    isChecking: boolean;
    error?: string;
    responseTime?: number;
  }>({
    isOnline: true,
    isChecking: true,
  });

  useEffect(() => {
    const checkConnection = async () => {
      setStatus((prev) => ({ ...prev, isChecking: true }));

      try {
        const health = await checkSupabaseHealth();
        setStatus({
          isOnline: health.isAvailable,
          isChecking: false,
          error: health.error,
          responseTime: health.responseTime,
        });
      } catch (error) {
        // Silently handle connection check failures to avoid console errors
        console.warn("Connection check failed:", error);
        setStatus({
          isOnline: false,
          isChecking: false,
          error: "Connection check failed",
        });
      }
    };

    // Only check connection if we're in a browser environment
    if (typeof window !== "undefined" && navigator.onLine !== false) {
      checkConnection();

      // Check connection every 60 seconds (reduced frequency)
      const interval = setInterval(checkConnection, 60000);

      return () => clearInterval(interval);
    } else {
      // If offline or not in browser, set offline status
      setStatus({
        isOnline: false,
        isChecking: false,
        error: "Browser is offline",
      });
    }
  }, []);

  if (status.isChecking) {
    return null; // Don't show anything while checking
  }

  if (status.isOnline) {
    return null; // Don't show anything when connection is good
  }

  return (
    <Alert className={`border-yellow-200 bg-yellow-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>
            Authentication service is currently unavailable. Demo mode is
            active.
          </span>
        </div>
        {status.error && (
          <div className="text-xs mt-1 opacity-75">{status.error}</div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
