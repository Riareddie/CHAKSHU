/**
 * Session-Aware Protected Route Component
 * Validates session on every route access and handles session-related redirects
 */

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SecureAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Loader2,
  Lock,
  Clock,
  RefreshCw,
} from "lucide-react";

interface SessionProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string[];
  requireAnyPermission?: boolean;
  fallbackPath?: string;
  skipSessionValidation?: boolean;
  customLoadingComponent?: React.ComponentType;
  customUnauthorizedComponent?: React.ComponentType<UnauthorizedProps>;
}

interface UnauthorizedProps {
  missingRole?: string;
  missingPermissions?: string[];
  userRole?: string;
  userPermissions?: string[];
  onRetry?: () => void;
}

// Enhanced loading component with session validation status
const SessionValidationLoader: React.FC<{
  status: "checking" | "validating" | "extending" | "failed";
}> = ({ status }) => {
  const getStatusMessage = () => {
    switch (status) {
      case "checking":
        return "Checking authentication...";
      case "validating":
        return "Validating session...";
      case "extending":
        return "Extending session...";
      case "failed":
        return "Session validation failed";
      default:
        return "Loading...";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
      case "validating":
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case "extending":
        return <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />;
      case "failed":
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Shield className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Secure Access
          </CardTitle>
          <CardDescription>{getStatusMessage()}</CardDescription>
        </CardHeader>

        {status === "failed" && (
          <CardContent>
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Session validation failed. Please try refreshing the page or log
                in again.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

// Session expired component
const SessionExpired: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-fit">
          <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Session Expired
        </CardTitle>
        <CardDescription>
          Your session has expired for security reasons. Please log in again to
          continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <Shield className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            For your security, government portal sessions automatically expire
            after 30 minutes of inactivity.
          </AlertDescription>
        </Alert>

        <Button className="w-full" onClick={onLogin}>
          <Shield className="h-4 w-4 mr-2" />
          Sign In Again
        </Button>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          You'll be redirected back to this page after signing in.
        </div>
      </CardContent>
    </Card>
  </div>
);

// Unauthorized access component
const UnauthorizedAccess: React.FC<UnauthorizedProps> = ({
  missingRole,
  missingPermissions,
  userRole,
  userPermissions,
  onRetry,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-fit">
          <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Access Denied
        </CardTitle>
        <CardDescription>
          You don't have the required permissions to access this resource.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="space-y-2">
              {missingRole && (
                <p>
                  <strong>Required Role:</strong> {missingRole.toUpperCase()}
                </p>
              )}
              {missingPermissions && missingPermissions.length > 0 && (
                <p>
                  <strong>Required Permissions:</strong>{" "}
                  {missingPermissions.join(", ").toUpperCase()}
                </p>
              )}
              <p>
                <strong>Your Role:</strong> {userRole?.toUpperCase() || "None"}
              </p>
              {userPermissions && userPermissions.length > 0 && (
                <p>
                  <strong>Your Permissions:</strong>{" "}
                  {userPermissions.join(", ").toUpperCase()}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
          {onRetry && (
            <Button onClick={onRetry} className="flex-1">
              Retry
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Contact your administrator if you believe this is an error.
        </div>
      </CardContent>
    </Card>
  </div>
);

export const SessionProtectedRoute: React.FC<SessionProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = [],
  requireAnyPermission = false,
  fallbackPath = "/login",
  skipSessionValidation = false,
  customLoadingComponent: CustomLoading,
  customUnauthorizedComponent: CustomUnauthorized,
}) => {
  const {
    user,
    session,
    loading,
    isAuthenticated,
    validateSession,
    updateActivity,
    checkRole,
    checkPermission,
  } = useAuth();

  const location = useLocation();
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "checking" | "validating" | "extending" | "failed" | "success"
  >("idle");
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  // Validate session on route access
  useEffect(() => {
    const performSessionValidation = async () => {
      if (!isAuthenticated || !session || skipSessionValidation) {
        setSessionValid(isAuthenticated);
        return;
      }

      setValidationStatus("validating");

      try {
        const isValid = await validateSession();
        setSessionValid(isValid);
        setValidationStatus(isValid ? "success" : "failed");

        if (isValid) {
          // Update activity for route access
          updateActivity("route_access", {
            path: location.pathname,
            requiredRole,
            requiredPermissions,
          });
        }
      } catch (error) {
        console.error("Session validation error:", error);
        setSessionValid(false);
        setValidationStatus("failed");
      }
    };

    if (loading) {
      setValidationStatus("checking");
    } else {
      performSessionValidation();
    }
  }, [
    isAuthenticated,
    session,
    location.pathname,
    loading,
    skipSessionValidation,
    validateSession,
    updateActivity,
    requiredRole,
    requiredPermissions,
  ]);

  // Show loading during authentication check or session validation
  if (
    loading ||
    validationStatus === "checking" ||
    validationStatus === "validating"
  ) {
    return CustomLoading ? (
      <CustomLoading />
    ) : (
      <SessionValidationLoader status={validationStatus} />
    );
  }

  // Handle session validation failure
  if (validationStatus === "failed" || sessionValid === false) {
    return (
      <SessionExpired
        onLogin={() => {
          // Store the intended destination
          sessionStorage.setItem("redirectAfterLogin", location.pathname);
          window.location.href = fallbackPath;
        }}
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    // Store the intended destination
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !checkRole(requiredRole)) {
    if (CustomUnauthorized) {
      return (
        <CustomUnauthorized
          missingRole={requiredRole}
          missingPermissions={requiredPermissions}
          userRole={user.role}
          userPermissions={user.permissions}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return (
      <UnauthorizedAccess
        missingRole={requiredRole}
        userRole={user.role}
        userPermissions={user.permissions}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAnyPermission
      ? requiredPermissions.some((permission) => checkPermission(permission))
      : requiredPermissions.every((permission) => checkPermission(permission));

    if (!hasRequiredPermissions) {
      if (CustomUnauthorized) {
        return (
          <CustomUnauthorized
            missingPermissions={requiredPermissions}
            userRole={user.role}
            userPermissions={user.permissions}
            onRetry={() => window.location.reload()}
          />
        );
      }

      return (
        <UnauthorizedAccess
          missingPermissions={requiredPermissions}
          userRole={user.role}
          userPermissions={user.permissions}
          onRetry={() => window.location.reload()}
        />
      );
    }
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

// Convenience wrapper components
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SessionProtectedRoute requiredRole="admin">{children}</SessionProtectedRoute>
);

export const ModeratorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SessionProtectedRoute requiredRole="moderator">
    {children}
  </SessionProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <SessionProtectedRoute>{children}</SessionProtectedRoute>;

export default SessionProtectedRoute;
