/**
 * Session Status Monitor Component
 * Provides real-time session status monitoring and warnings
 */

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/SecureAuthContext";
import SessionWarning from "./SessionWarning";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

interface SessionStatusMonitorProps {
  showStatusIndicator?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const SessionStatusMonitor: React.FC<SessionStatusMonitorProps> = ({
  showStatusIndicator = true,
  position = "top-right",
}) => {
  const {
    isAuthenticated,
    session,
    sessionExpiry,
    lastActivity,
    showSessionWarning,
    dismissSessionWarning,
    extendSession,
    logout,
    validateSession,
  } = useAuth();

  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [sessionStatus, setSessionStatus] = useState<
    "active" | "warning" | "expired" | "offline"
  >("active");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update time until expiry
  useEffect(() => {
    if (!sessionExpiry || !isAuthenticated) {
      setTimeUntilExpiry(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((sessionExpiry.getTime() - Date.now()) / 1000),
      );
      setTimeUntilExpiry(remaining);

      // Update session status
      if (remaining <= 0) {
        setSessionStatus("expired");
      } else if (remaining <= 300) {
        // 5 minutes
        setSessionStatus("warning");
      } else {
        setSessionStatus("active");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiry, isAuthenticated]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Validate session when coming back online
      if (isAuthenticated) {
        validateSession();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSessionStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isAuthenticated, validateSession]);

  // Format time display
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Get status color and icon
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        color: "bg-gray-500",
        icon: WifiOff,
        text: "Offline",
        description: "No internet connection",
      };
    }

    if (!isAuthenticated) {
      return {
        color: "bg-gray-500",
        icon: Shield,
        text: "Not authenticated",
        description: "Please log in",
      };
    }

    switch (sessionStatus) {
      case "expired":
        return {
          color: "bg-red-500",
          icon: AlertTriangle,
          text: "Expired",
          description: "Session has expired",
        };
      case "warning":
        return {
          color: "bg-yellow-500",
          icon: Clock,
          text: `${formatTimeRemaining(timeUntilExpiry)}`,
          description: "Session expiring soon",
        };
      case "active":
        return {
          color: "bg-green-500",
          icon: CheckCircle,
          text: "Active",
          description: `Session expires in ${formatTimeRemaining(timeUntilExpiry)}`,
        };
      default:
        return {
          color: "bg-gray-500",
          icon: Shield,
          text: "Unknown",
          description: "Unknown session status",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (!isAuthenticated && showStatusIndicator) {
    return null; // Don't show indicator when not authenticated
  }

  return (
    <>
      {/* Session Warning Modal */}
      {showSessionWarning && (
        <SessionWarning
          isOpen={showSessionWarning}
          onClose={dismissSessionWarning}
          onExtend={extendSession}
          onLogout={logout}
          timeRemaining={timeUntilExpiry}
        />
      )}

      {/* Status Indicator */}
      {showStatusIndicator && isAuthenticated && (
        <div className={`fixed ${positionClasses[position]} z-50`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className={`${statusInfo.color} text-white border-0 cursor-help hover:opacity-80 transition-opacity flex items-center gap-1.5 px-2 py-1`}
                >
                  <StatusIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{statusInfo.text}</span>
                  {!isOnline && <WifiOff className="h-3 w-3" />}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">{statusInfo.description}</p>
                  {isAuthenticated && session && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Session ID: {session.sessionId.slice(-8)}</p>
                      <p>
                        Last activity:{" "}
                        {new Date(lastActivity).toLocaleTimeString()}
                      </p>
                      {!isOnline && (
                        <p className="text-yellow-600 dark:text-yellow-400">
                          Session will be validated when connection is restored
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Network Status Indicator */}
      {!isOnline && isAuthenticated && (
        <div
          className={`fixed ${position === "top-right" ? "top-16 right-4" : "top-4 right-4"} z-50`}
        >
          <Badge
            variant="destructive"
            className="flex items-center gap-1.5 px-2 py-1"
          >
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">Offline</span>
          </Badge>
        </div>
      )}
    </>
  );
};

export default SessionStatusMonitor;
