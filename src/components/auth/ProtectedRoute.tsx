/**
 * Protected Route Component
 * Provides route-level authentication and authorization with role-based access control
 */

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  useAdminAuth,
  UserRole,
  Permission,
} from "@/contexts/AdminAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, Shield, User, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  requireAnyPermission?: boolean; // If true, user needs ANY of the permissions, if false, ALL
  fallbackPath?: string;
  showLoginPrompt?: boolean;
  customUnauthorizedComponent?: React.ComponentType<{
    missingRole?: UserRole;
    missingPermissions?: Permission[];
    onRetry?: () => void;
  }>;
}

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <Spinner className="h-8 w-8 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">
        Verifying authentication...
      </p>
    </div>
  </div>
);

const UnauthorizedAccess: React.FC<{
  missingRole?: UserRole;
  missingPermissions?: Permission[];
  userRole?: UserRole;
  userPermissions?: Permission[];
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({
  missingRole,
  missingPermissions,
  userRole,
  userPermissions,
  onRetry,
  onGoBack,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
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
            You don't have the required permissions to access this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Access Requirements */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                {missingRole && (
                  <p>
                    <strong>Required Role:</strong>{" "}
                    {missingRole.replace("_", " ").toUpperCase()}
                  </p>
                )}
                {missingPermissions && missingPermissions.length > 0 && (
                  <p>
                    <strong>Required Permissions:</strong>{" "}
                    {missingPermissions.join(", ").toUpperCase()}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* User's Current Access Level */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Access Level
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-6 px-2"
              >
                {showDetails ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>

            {showDetails && (
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Role:</strong>{" "}
                  {userRole?.replace("_", " ").toUpperCase() || "None"}
                </p>
                <p>
                  <strong>Permissions:</strong>{" "}
                  {userPermissions?.join(", ").toUpperCase() || "None"}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onGoBack || (() => window.history.back())}
            >
              Go Back
            </Button>
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                Retry
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              If you believe this is an error, please contact your
              administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoginRequired: React.FC<{
  onLogin?: () => void;
  redirectPath?: string;
}> = ({ onLogin, redirectPath }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
          <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Authentication Required
        </CardTitle>
        <CardDescription>
          You need to be logged in to access this page.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          className="w-full"
          onClick={onLogin || (() => (window.location.href = "/login"))}
        >
          <Shield className="h-4 w-4 mr-2" />
          Sign In
        </Button>

        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          You'll be redirected back to this page after signing in.
        </div>
      </CardContent>
    </Card>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = [],
  requireAnyPermission = false,
  fallbackPath = "/login",
  showLoginPrompt = true,
  customUnauthorizedComponent: CustomUnauthorized,
}) => {
  const {
    user,
    adminProfile,
    loading,
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyPermission: hasAnyPermissionFn,
    trackActivity,
    updateLastActivity,
  } = useAdminAuth();

  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Update activity when accessing protected routes
  useEffect(() => {
    if (isAuthenticated && user) {
      updateLastActivity();
      trackActivity("page_access", "navigation", {
        path: location.pathname,
        requiredRole,
        requiredPermissions,
      });
    }
  }, [location.pathname, isAuthenticated, user]);

  // Mark auth as checked after loading completes
  useEffect(() => {
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

  // Show loading spinner while checking authentication
  if (loading || !authChecked) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    if (showLoginPrompt) {
      return (
        <LoginRequired
          redirectPath={location.pathname}
          onLogin={() => {
            // Store the attempted path for redirect after login
            sessionStorage.setItem("redirectAfterLogin", location.pathname);
            window.location.href = fallbackPath;
          }}
        />
      );
    }

    // Redirect programmatically
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (CustomUnauthorized) {
      return (
        <CustomUnauthorized
          missingRole={requiredRole}
          missingPermissions={requiredPermissions}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return (
      <UnauthorizedAccess
        missingRole={requiredRole}
        userRole={adminProfile?.role}
        userPermissions={adminProfile?.permissions}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAnyPermission
      ? hasAnyPermissionFn(requiredPermissions)
      : requiredPermissions.every((permission) => hasPermission(permission));

    if (!hasRequiredPermissions) {
      if (CustomUnauthorized) {
        return (
          <CustomUnauthorized
            missingPermissions={requiredPermissions}
            onRetry={() => window.location.reload()}
          />
        );
      }

      return (
        <UnauthorizedAccess
          missingPermissions={requiredPermissions}
          userRole={adminProfile?.role}
          userPermissions={adminProfile?.permissions}
          onRetry={() => window.location.reload()}
        />
      );
    }
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

// Convenience wrapper components for common use cases
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={UserRole.ADMIN}>{children}</ProtectedRoute>;

export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={UserRole.SUPER_ADMIN}>
    {children}
  </ProtectedRoute>
);

export const ModeratorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={UserRole.MODERATOR}>{children}</ProtectedRoute>
);

export const WritePermissionRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredPermissions={[Permission.WRITE]}>
    {children}
  </ProtectedRoute>
);

export const DeletePermissionRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredPermissions={[Permission.DELETE]}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
