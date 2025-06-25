/**
 * Admin User Management Dashboard
 * Comprehensive user management with role assignment, bulk operations, and audit trails
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Activity,
  UserPlus,
  Settings,
  Crown,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { ProtectedComponent, RoleBadge } from "./ProtectedComponent";
import {
  UserRole,
  Permission,
  RBACUser,
  BulkOperation,
  RoleChangeAudit,
  PERMISSION_GROUPS,
} from "@/types/rbac";

interface UserManagementProps {
  className?: string;
}

interface UserFormData {
  email: string;
  fullName: string;
  role: UserRole;
  customPermissions: Permission[];
  department?: string;
  employeeId?: string;
  isActive: boolean;
}

interface BulkOperationFormData {
  operation: "role_change" | "activate" | "deactivate" | "delete";
  newRole?: UserRole;
  reason: string;
}

// Mock data for demonstration
const mockUsers: RBACUser[] = [
  {
    id: "1",
    email: "john.doe@govt.in",
    fullName: "John Doe",
    role: UserRole.ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: new Date("2024-01-15T10:30:00"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-15"),
    department: "Cyber Crime",
    employeeId: "EMP001",
    metadata: {
      loginCount: 245,
      lastActivityAt: new Date("2024-01-15T14:30:00"),
      securityClearance: "Level 2",
    },
  },
  {
    id: "2",
    email: "sarah.smith@govt.in",
    fullName: "Sarah Smith",
    role: UserRole.OFFICER,
    permissions: [],
    isActive: true,
    lastLogin: new Date("2024-01-14T16:45:00"),
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-14"),
    department: "Financial Crimes",
    employeeId: "EMP002",
    metadata: {
      loginCount: 128,
      lastActivityAt: new Date("2024-01-14T17:00:00"),
    },
  },
  {
    id: "3",
    email: "mike.wilson@citizen.in",
    fullName: "Mike Wilson",
    role: UserRole.CITIZEN,
    permissions: [],
    isActive: true,
    lastLogin: new Date("2024-01-13T09:15:00"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-13"),
    metadata: {
      loginCount: 15,
      lastActivityAt: new Date("2024-01-13T10:30:00"),
    },
  },
];

const mockAuditLogs: RoleChangeAudit[] = [
  {
    id: "1",
    userId: "2",
    oldRole: UserRole.CITIZEN,
    newRole: UserRole.OFFICER,
    oldPermissions: [],
    newPermissions: [],
    changedBy: "1",
    reason: "Promotion to Officer position",
    timestamp: new Date("2024-01-10T14:30:00"),
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    approved: true,
    approvedBy: "1",
    approvedAt: new Date("2024-01-10T14:35:00"),
  },
];

export const AdminUserManagement: React.FC<UserManagementProps> = ({
  className = "",
}) => {
  const { user, hasPermission, canManageUser } = useRBAC();
  const [users, setUsers] = useState<RBACUser[]>(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RBACUser | null>(null);
  const [bulkOperation, setBulkOperation] = useState<BulkOperation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.isActive) ||
      (statusFilter === "inactive" && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Create/Edit User Form
  const UserForm: React.FC<{
    user?: RBACUser;
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
  }> = ({ user: editUser, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<UserFormData>({
      email: editUser?.email || "",
      fullName: editUser?.fullName || "",
      role: editUser?.role || UserRole.CITIZEN,
      customPermissions: editUser?.customPermissions || [],
      department: editUser?.department || "",
      employeeId: editUser?.employeeId || "",
      isActive: editUser?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const togglePermission = (permission: Permission) => {
      setFormData((prev) => ({
        ...prev,
        customPermissions: prev.customPermissions.includes(permission)
          ? prev.customPermissions.filter((p) => p !== permission)
          : [...prev.customPermissions, permission],
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value as UserRole }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center space-x-2">
                      <RoleBadge role={role} size="sm" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, employeeId: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: Boolean(checked) }))
              }
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>
        </div>

        {/* Custom Permissions */}
        <div className="space-y-4">
          <Label>Additional Permissions</Label>
          <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.id} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">
                  {group.name}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission}
                        checked={formData.customPermissions.includes(
                          permission,
                        )}
                        onCheckedChange={() => togglePermission(permission)}
                      />
                      <Label htmlFor={permission} className="text-xs">
                        {permission.replace(/[_:]/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {editUser ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    );
  };

  // Bulk Operations Form
  const BulkOperationsForm: React.FC<{
    selectedCount: number;
    onSubmit: (data: BulkOperationFormData) => void;
    onCancel: () => void;
  }> = ({ selectedCount, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<BulkOperationFormData>({
      operation: "role_change",
      reason: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This operation will affect {selectedCount} selected users.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="operation">Operation</Label>
          <Select
            value={formData.operation}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                operation: value as BulkOperationFormData["operation"],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role_change">Change Role</SelectItem>
              <SelectItem value="activate">Activate Users</SelectItem>
              <SelectItem value="deactivate">Deactivate Users</SelectItem>
              <SelectItem value="delete">Delete Users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.operation === "role_change" && (
          <div className="space-y-2">
            <Label htmlFor="newRole">New Role</Label>
            <Select
              value={formData.newRole}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  newRole: value as UserRole,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    <RoleBadge role={role} size="sm" />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="Provide a reason for this bulk operation..."
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={
              formData.operation === "delete" ? "destructive" : "default"
            }
          >
            Execute Operation
          </Button>
        </div>
      </form>
    );
  };

  // Handle user creation/editing
  const handleUserSubmit = (data: UserFormData) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...data, updatedAt: new Date() }
            : u,
        ),
      );
      setEditingUser(null);
    } else {
      const newUser: RBACUser = {
        id: Date.now().toString(),
        ...data,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.id,
        metadata: {
          loginCount: 0,
        },
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setIsCreateModalOpen(false);
  };

  // Handle bulk operations
  const handleBulkSubmit = (data: BulkOperationFormData) => {
    const operation: BulkOperation = {
      id: Date.now().toString(),
      type: data.operation,
      userIds: selectedUsers,
      parameters: {
        newRole: data.newRole,
        reason: data.reason,
      },
      createdBy: user?.id || "",
      createdAt: new Date(),
      status: "in_progress",
      progress: {
        total: selectedUsers.length,
        completed: 0,
        failed: 0,
      },
    };

    setBulkOperation(operation);
    setIsBulkModalOpen(false);

    // Simulate bulk operation
    setTimeout(() => {
      setBulkOperation((prev) =>
        prev ? { ...prev, status: "completed" } : null,
      );

      if (data.operation === "role_change" && data.newRole) {
        setUsers((prev) =>
          prev.map((u) =>
            selectedUsers.includes(u.id)
              ? { ...u, role: data.newRole!, updatedAt: new Date() }
              : u,
          ),
        );
      }

      setSelectedUsers([]);
    }, 2000);
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Select all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  return (
    <ProtectedComponent
      permissions={[Permission.USERS_VIEW_ALL]}
      className={className}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage users, roles, and permissions
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <ProtectedComponent permissions={[Permission.USERS_CREATE]}>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </ProtectedComponent>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsAuditModalOpen(true)}>
                  <Activity className="h-4 w-4 mr-2" />
                  View Audit Log
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bulk Operation Progress */}
        {bulkOperation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {bulkOperation.status === "in_progress" && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                {bulkOperation.status === "completed" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                Bulk Operation: {bulkOperation.type.replace("_", " ")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={bulkOperation.status === "completed" ? 100 : 50}
                className="mb-2"
              />
              <p className="text-sm text-gray-600">
                {bulkOperation.status === "completed"
                  ? `Operation completed successfully for ${bulkOperation.userIds.length} users`
                  : `Processing ${bulkOperation.userIds.length} users...`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={roleFilter}
                onValueChange={(value) =>
                  setRoleFilter(value as UserRole | "all")
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      <RoleBadge role={role} size="sm" />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as typeof statusFilter)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedUsers.length} users selected
                </span>
                <ProtectedComponent
                  permissions={[Permission.USERS_BULK_OPERATIONS]}
                >
                  <Button size="sm" onClick={() => setIsBulkModalOpen(true)}>
                    Bulk Actions
                  </Button>
                </ProtectedComponent>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(userItem.id)}
                        onCheckedChange={() => toggleUserSelection(userItem.id)}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {userItem.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{userItem.fullName}</p>
                          <p className="text-sm text-gray-500">
                            {userItem.email}
                          </p>
                          {userItem.employeeId && (
                            <p className="text-xs text-gray-400">
                              ID: {userItem.employeeId}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={userItem.role} />
                    </TableCell>

                    <TableCell>
                      <span className="text-sm">
                        {userItem.department || "-"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={userItem.isActive ? "default" : "secondary"}
                      >
                        {userItem.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {userItem.lastLogin ? (
                          <div>
                            <p>{userItem.lastLogin.toLocaleDateString()}</p>
                            <p className="text-gray-500">
                              {userItem.lastLogin.toLocaleTimeString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingUser(userItem)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="h-4 w-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {userItem.isActive ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <ProtectedComponent
                            permissions={[Permission.USERS_DELETE]}
                          >
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </ProtectedComponent>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit User Modal */}
        <Dialog
          open={isCreateModalOpen || !!editingUser}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateModalOpen(false);
              setEditingUser(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Create New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update user information, role, and permissions."
                  : "Add a new user to the system with appropriate role and permissions."}
              </DialogDescription>
            </DialogHeader>

            <UserForm
              user={editingUser || undefined}
              onSubmit={handleUserSubmit}
              onCancel={() => {
                setIsCreateModalOpen(false);
                setEditingUser(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Bulk Operations Modal */}
        <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Operations</DialogTitle>
              <DialogDescription>
                Perform operations on multiple users at once.
              </DialogDescription>
            </DialogHeader>

            <BulkOperationsForm
              selectedCount={selectedUsers.length}
              onSubmit={handleBulkSubmit}
              onCancel={() => setIsBulkModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Audit Log Modal */}
        <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Role Change Audit Log</DialogTitle>
              <DialogDescription>
                View history of role and permission changes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockAuditLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RoleBadge role={log.oldRole} size="sm" />
                          <span>→</span>
                          <RoleBadge role={log.newRole} size="sm" />
                        </div>
                        <div>
                          <p className="font-medium">User ID: {log.userId}</p>
                          <p className="text-sm text-gray-500">{log.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {log.timestamp.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {log.changedBy}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedComponent>
  );
};

export default AdminUserManagement;
