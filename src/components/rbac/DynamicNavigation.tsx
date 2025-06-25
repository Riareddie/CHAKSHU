/**
 * Dynamic Navigation Component
 * Renders navigation menu based on user roles and permissions
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Home,
  FileText,
  Plus,
  Files,
  BarChart3,
  Users,
  LayoutDashboard,
  Settings,
  Shield,
  Crown,
  User,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigation, useRBAC } from "@/hooks/useRBAC";
import { NavigationItem, UserRole } from "@/types/rbac";
import { RoleBadge } from "./ProtectedComponent";

// Icon mapping
const iconMap = {
  Home,
  FileText,
  Plus,
  Files,
  BarChart3,
  Users,
  LayoutDashboard,
  Settings,
  Shield,
  Crown,
  User,
  Bell,
  Search,
  HelpCircle,
} as const;

interface DynamicNavigationProps {
  className?: string;
  variant?: "sidebar" | "header" | "mobile";
  showUserInfo?: boolean;
  onLogout?: () => void;
}

interface NavigationItemProps {
  item: NavigationItem;
  isActive?: boolean;
  depth?: number;
  onItemClick?: () => void;
}

const NavigationItemComponent: React.FC<NavigationItemProps> = ({
  item,
  isActive = false,
  depth = 0,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const IconComponent = item.icon
    ? iconMap[item.icon as keyof typeof iconMap]
    : FileText;

  const hasChildren = item.children && item.children.length > 0;
  const isCurrentPath = location.pathname === item.path;
  const isParentOfCurrent = item.children?.some((child) =>
    location.pathname.startsWith(child.path),
  );

  React.useEffect(() => {
    if (isParentOfCurrent) {
      setIsOpen(true);
    }
  }, [isParentOfCurrent]);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (onItemClick) {
      onItemClick();
    }
  };

  const itemClasses = `
    flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md
    transition-colors duration-200 group
    ${
      isCurrentPath
        ? "bg-primary text-primary-foreground"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }
    ${depth > 0 ? `ml-${depth * 4}` : ""}
  `;

  const content = (
    <div
      className={itemClasses}
      onClick={hasChildren ? handleClick : undefined}
    >
      <div className="flex items-center space-x-2">
        <IconComponent className="h-4 w-4" />
        <span>{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="text-xs">
            {item.badge}
          </Badge>
        )}
      </div>
      {hasChildren && (
        <div className="flex items-center">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {hasChildren ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>{content}</CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 ml-6">
            {item.children?.map((child) => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                depth={depth + 1}
                onItemClick={onItemClick}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      ) : item.isExternal ? (
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      ) : (
        <Link to={item.path} className="block" onClick={onItemClick}>
          {content}
        </Link>
      )}
    </div>
  );
};

// Sidebar Navigation
const SidebarNavigation: React.FC<{
  items: NavigationItem[];
  user: any;
  onLogout?: () => void;
}> = ({ items, user, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Chakshu Portal</h1>
            <p className="text-xs text-gray-500">Fraud Reporting System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || user?.email}
            </p>
            <div className="mt-1">
              <RoleBadge role={user?.role || UserRole.CITIZEN} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavigationItemComponent key={item.id} item={item} />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        <Link to="/help">
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Button>
        </Link>
        {onLogout && (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

// Header Navigation
const HeaderNavigation: React.FC<{
  items: NavigationItem[];
  user: any;
  onLogout?: () => void;
}> = ({ items, user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">
                Chakshu Portal
              </span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {items.slice(0, 5).map((item) => {
              const IconComponent = item.icon
                ? iconMap[item.icon as keyof typeof iconMap]
                : FileText;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">
                      {user?.fullName || user?.email}
                    </p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.fullName || user?.email}
                    </p>
                    <RoleBadge
                      role={user?.role || UserRole.CITIZEN}
                      size="sm"
                    />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onLogout && (
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

// Mobile Navigation
const MobileNavigation: React.FC<{
  items: NavigationItem[];
  user: any;
  onLogout?: () => void;
}> = ({ items, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-gray-900">Chakshu</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.email}
                  </p>
                  <RoleBadge role={user?.role || UserRole.CITIZEN} size="sm" />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <NavigationItemComponent
                  key={item.id}
                  item={item}
                  onItemClick={() => setIsOpen(false)}
                />
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-200 space-y-2">
              <Link to="/help" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
              </Link>
              {onLogout && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Dynamic Navigation Component
export const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
  className = "",
  variant = "sidebar",
  showUserInfo = true,
  onLogout,
}) => {
  const { user } = useRBAC();
  const navigationItems = useNavigation();

  if (!user) {
    return null;
  }

  const commonProps = {
    items: navigationItems,
    user,
    onLogout,
  };

  switch (variant) {
    case "header":
      return (
        <div className={className}>
          <HeaderNavigation {...commonProps} />
        </div>
      );

    case "mobile":
      return (
        <div className={className}>
          <MobileNavigation {...commonProps} />
        </div>
      );

    case "sidebar":
    default:
      return (
        <div className={`${className} w-64 h-full`}>
          <SidebarNavigation {...commonProps} />
        </div>
      );
  }
};

export default DynamicNavigation;
