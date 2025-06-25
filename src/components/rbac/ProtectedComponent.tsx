/**
 * Protected Component Wrapper
 * Provides declarative component-level access control based on roles and permissions
 */

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react";
import { useRBAC, usePermissionCheck } from "@/hooks/useRBAC";
import { UserRole, Permission } from "@/types/rbac";

interface ProtectedComponentProps {
  children: React.ReactNode;
  permissions?: Permission[];
  roles?: UserRole[];
  requireAnyPermission?: boolean;
  requireAnyRole?: boolean;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  unauthorizedMessage?: string;
  className?: string;
}

interface ConditionalRenderProps {
  children: React.ReactNode;
  permissions?: Permission[];
  roles?: UserRole[];
  requireAnyPermission?: boolean;
  requireAnyRole?: boolean;
  inverse?: boolean; // Show content when conditions are NOT met
}

interface FieldProtectionProps {
  children: React.ReactNode;
  fieldName: string;
  mode: "read" | "write" | "both";
  fieldConfig?: any;
  fallback?: React.ReactNode;
  showPlaceholder?: boolean;
}

// Main protected component wrapper
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  permissions,
  roles,
  requireAnyPermission = false,
  requireAnyRole = false,
  fallback,
  showFallback = true,
  unauthorizedMessage,
  className = "",
}) => {
  const { user } = useRBAC();
  const { canAccess } = usePermissionCheck();

  const hasAccess = canAccess({
    permissions,
    roles,
    requireAnyPermission,
    requireAnyRole,
  });

  if (!user) {
    return showFallback ? (
      <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Shield className="h-5 w-5" />
            Authentication Required
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Please log in to access this content.
          </CardDescription>
        </CardHeader>
      </Card>
    ) : null;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return showFallback ? (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Lock className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription className="text-red-700">
            {unauthorizedMessage ||
              "You do not have permission to access this content."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">
            <p>
              <strong>Required:</strong>
            </p>
            {roles && roles.length > 0 && <p>Roles: {roles.join(", ")}</p>}
            {permissions && permissions.length > 0 && (
              <p>Permissions: {permissions.join(", ")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    ) : null;
  }

  return <div className={className}>{children}</div>;
};

// Conditional rendering component (no UI wrapper)
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  permissions,
  roles,
  requireAnyPermission = false,
  requireAnyRole = false,
  inverse = false,
}) => {
  const { canAccess } = usePermissionCheck();

  const hasAccess = canAccess({
    permissions,
    roles,
    requireAnyPermission,
    requireAnyRole,
  });

  const shouldRender = inverse ? !hasAccess : hasAccess;

  return shouldRender ? <>{children}</> : null;
};

// Field-level protection component
export const ProtectedField: React.FC<FieldProtectionProps> = ({
  children,
  fieldName,
  mode,
  fieldConfig,
  fallback,
  showPlaceholder = true,
}) => {
  const { user } = useRBAC();

  if (!user) {
    return showPlaceholder ? (
      <div className="text-gray-400 italic">[Authentication required]</div>
    ) : null;
  }

  // Simple field access check (can be enhanced based on fieldConfig)
  const canRead = mode === "read" || mode === "both";
  const canWrite = mode === "write" || mode === "both";

  // For now, implement basic role-based field access
  const hasFieldAccess = () => {
    if (mode === "read") return true; // Most fields are readable
    if (mode === "write") {
      // Officers and above can edit most fields
      return [UserRole.OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(
        user.role,
      );
    }
    return true;
  };

  if (!hasFieldAccess()) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return showPlaceholder ? (
      <div className="flex items-center gap-2 text-gray-400 italic text-sm">
        <EyeOff className="h-3 w-3" />
        [Protected field]
      </div>
    ) : null;
  }

  return <>{children}</>;
};

// Role-based badge component
export const RoleBadge: React.FC<{
  role: UserRole;
  size?: "sm" | "md" | "lg";
}> = ({ role, size = "md" }) => {
  const getBadgeConfig = (role: UserRole) => {
    const configs = {
      [UserRole.CITIZEN]: {
        label: "Citizen",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "👤",
      },
      [UserRole.OFFICER]: {
        label: "Officer",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: "🛡️",
      },
      [UserRole.ADMIN]: {
        label: "Admin",
        className: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "👑",
      },
      [UserRole.SUPER_ADMIN]: {
        label: "Super Admin",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: "⚡",
      },
    };

    return configs[role] || configs[UserRole.CITIZEN];
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const config = getBadgeConfig(role);

  return (
    <span
      className={`
      inline-flex items-center gap-1 rounded-full border font-medium
      ${config.className}
      ${sizeClasses[size]}
    `}
    >
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Permission list component for debugging/admin
export const PermissionsList: React.FC<{
  permissions: Permission[];
  className?: string;
}> = ({ permissions, className = "" }) => {
  const [showAll, setShowAll] = React.useState(false);
  const displayPermissions = showAll ? permissions : permissions.slice(0, 5);

  if (permissions.length === 0) {
    return (
      <div className={`text-gray-500 italic text-sm ${className}`}>
        No permissions assigned
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-1">
        {displayPermissions.map((permission, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <Shield className="h-3 w-3 text-green-500" />
            <code className="bg-gray-100 px-1 rounded text-xs">
              {permission}
            </code>
          </div>
        ))}
      </div>

      {permissions.length > 5 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-xs"
        >
          {showAll ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Show All ({permissions.length})
            </>
          )}
        </Button>
      )}
    </div>
  );
};

// Access denied fallback component
export const AccessDeniedFallback: React.FC<{
  title?: string;
  message?: string;
  showDetails?: boolean;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  onRequestAccess?: () => void;
}> = ({
  title = "Access Denied",
  message = "You do not have permission to access this resource.",
  showDetails = false,
  requiredRoles,
  requiredPermissions,
  onRequestAccess,
}) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-red-700">{message}</CardDescription>
      </CardHeader>

      {showDetails && (requiredRoles || requiredPermissions) && (
        <CardContent>
          <div className="space-y-2 text-sm text-red-700">
            {requiredRoles && requiredRoles.length > 0 && (
              <div>
                <strong>Required Roles:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {requiredRoles.map((role) => (
                    <RoleBadge key={role} role={role} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {requiredPermissions && requiredPermissions.length > 0 && (
              <div>
                <strong>Required Permissions:</strong>
                <div className="mt-1 space-y-1">
                  {requiredPermissions.map((permission) => (
                    <code
                      key={permission}
                      className="block bg-red-100 px-2 py-1 rounded text-xs"
                    >
                      {permission}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>

          {onRequestAccess && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRequestAccess}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Request Access
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Development tools for testing permissions
export const RBACDebugPanel: React.FC = () => {
  const { user, getEffectivePermissions } = useRBAC();
  const [showPanel, setShowPanel] = React.useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="mb-2"
      >
        RBAC Debug
      </Button>

      {showPanel && (
        <Card className="w-80 max-h-96 overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-sm">RBAC Debug Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong className="text-sm">User:</strong>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>

            <div>
              <strong className="text-sm">Role:</strong>
              <div className="mt-1">
                <RoleBadge role={user.role} size="sm" />
              </div>
            </div>

            <div>
              <strong className="text-sm">Permissions:</strong>
              <PermissionsList
                permissions={getEffectivePermissions()}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProtectedComponent;
