/**
 * Authorization Middleware Hook
 * Provides middleware functionality for protecting API calls and routes
 */

import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRBAC } from "./useRBAC";
import { UserRole, Permission } from "@/types/rbac";
import { toast } from "@/hooks/use-toast";

interface AuthMiddlewareConfig {
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  requireAnyPermission?: boolean;
  requireAnyRole?: boolean;
  redirectTo?: string;
  showToast?: boolean;
  onUnauthorized?: () => void;
}

interface ApiRequestConfig {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
}

interface AuthorizedApiResponse<T = any> {
  data?: T;
  error?: string;
  unauthorized?: boolean;
  status: number;
}

// Main authorization middleware hook
export const useAuthMiddleware = () => {
  const { user, hasPermission, hasRole, hasAnyPermission, hasAnyRole } =
    useRBAC();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Check if user meets authorization requirements
   */
  const checkAuthorization = useCallback(
    (config: AuthMiddlewareConfig): boolean => {
      if (!user) return false;

      let hasAccess = true;

      // Check permissions
      if (config.requiredPermissions && config.requiredPermissions.length > 0) {
        if (config.requireAnyPermission) {
          hasAccess = hasAnyPermission(config.requiredPermissions);
        } else {
          hasAccess = hasPermission(config.requiredPermissions);
        }
      }

      // Check roles
      if (
        hasAccess &&
        config.requiredRoles &&
        config.requiredRoles.length > 0
      ) {
        if (config.requireAnyRole) {
          hasAccess = hasAnyRole(config.requiredRoles);
        } else {
          hasAccess = config.requiredRoles.every((role) => hasRole(role));
        }
      }

      return hasAccess;
    },
    [user, hasPermission, hasRole, hasAnyPermission, hasAnyRole],
  );

  /**
   * Protect a route with authorization middleware
   */
  const protectRoute = useCallback(
    (config: AuthMiddlewareConfig) => {
      const isAuthorized = checkAuthorization(config);

      if (!isAuthorized) {
        if (config.showToast !== false) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
        }

        if (config.onUnauthorized) {
          config.onUnauthorized();
        } else if (config.redirectTo) {
          navigate(config.redirectTo, {
            state: { from: location.pathname },
            replace: true,
          });
        } else {
          // Default redirect based on user status
          if (!user) {
            navigate("/login", {
              state: { from: location.pathname },
              replace: true,
            });
          } else {
            navigate("/", { replace: true });
          }
        }
      }

      return isAuthorized;
    },
    [checkAuthorization, navigate, location, user],
  );

  /**
   * Make authorized API request
   */
  const authorizedFetch = useCallback(
    async <T = any>(
      config: ApiRequestConfig,
    ): Promise<AuthorizedApiResponse<T>> => {
      // Check authorization before making request
      const authConfig: AuthMiddlewareConfig = {
        requiredPermissions: config.requiredPermissions,
        requiredRoles: config.requiredRoles,
        showToast: false,
      };

      if (!checkAuthorization(authConfig)) {
        return {
          error: "Unauthorized: Insufficient permissions",
          unauthorized: true,
          status: 403,
        };
      }

      try {
        const headers = {
          "Content-Type": "application/json",
          ...config.headers,
        };

        // Add authorization headers (would typically include JWT token)
        if (user) {
          headers["Authorization"] = `Bearer ${user.id}`; // Placeholder
          headers["X-User-Role"] = user.role;
          headers["X-User-Permissions"] = user.permissions.join(",");
        }

        const response = await fetch(config.url, {
          method: config.method || "GET",
          headers,
          body: config.body ? JSON.stringify(config.body) : undefined,
          credentials: "include",
        });

        if (response.status === 401) {
          return {
            error: "Authentication required",
            unauthorized: true,
            status: 401,
          };
        }

        if (response.status === 403) {
          return {
            error: "Insufficient permissions",
            unauthorized: true,
            status: 403,
          };
        }

        if (!response.ok) {
          return {
            error: `Request failed with status ${response.status}`,
            status: response.status,
          };
        }

        const data = await response.json();
        return {
          data,
          status: response.status,
        };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Network error",
          status: 0,
        };
      }
    },
    [checkAuthorization, user],
  );

  /**
   * Check if current route is authorized
   */
  const isCurrentRouteAuthorized = useCallback(
    (config: AuthMiddlewareConfig): boolean => {
      return checkAuthorization(config);
    },
    [checkAuthorization],
  );

  /**
   * Get authorization status for multiple permissions/roles
   */
  const getAuthorizationStatus = useCallback(
    (
      items: {
        permissions?: Permission[];
        roles?: UserRole[];
      }[],
    ) => {
      return items.map((item) => ({
        permissions: item.permissions,
        roles: item.roles,
        authorized: checkAuthorization({
          requiredPermissions: item.permissions,
          requiredRoles: item.roles,
        }),
      }));
    },
    [checkAuthorization],
  );

  /**
   * Create authorized action wrapper
   */
  const createAuthorizedAction = useCallback(
    (config: AuthMiddlewareConfig, action: () => void | Promise<void>) => {
      return async () => {
        if (checkAuthorization(config)) {
          await action();
        } else {
          if (config.showToast !== false) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to perform this action.",
              variant: "destructive",
            });
          }

          if (config.onUnauthorized) {
            config.onUnauthorized();
          }
        }
      };
    },
    [checkAuthorization],
  );

  /**
   * Data filtering middleware
   */
  const applyDataFilters = useCallback(
    <T extends Record<string, any>>(data: T[], resource: string): T[] => {
      if (!user) return [];

      // Apply role-based data filtering
      switch (resource) {
        case "reports":
          if (!hasPermission(Permission.REPORTS_VIEW_ALL)) {
            // Citizens can only see their own reports
            return data.filter(
              (item) =>
                item.created_by === user.id || item.reporter_id === user.id,
            );
          }
          break;

        case "users":
          if (user.role === UserRole.OFFICER) {
            // Officers can only see citizens and their own data
            return data.filter(
              (item) => item.role === UserRole.CITIZEN || item.id === user.id,
            );
          } else if (user.role === UserRole.ADMIN) {
            // Admins can see officers and citizens
            return data.filter(
              (item) =>
                [UserRole.OFFICER, UserRole.CITIZEN].includes(item.role) ||
                item.id === user.id,
            );
          }
          break;

        case "audit_logs":
          if (!hasPermission(Permission.SYSTEM_AUDIT_LOGS)) {
            // If no system audit permission, only show own actions
            return data.filter((item) => item.user_id === user.id);
          }
          break;

        default:
          break;
      }

      return data;
    },
    [user, hasPermission],
  );

  /**
   * Field-level authorization check
   */
  const canAccessField = useCallback(
    (fieldName: string, mode: "read" | "write", fieldConfig?: any): boolean => {
      if (!user) return false;

      // Default to allowing access if no config
      if (!fieldConfig) return true;

      const roleAccess = fieldConfig.roles?.[user.role];
      let hasAccess = roleAccess?.[mode] ?? true;

      // Check permission-based access
      if (fieldConfig.permissions) {
        const requiredPermissions = fieldConfig.permissions[mode];
        if (requiredPermissions) {
          hasAccess = hasAccess && hasPermission(requiredPermissions);
        }
      }

      return hasAccess;
    },
    [user, hasPermission],
  );

  return {
    protectRoute,
    authorizedFetch,
    isCurrentRouteAuthorized,
    getAuthorizationStatus,
    createAuthorizedAction,
    applyDataFilters,
    canAccessField,
    checkAuthorization,
  };
};

// Route protection hook for individual pages
export const useRouteProtection = (config: AuthMiddlewareConfig) => {
  const { protectRoute } = useAuthMiddleware();

  useEffect(() => {
    protectRoute(config);
  }, [protectRoute, config]);
};

// API middleware hook for data fetching
export const useAuthorizedAPI = () => {
  const { authorizedFetch, applyDataFilters } = useAuthMiddleware();

  const get = useCallback(
    <T = any>(
      url: string,
      config?: Omit<ApiRequestConfig, "url" | "method">,
    ) => {
      return authorizedFetch<T>({ ...config, url, method: "GET" });
    },
    [authorizedFetch],
  );

  const post = useCallback(
    <T = any>(
      url: string,
      body?: any,
      config?: Omit<ApiRequestConfig, "url" | "method" | "body">,
    ) => {
      return authorizedFetch<T>({ ...config, url, method: "POST", body });
    },
    [authorizedFetch],
  );

  const put = useCallback(
    <T = any>(
      url: string,
      body?: any,
      config?: Omit<ApiRequestConfig, "url" | "method" | "body">,
    ) => {
      return authorizedFetch<T>({ ...config, url, method: "PUT", body });
    },
    [authorizedFetch],
  );

  const del = useCallback(
    <T = any>(
      url: string,
      config?: Omit<ApiRequestConfig, "url" | "method">,
    ) => {
      return authorizedFetch<T>({ ...config, url, method: "DELETE" });
    },
    [authorizedFetch],
  );

  return {
    get,
    post,
    put,
    delete: del,
    applyDataFilters,
  };
};

// Permission-based component visibility hook
export const useConditionalRender = () => {
  const { checkAuthorization } = useAuthMiddleware();

  const shouldRender = useCallback(
    (config: AuthMiddlewareConfig): boolean => {
      return checkAuthorization(config);
    },
    [checkAuthorization],
  );

  return { shouldRender };
};

export default useAuthMiddleware;
