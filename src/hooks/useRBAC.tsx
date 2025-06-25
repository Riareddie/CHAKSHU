/**
 * RBAC React Hooks and Context
 * Provides role-based access control functionality throughout the application
 */

import React, { createContext, useContext, useMemo, useCallback } from "react";
import {
  UserRole,
  Permission,
  RBACUser,
  AuthorizationContext,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  NavigationItem,
  DEFAULT_NAVIGATION,
} from "@/types/rbac";
import { useAuth } from "@/contexts/SecureAuthContext";

// RBAC Context
const RBACContext = createContext<AuthorizationContext | undefined>(undefined);

interface RBACProviderProps {
  children: React.ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth();

  // Convert auth user to RBAC user (if authenticated)
  const user: RBACUser | null = useMemo(() => {
    if (!authUser) return null;

    return {
      id: authUser.id,
      email: authUser.email,
      fullName: authUser.fullName || authUser.email,
      role: (authUser.role as UserRole) || UserRole.CITIZEN,
      permissions: (authUser.permissions as Permission[]) || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        loginCount: 0,
        lastActivityAt: authUser.lastLogin,
      },
    };
  }, [authUser]);

  // Get effective permissions (role permissions + custom permissions)
  const getEffectivePermissions = useCallback((): Permission[] => {
    if (!user) return [];

    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    const customPermissions = user.customPermissions || [];
    const temporaryPermissions =
      user.metadata.temporaryAccess?.permissions || [];

    // Check if temporary access is still valid
    const isTemporaryValid = user.metadata.temporaryAccess?.expiresAt
      ? new Date() < user.metadata.temporaryAccess.expiresAt
      : false;

    const allPermissions = [
      ...rolePermissions,
      ...customPermissions,
      ...(isTemporaryValid ? temporaryPermissions : []),
    ];

    // Remove duplicates
    return Array.from(new Set(allPermissions));
  }, [user]);

  // Check if user has specific permission(s)
  const hasPermission = useCallback(
    (permission: Permission | Permission[]): boolean => {
      if (!user) return false;

      const effectivePermissions = getEffectivePermissions();

      if (Array.isArray(permission)) {
        return permission.every((p) => effectivePermissions.includes(p));
      }

      return effectivePermissions.includes(permission);
    },
    [user, getEffectivePermissions],
  );

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;

      const effectivePermissions = getEffectivePermissions();
      return permissions.some((p) => effectivePermissions.includes(p));
    },
    [user, getEffectivePermissions],
  );

  // Check if user has specific role(s)
  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!user) return false;

      if (Array.isArray(role)) {
        return role.includes(user.role);
      }

      return user.role === role;
    },
    [user],
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  // Check if user has higher role than target role
  const isHigherRole = useCallback(
    (targetRole: UserRole): boolean => {
      if (!user) return false;
      return ROLE_HIERARCHY[user.role] > ROLE_HIERARCHY[targetRole];
    },
    [user],
  );

  // Check if user can manage another user (based on role hierarchy)
  const canManageUser = useCallback(
    (targetUser: RBACUser): boolean => {
      if (!user) return false;

      // Super admin can manage anyone
      if (user.role === UserRole.SUPER_ADMIN) return true;

      // Admin can manage officers and citizens
      if (user.role === UserRole.ADMIN) {
        return [UserRole.OFFICER, UserRole.CITIZEN].includes(targetUser.role);
      }

      // Officer can manage citizens
      if (user.role === UserRole.OFFICER) {
        return targetUser.role === UserRole.CITIZEN;
      }

      // Citizens can't manage other users
      return false;
    },
    [user],
  );

  // Check if user can access specific resource and action
  const canAccessResource = useCallback(
    (resource: string, action: string): boolean => {
      if (!user) return false;

      // Define resource-action to permission mapping
      const resourcePermissions: Record<
        string,
        Record<string, Permission[]>
      > = {
        reports: {
          view_own: [Permission.REPORTS_VIEW_OWN],
          view_all: [Permission.REPORTS_VIEW_ALL],
          create: [Permission.REPORTS_CREATE],
          update_own: [Permission.REPORTS_UPDATE_OWN],
          update_all: [Permission.REPORTS_UPDATE_ALL],
          delete_own: [Permission.REPORTS_DELETE_OWN],
          delete_all: [Permission.REPORTS_DELETE_ALL],
          export: [Permission.REPORTS_EXPORT],
          assign: [Permission.REPORTS_ASSIGN],
          resolve: [Permission.REPORTS_RESOLVE],
        },
        users: {
          view: [Permission.USERS_VIEW_ALL],
          create: [Permission.USERS_CREATE],
          update: [Permission.USERS_UPDATE],
          delete: [Permission.USERS_DELETE],
          manage_roles: [Permission.USERS_MANAGE_ROLES],
        },
        analytics: {
          view_basic: [Permission.ANALYTICS_VIEW_BASIC],
          view_advanced: [Permission.ANALYTICS_VIEW_ADVANCED],
          export: [Permission.ANALYTICS_EXPORT],
        },
        system: {
          config: [Permission.SYSTEM_CONFIG],
          audit_logs: [Permission.SYSTEM_AUDIT_LOGS],
          backup: [Permission.SYSTEM_BACKUP],
          maintenance: [Permission.SYSTEM_MAINTENANCE],
        },
      };

      const requiredPermissions = resourcePermissions[resource]?.[action];
      if (!requiredPermissions) return false;

      return hasPermission(requiredPermissions);
    },
    [user, hasPermission],
  );

  // Create authorization context value
  const contextValue: AuthorizationContext = useMemo(
    () => ({
      user,
      hasPermission,
      hasRole,
      hasAnyPermission,
      hasAnyRole,
      canAccessResource,
      getEffectivePermissions,
      isHigherRole,
      canManageUser,
    }),
    [
      user,
      hasPermission,
      hasRole,
      hasAnyPermission,
      hasAnyRole,
      canAccessResource,
      getEffectivePermissions,
      isHigherRole,
      canManageUser,
    ],
  );

  return (
    <RBACContext.Provider value={contextValue}>{children}</RBACContext.Provider>
  );
};

// Main RBAC hook
export const useRBAC = (): AuthorizationContext => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
};

// Navigation hook with role-based filtering
export const useNavigation = (): NavigationItem[] => {
  const { hasPermission, hasRole, hasAnyPermission } = useRBAC();

  return useMemo(() => {
    const filterNavigation = (items: NavigationItem[]): NavigationItem[] => {
      return items
        .filter((item) => {
          // If no permissions/roles required, show to everyone
          if (!item.requiredPermissions && !item.requiredRoles) {
            return true;
          }

          let hasAccess = true;

          // Check permissions
          if (item.requiredPermissions && item.requiredPermissions.length > 0) {
            if (item.requireAnyPermission) {
              hasAccess = hasAnyPermission(item.requiredPermissions);
            } else {
              hasAccess = hasPermission(item.requiredPermissions);
            }
          }

          // Check roles
          if (
            hasAccess &&
            item.requiredRoles &&
            item.requiredRoles.length > 0
          ) {
            hasAccess = item.requiredRoles.some((role) => hasRole(role));
          }

          return hasAccess;
        })
        .map((item) => ({
          ...item,
          children: item.children ? filterNavigation(item.children) : undefined,
        }))
        .sort((a, b) => a.order - b.order);
    };

    return filterNavigation(DEFAULT_NAVIGATION);
  }, [hasPermission, hasRole, hasAnyPermission]);
};

// Permission-based component wrapper
export const usePermissionCheck = () => {
  const { hasPermission, hasRole, hasAnyPermission, hasAnyRole } = useRBAC();

  const canAccess = useCallback(
    (config: {
      permissions?: Permission[];
      roles?: UserRole[];
      requireAnyPermission?: boolean;
      requireAnyRole?: boolean;
    }): boolean => {
      let hasAccess = true;

      // Check permissions
      if (config.permissions && config.permissions.length > 0) {
        if (config.requireAnyPermission) {
          hasAccess = hasAnyPermission(config.permissions);
        } else {
          hasAccess = hasPermission(config.permissions);
        }
      }

      // Check roles
      if (hasAccess && config.roles && config.roles.length > 0) {
        if (config.requireAnyRole) {
          hasAccess = hasAnyRole(config.roles);
        } else {
          hasAccess = config.roles.every((role) => hasRole(role));
        }
      }

      return hasAccess;
    },
    [hasPermission, hasRole, hasAnyPermission, hasAnyRole],
  );

  return { canAccess };
};

// Form field access hook
export const useFieldAccess = () => {
  const { user, hasPermission } = useRBAC();

  const getFieldAccess = useCallback(
    (fieldName: string, fieldConfig: any) => {
      if (!user) {
        return { canRead: false, canWrite: false, isRequired: false };
      }

      // Get role-based access
      const roleAccess = fieldConfig.roles?.[user.role];
      let canRead = roleAccess?.read ?? true;
      let canWrite = roleAccess?.write ?? true;
      let isRequired = roleAccess?.required ?? false;

      // Check permission-based access
      if (fieldConfig.permissions) {
        if (fieldConfig.permissions.read) {
          canRead = canRead && hasPermission(fieldConfig.permissions.read);
        }
        if (fieldConfig.permissions.write) {
          canWrite = canWrite && hasPermission(fieldConfig.permissions.write);
        }
      }

      return { canRead, canWrite, isRequired };
    },
    [user, hasPermission],
  );

  return { getFieldAccess };
};

// Data filtering hook for role-based data access
export const useDataFilter = () => {
  const { user, hasPermission } = useRBAC();

  const getDataFilters = useCallback(
    (resource: string) => {
      if (!user) return [];

      const filters: any[] = [];

      // Apply role-based filters
      switch (resource) {
        case "reports":
          if (!hasPermission(Permission.REPORTS_VIEW_ALL)) {
            // Citizens can only see their own reports
            filters.push({
              field: "created_by",
              operator: "eq",
              value: user.id,
            });
          }
          break;

        case "users":
          if (user.role === UserRole.OFFICER) {
            // Officers can only see citizens
            filters.push({
              field: "role",
              operator: "eq",
              value: UserRole.CITIZEN,
            });
          } else if (user.role === UserRole.ADMIN) {
            // Admins can see officers and citizens
            filters.push({
              field: "role",
              operator: "in",
              value: [UserRole.OFFICER, UserRole.CITIZEN],
            });
          }
          break;

        case "audit_logs":
          if (!hasPermission(Permission.SYSTEM_AUDIT_LOGS)) {
            // If no system audit permission, only show own actions
            filters.push({
              field: "user_id",
              operator: "eq",
              value: user.id,
            });
          }
          break;
      }

      return filters;
    },
    [user, hasPermission],
  );

  return { getDataFilters };
};

// Role badge configuration
export const useRoleBadge = () => {
  const getRoleBadge = useCallback((role: UserRole) => {
    const configs = {
      [UserRole.CITIZEN]: {
        label: "Citizen",
        color: "bg-blue-100 text-blue-800",
        icon: "User",
      },
      [UserRole.OFFICER]: {
        label: "Officer",
        color: "bg-green-100 text-green-800",
        icon: "Shield",
      },
      [UserRole.ADMIN]: {
        label: "Admin",
        color: "bg-purple-100 text-purple-800",
        icon: "Crown",
      },
      [UserRole.SUPER_ADMIN]: {
        label: "Super Admin",
        color: "bg-red-100 text-red-800",
        icon: "Settings",
      },
    };

    return configs[role] || configs[UserRole.CITIZEN];
  }, []);

  return { getRoleBadge };
};

// Export additional utilities
export * from "@/types/rbac";
