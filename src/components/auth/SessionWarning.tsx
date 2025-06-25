/**
 * Session Warning Component
 * Displays session expiry warnings and handles session extension
 */

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Shield, LogOut, RefreshCw, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/SecureAuthContext";

interface SessionWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: () => Promise<boolean>;
  onLogout: () => Promise<void>;
  timeRemaining: number; // in seconds
}

const SessionWarning: React.FC<SessionWarningProps> = ({
  isOpen,
  onClose,
  onExtend,
  onLogout,
  timeRemaining: initialTimeRemaining,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [isExtending, setIsExtending] = useState(false);
  const [extensionFailed, setExtensionFailed] = useState(false);

  // Update countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto logout when time expires
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onLogout]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(initialTimeRemaining);
      setIsExtending(false);
      setExtensionFailed(false);
    }
  }, [isOpen, initialTimeRemaining]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    setExtensionFailed(false);

    try {
      const success = await onExtend();

      if (success) {
        onClose();
      } else {
        setExtensionFailed(true);
      }
    } catch (error) {
      console.error("Session extension error:", error);
      setExtensionFailed(true);
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      // Still close the modal even if logout fails
      onClose();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProgressValue = (): number => {
    return (
      ((initialTimeRemaining - timeRemaining) / initialTimeRemaining) * 100
    );
  };

  const getUrgencyLevel = (): "low" | "medium" | "high" => {
    if (timeRemaining <= 60) return "high"; // Last minute
    if (timeRemaining <= 180) return "medium"; // Last 3 minutes
    return "low";
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                urgencyLevel === "high"
                  ? "bg-red-100 dark:bg-red-900/20"
                  : urgencyLevel === "medium"
                    ? "bg-yellow-100 dark:bg-yellow-900/20"
                    : "bg-blue-100 dark:bg-blue-900/20"
              }`}
            >
              <Clock
                className={`h-6 w-6 ${
                  urgencyLevel === "high"
                    ? "text-red-600 dark:text-red-400"
                    : urgencyLevel === "medium"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-blue-600 dark:text-blue-400"
                }`}
              />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Session Expiring Soon
              </DialogTitle>
              <DialogDescription>
                Your session will expire in {formatTime(timeRemaining)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Countdown Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time Remaining</span>
              <span
                className={`font-mono font-semibold ${
                  urgencyLevel === "high"
                    ? "text-red-600 dark:text-red-400"
                    : urgencyLevel === "medium"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Progress
              value={getProgressValue()}
              className={`h-2 ${
                urgencyLevel === "high"
                  ? "[&>div]:bg-red-500"
                  : urgencyLevel === "medium"
                    ? "[&>div]:bg-yellow-500"
                    : "[&>div]:bg-blue-500"
              }`}
            />
          </div>

          {/* Security Notice */}
          <Alert className="border-gray-200 bg-gray-50 dark:bg-gray-900/50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              For your security, government portal sessions automatically expire
              after 30 minutes of inactivity. You can extend your session to
              continue working.
            </AlertDescription>
          </Alert>

          {/* Extension Failed Alert */}
          {extensionFailed && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Failed to extend session. Please try again or log in again if
                the problem persists.
              </AlertDescription>
            </Alert>
          )}

          {/* Auto-logout Warning */}
          {timeRemaining <= 60 && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Warning:</strong> You will be automatically logged out
                when the timer reaches zero.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isExtending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
          <Button
            onClick={handleExtendSession}
            disabled={isExtending || timeRemaining <= 0}
            className="bg-primary hover:bg-primary/90"
          >
            {isExtending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Extending...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Extend Session
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionWarning;
