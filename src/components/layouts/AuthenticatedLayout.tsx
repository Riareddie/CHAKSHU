/**
 * Authenticated Layout Component
 * Layout for authenticated users with full navigation and features
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Menu,
  Bell,
  Settings,
  LogOut,
  User,
  BarChart3,
  FileText,
  Users,
  Search,
  Brain,
  Globe,
  Smartphone,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Crown,
} from "lucide-react";
import { useAdminAuth, UserRole } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/language/LanguageSelector";
import EnhancedNotificationCenter from "@/components/notifications/EnhancedNotificationCenter";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const AuthenticatedHeader: React.FC = () => {
  const {
    user,
    adminProfile,
    signOut,
    hasRole,
    lastActivity,
    sessionWarningShown,
    extendSession,
    dismissSessionWarning,
  } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(100);

  // Calculate session time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity.getTime();
      const maxTime = (adminProfile?.preferences.autoLogout || 30) * 60 * 1000;
      const remaining = Math.max(0, 100 - (timeSinceActivity / maxTime) * 100);
      setSessionTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, adminProfile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "There was an error signing out.",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case UserRole.ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case UserRole.MODERATOR:
        return <Activity className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case UserRole.ADMIN:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case UserRole.MODERATOR:
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-india-saffron to-saffron-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Chakshu Portal
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Administrative Dashboard
              </p>
            </div>
          </Link>

          {/* Session Warning */}
          {sessionWarningShown && (
            <Alert className="fixed top-20 right-4 w-80 z-50 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800">
                    Session Expiring Soon
                  </p>
                  <p className="text-xs text-orange-600">
                    Your session will expire in 5 minutes due to inactivity.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={extendSession}
                      className="h-6 text-xs"
                    >
                      Extend Session
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={dismissSessionWarning}
                      className="h-6 text-xs"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Session Timer */}
            <div className="hidden md:flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div className="space-y-1">
                <Progress value={sessionTimeRemaining} className="w-20 h-1" />
                <p className="text-xs text-gray-500">Session</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            <EnhancedNotificationCenter />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.full_name ||
                          user?.email?.split("@")[0]}
                      </p>
                      {adminProfile?.role && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRoleBadgeColor(adminProfile.role)}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(adminProfile.role)}
                            <span>
                              {adminProfile.role
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>
                          </div>
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    {adminProfile?.department && (
                      <p className="text-xs text-muted-foreground">
                        {adminProfile.department}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Quick Stats */}
                <div className="px-2 py-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Last Login</p>
                      <p className="text-muted-foreground">
                        {adminProfile?.metadata.lastLogin
                          ? new Date(
                              adminProfile.metadata.lastLogin,
                            ).toLocaleDateString()
                          : "Today"}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-medium">Login Count</p>
                      <p className="text-muted-foreground">
                        {adminProfile?.metadata.loginCount || 1}
                      </p>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>

                {hasRole(UserRole.ADMIN) && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

const AuthenticatedSidebar: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { hasRole, hasPermission, adminProfile } = useAdminAuth();
  const location = useLocation();

  const isActivePath = (path: string) => location.pathname === path;

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
      requiresRole: UserRole.USER,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
      requiresRole: UserRole.USER,
    },
    {
      name: "Community",
      path: "/community",
      icon: Users,
      requiresRole: UserRole.USER,
    },
    {
      name: "Advanced Search",
      path: "/search",
      icon: Search,
      requiresRole: UserRole.USER,
    },
    {
      name: "AI Features",
      path: "/ai-features",
      icon: Brain,
      requiresRole: UserRole.MODERATOR,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      requiresRole: UserRole.MODERATOR,
    },
    {
      name: "Citizen Services",
      path: "/citizen-services",
      icon: Globe,
      requiresRole: UserRole.USER,
    },
    {
      name: "Mobile App",
      path: "/mobile-app",
      icon: Smartphone,
      requiresRole: UserRole.USER,
    },
    {
      name: "Admin Panel",
      path: "/admin",
      icon: Shield,
      requiresRole: UserRole.ADMIN,
      badge: "Admin",
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    hasRole(item.requiresRole),
  );

  return (
    <nav className={`space-y-1 ${className}`}>
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Navigation
        </h3>
      </div>

      {filteredNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-india-saffron text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className="h-5 w-5 mr-3" />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <Badge
                variant="outline"
                className={`text-xs ${isActive ? "border-white text-white" : ""}`}
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}

      {/* User Info Section */}
      {adminProfile && (
        <div className="mt-8 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Access Level
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Role</span>
              <Badge
                variant="outline"
                className={getRoleBadgeColor(adminProfile.role)}
              >
                {adminProfile.role.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Level</span>
              <span className="font-medium">
                {adminProfile.access_level}/10
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Permissions
              </span>
              <span className="font-medium">
                {adminProfile.permissions.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  function getRoleBadgeColor(role: UserRole) {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case UserRole.ADMIN:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case UserRole.MODERATOR:
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }
};

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  showSidebar = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader />

      <div className="flex">
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
              <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r">
                <div className="h-full py-6">
                  <AuthenticatedSidebar />
                </div>
              </div>
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden fixed bottom-4 left-4 z-40"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <AuthenticatedSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
