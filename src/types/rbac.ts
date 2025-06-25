/**
 * Role-Based Access Control (RBAC) Types and Permissions
 * Defines roles, permissions, and hierarchical access control for the government portal
 */

// User roles with hierarchy levels
export enum UserRole {
  CITIZEN = "citizen",
  OFFICER = "officer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// Granular permissions system
export enum Permission {
  // Report permissions
  REPORTS_VIEW_OWN = "reports:view:own",
  REPORTS_VIEW_ALL = "reports:view:all",
  REPORTS_CREATE = "reports:create",
  REPORTS_UPDATE_OWN = "reports:update:own",
  REPORTS_UPDATE_ALL = "reports:update:all",
  REPORTS_DELETE_OWN = "reports:delete:own",
  REPORTS_DELETE_ALL = "reports:delete:all",
  REPORTS_ASSIGN = "reports:assign",
  REPORTS_ESCALATE = "reports:escalate",
  REPORTS_RESOLVE = "reports:resolve",
  REPORTS_EXPORT = "reports:export",
  REPORTS_BULK_OPERATIONS = "reports:bulk_operations",

  // User management permissions
  USERS_VIEW_ALL = "users:view:all",
  USERS_CREATE = "users:create",
  USERS_UPDATE = "users:update",
  USERS_DELETE = "users:delete",
  USERS_MANAGE_ROLES = "users:manage_roles",
  USERS_BULK_OPERATIONS = "users:bulk_operations",
  USERS_IMPERSONATE = "users:impersonate",

  // Analytics and dashboard permissions
  ANALYTICS_VIEW_BASIC = "analytics:view:basic",
  ANALYTICS_VIEW_ADVANCED = "analytics:view:advanced",
  ANALYTICS_EXPORT = "analytics:export",
  DASHBOARD_ADMIN = "dashboard:admin",
  DASHBOARD_OFFICER = "dashboard:officer",

  // System permissions
  SYSTEM_CONFIG = "system:config",
  SYSTEM_AUDIT_LOGS = "system:audit_logs",
  SYSTEM_BACKUP = "system:backup",
  SYSTEM_MAINTENANCE = "system:maintenance",

  // Data permissions
  DATA_EXPORT = "data:export",
  DATA_IMPORT = "data:import",
  DATA_PURGE = "data:purge",

  // Community and education permissions
  COMMUNITY_MODERATE = "community:moderate",
  EDUCATION_MANAGE = "education:manage",

  // Evidence permissions
  EVIDENCE_VIEW = "evidence:view",
  EVIDENCE_UPLOAD = "evidence:upload",
  EVIDENCE_DELETE = "evidence:delete",

  // Communication permissions
  NOTIFICATIONS_SEND = "notifications:send",
  NOTIFICATIONS_BROADCAST = "notifications:broadcast",
}

// Role hierarchy levels (higher number = more privileges)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.CITIZEN]: 1,
  [UserRole.OFFICER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CITIZEN]: [
    Permission.REPORTS_VIEW_OWN,
    Permission.REPORTS_CREATE,
    Permission.REPORTS_UPDATE_OWN,
    Permission.REPORTS_DELETE_OWN,
    Permission.EVIDENCE_VIEW,
    Permission.EVIDENCE_UPLOAD,
    Permission.ANALYTICS_VIEW_BASIC,
  ],

  [UserRole.OFFICER]: [
    // All citizen permissions
    ...ROLE_PERMISSIONS[UserRole.CITIZEN],

    // Additional officer permissions
    Permission.REPORTS_VIEW_ALL,
    Permission.REPORTS_UPDATE_ALL,
    Permission.REPORTS_ASSIGN,
    Permission.REPORTS_RESOLVE,
    Permission.DASHBOARD_OFFICER,
    Permission.EVIDENCE_DELETE,
    Permission.COMMUNITY_MODERATE,
    Permission.NOTIFICATIONS_SEND,
  ],

  [UserRole.ADMIN]: [
    // All officer permissions
    ...ROLE_PERMISSIONS[UserRole.OFFICER],

    // Additional admin permissions
    Permission.REPORTS_DELETE_ALL,
    Permission.REPORTS_ESCALATE,
    Permission.REPORTS_EXPORT,
    Permission.REPORTS_BULK_OPERATIONS,
    Permission.USERS_VIEW_ALL,
    Permission.USERS_CREATE,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.USERS_MANAGE_ROLES,
    Permission.USERS_BULK_OPERATIONS,
    Permission.ANALYTICS_VIEW_ADVANCED,
    Permission.ANALYTICS_EXPORT,
    Permission.DASHBOARD_ADMIN,
    Permission.SYSTEM_AUDIT_LOGS,
    Permission.DATA_EXPORT,
    Permission.DATA_IMPORT,
    Permission.EDUCATION_MANAGE,
    Permission.NOTIFICATIONS_BROADCAST,
  ],

  [UserRole.SUPER_ADMIN]: [
    // All admin permissions
    ...ROLE_PERMISSIONS[UserRole.ADMIN],

    // Additional super admin permissions
    Permission.USERS_IMPERSONATE,
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_BACKUP,
    Permission.SYSTEM_MAINTENANCE,
    Permission.DATA_PURGE,
  ],
};

// User interface with RBAC fields
export interface RBACUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  customPermissions?: Permission[]; // Additional permissions beyond role defaults
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  department?: string;
  employeeId?: string;
  metadata: {
    loginCount: number;
    lastActivityAt?: Date;
    securityClearance?: string;
    temporaryAccess?: {
      permissions: Permission[];
      expiresAt: Date;
      grantedBy: string;
      reason: string;
    };
  };
}

// Role change audit interface
export interface RoleChangeAudit {
  id: string;
  userId: string;
  oldRole: UserRole;
  newRole: UserRole;
  oldPermissions: Permission[];
  newPermissions: Permission[];
  changedBy: string;
  reason: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

// Navigation item interface with permissions
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  requireAnyPermission?: boolean; // If true, user needs ANY of the permissions
  children?: NavigationItem[];
  badge?: string;
  isExternal?: boolean;
  order: number;
}

// Form field access control
export interface FieldAccessControl {
  fieldName: string;
  roles: {
    [key in UserRole]?: {
      read: boolean;
      write: boolean;
      required?: boolean;
    };
  };
  permissions?: {
    read?: Permission[];
    write?: Permission[];
  };
}

// Bulk operation interface
export interface BulkOperation {
  id: string;
  type: "role_change" | "activate" | "deactivate" | "delete" | "export";
  userIds: string[];
  parameters?: {
    newRole?: UserRole;
    reason?: string;
    additionalPermissions?: Permission[];
  };
  createdBy: string;
  createdAt: Date;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress?: {
    total: number;
    completed: number;
    failed: number;
  };
  results?: {
    successful: string[];
    failed: Array<{
      userId: string;
      error: string;
    }>;
  };
}

// Authorization context interface
export interface AuthorizationContext {
  user: RBACUser | null;
  hasPermission: (permission: Permission | Permission[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessResource: (resource: string, action: string) => boolean;
  getEffectivePermissions: () => Permission[];
  isHigherRole: (targetRole: UserRole) => boolean;
  canManageUser: (targetUser: RBACUser) => boolean;
}

// Data filtering interface
export interface DataFilter {
  field: string;
  operator: "eq" | "ne" | "in" | "not_in" | "gte" | "lte" | "like" | "is_null";
  value: any;
  appliesTo: UserRole[];
}

// Resource access patterns
export interface ResourceAccess {
  resource: string;
  actions: {
    [action: string]: {
      requiredPermissions: Permission[];
      requiredRoles?: UserRole[];
      dataFilters?: DataFilter[];
    };
  };
}

// Role template for quick role assignment
export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  role: UserRole;
  additionalPermissions: Permission[];
  restrictions?: Permission[]; // Permissions to exclude from default role permissions
  department?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

// Permission group for organizing permissions in UI
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  icon?: string;
  order: number;
}

// Department-based access control
export interface Department {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  allowedRoles: UserRole[];
  parentDepartment?: string;
  isActive: boolean;
}

// Temporary access request
export interface AccessRequest {
  id: string;
  requesterId: string;
  requestedPermissions: Permission[];
  requestedRole?: UserRole;
  reason: string;
  duration: number; // in hours
  urgency: "low" | "medium" | "high" | "critical";
  status: "pending" | "approved" | "rejected" | "expired";
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  expiresAt?: Date;
}

// Constants for permission grouping
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "reports",
    name: "Report Management",
    description: "Permissions for managing fraud reports",
    permissions: [
      Permission.REPORTS_VIEW_OWN,
      Permission.REPORTS_VIEW_ALL,
      Permission.REPORTS_CREATE,
      Permission.REPORTS_UPDATE_OWN,
      Permission.REPORTS_UPDATE_ALL,
      Permission.REPORTS_DELETE_OWN,
      Permission.REPORTS_DELETE_ALL,
      Permission.REPORTS_ASSIGN,
      Permission.REPORTS_ESCALATE,
      Permission.REPORTS_RESOLVE,
      Permission.REPORTS_EXPORT,
      Permission.REPORTS_BULK_OPERATIONS,
    ],
    icon: "FileText",
    order: 1,
  },
  {
    id: "users",
    name: "User Management",
    description: "Permissions for managing users and roles",
    permissions: [
      Permission.USERS_VIEW_ALL,
      Permission.USERS_CREATE,
      Permission.USERS_UPDATE,
      Permission.USERS_DELETE,
      Permission.USERS_MANAGE_ROLES,
      Permission.USERS_BULK_OPERATIONS,
      Permission.USERS_IMPERSONATE,
    ],
    icon: "Users",
    order: 2,
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    description: "Permissions for viewing analytics and generating reports",
    permissions: [
      Permission.ANALYTICS_VIEW_BASIC,
      Permission.ANALYTICS_VIEW_ADVANCED,
      Permission.ANALYTICS_EXPORT,
    ],
    icon: "BarChart3",
    order: 3,
  },
  {
    id: "system",
    name: "System Administration",
    description: "System-level administrative permissions",
    permissions: [
      Permission.SYSTEM_CONFIG,
      Permission.SYSTEM_AUDIT_LOGS,
      Permission.SYSTEM_BACKUP,
      Permission.SYSTEM_MAINTENANCE,
    ],
    icon: "Settings",
    order: 4,
  },
  {
    id: "data",
    name: "Data Management",
    description: "Permissions for data operations",
    permissions: [
      Permission.DATA_EXPORT,
      Permission.DATA_IMPORT,
      Permission.DATA_PURGE,
    ],
    icon: "Database",
    order: 5,
  },
  {
    id: "community",
    name: "Community & Education",
    description: "Permissions for community and educational content",
    permissions: [Permission.COMMUNITY_MODERATE, Permission.EDUCATION_MANAGE],
    icon: "Users2",
    order: 6,
  },
];

// Default navigation structure
export const DEFAULT_NAVIGATION: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    icon: "Home",
    order: 1,
  },
  {
    id: "my-reports",
    label: "My Reports",
    path: "/reports",
    icon: "FileText",
    requiredPermissions: [Permission.REPORTS_VIEW_OWN],
    order: 2,
  },
  {
    id: "create-report",
    label: "Create Report",
    path: "/reports/create",
    icon: "Plus",
    requiredPermissions: [Permission.REPORTS_CREATE],
    order: 3,
  },
  {
    id: "all-reports",
    label: "All Reports",
    path: "/admin/reports",
    icon: "Files",
    requiredPermissions: [Permission.REPORTS_VIEW_ALL],
    order: 4,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: "BarChart3",
    requiredPermissions: [Permission.ANALYTICS_VIEW_BASIC],
    order: 5,
  },
  {
    id: "user-management",
    label: "User Management",
    path: "/admin/users",
    icon: "Users",
    requiredPermissions: [Permission.USERS_VIEW_ALL],
    order: 6,
  },
  {
    id: "admin-dashboard",
    label: "Admin Dashboard",
    path: "/admin",
    icon: "LayoutDashboard",
    requiredPermissions: [Permission.DASHBOARD_ADMIN],
    order: 7,
  },
  {
    id: "system",
    label: "System",
    path: "/admin/system",
    icon: "Settings",
    requiredPermissions: [Permission.SYSTEM_CONFIG],
    order: 8,
  },
];

// Utility types
export type PermissionCheck = (
  permission: Permission | Permission[],
) => boolean;
export type RoleCheck = (role: UserRole | UserRole[]) => boolean;
