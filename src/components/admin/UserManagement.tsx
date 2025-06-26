import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Ban,
  Eye,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const {
    users,
    usersLoading: loading,
    usersError: error,
    fetchUsers: refetch,
    updateUserStatus,
    userFilters,
    setUserFilters,
    selectedUser,
    setSelectedUser,
  } = useAdmin();
  const { toast } = useToast();

  const [userDialog, setUserDialog] = useState<{
    open: boolean;
    action: "view" | "edit" | "suspend" | "activate" | null;
    userId: string;
  }>({ open: false, action: null, userId: "" });
  const [actionReason, setActionReason] = useState("");

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !userFilters.search ||
        user.full_name
          ?.toLowerCase()
          .includes(userFilters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(userFilters.search.toLowerCase());

      const matchesRole =
        !userFilters.role ||
        userFilters.role === "all" ||
        user.role === userFilters.role;
      const matchesStatus =
        !userFilters.status ||
        userFilters.status === "all" ||
        user.status === userFilters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, userFilters]);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "user":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const handleUserAction = (
    action: "view" | "edit" | "suspend" | "activate",
    userId: string,
  ) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setUserDialog({ open: true, action, userId });
  };

  const handleActionConfirm = async () => {
    if (!userDialog.action || !userDialog.userId) return;

    try {
      if (userDialog.action === "suspend") {
        await updateUserStatus(userDialog.userId, "suspended", actionReason);
      } else if (userDialog.action === "activate") {
        await updateUserStatus(userDialog.userId, "active", actionReason);
      }

      setUserDialog({ open: false, action: null, userId: "" });
      setSelectedUser(null);
      setActionReason("");
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">
                Failed to load users: {error}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredUsers.length} users found
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button className="bg-india-saffron hover:bg-saffron-600">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={userFilters.search || ""}
                  onChange={(e) =>
                    setUserFilters({ ...userFilters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <Select
                value={userFilters.role || "all"}
                onValueChange={(value) =>
                  setUserFilters({
                    ...userFilters,
                    role: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Regular Users</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={userFilters.status || "all"}
                onValueChange={(value) =>
                  setUserFilters({
                    ...userFilters,
                    status: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? `No users match "${searchTerm}"`
                    : "No users have been registered yet."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Amount Reported</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.full_name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.reports_count}</TableCell>
                      <TableCell className="font-medium">
                        ₹{user.total_amount_reported?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.risk_score > 5 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span
                            className={
                              user.risk_score > 5
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {user.risk_score.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.last_seen
                          ? new Date(user.last_seen).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction("view", user.id)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction("edit", user.id)}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                handleUserAction("suspend", user.id)
                              }
                              title="Suspend User"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() =>
                                handleUserAction("activate", user.id)
                              }
                              title="Activate User"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Action Dialog */}
      <Dialog
        open={userDialog.open}
        onOpenChange={(open) =>
          !open && setUserDialog({ open: false, action: null, userId: "" })
        }
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {userDialog.action === "view" && "User Details"}
              {userDialog.action === "edit" && "Edit User"}
              {userDialog.action === "suspend" && "Suspend User"}
              {userDialog.action === "activate" && "Activate User"}
            </DialogTitle>
            <DialogDescription>
              {userDialog.action === "view" &&
                "View user profile information and activity."}
              {userDialog.action === "edit" &&
                "Modify user account settings and permissions."}
              {userDialog.action === "suspend" &&
                "Temporarily disable this user account."}
              {userDialog.action === "activate" &&
                "Re-enable this user account."}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.full_name || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status.charAt(0).toUpperCase() +
                      selectedUser.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Reports Submitted
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.reports_count}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Join Date</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Seen</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.last_seen
                      ? new Date(selectedUser.last_seen).toLocaleDateString()
                      : "Never logged in"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setUserDialog({ open: false, action: null, userId: "" })
              }
            >
              {userDialog.action === "view" ? "Close" : "Cancel"}
            </Button>
            {userDialog.action !== "view" && (
              <Button
                onClick={handleActionConfirm}
                className={
                  userDialog.action === "suspend"
                    ? "bg-red-600 hover:bg-red-700"
                    : userDialog.action === "activate"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                }
              >
                {userDialog.action === "suspend" && "Suspend User"}
                {userDialog.action === "activate" && "Activate User"}
                {userDialog.action === "edit" && "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
