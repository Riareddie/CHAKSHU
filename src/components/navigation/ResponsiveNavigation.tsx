/**
 * Responsive Navigation Component
 * Mobile-first navigation with hamburger menu, touch-friendly interactions
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  HelpCircle,
  Shield,
  BarChart3,
  Plus,
  User,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  description?: string;
  children?: NavigationItem[];
  external?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  requiredRole?: string[];
  className?: string;
}

export interface ResponsiveNavigationProps {
  brand?: {
    name: string;
    logo?: React.ReactNode;
    href?: string;
  };
  items: NavigationItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  actions?: {
    notifications?: {
      count?: number;
      onClick?: () => void;
    };
    search?: {
      onSearch?: (query: string) => void;
      placeholder?: string;
    };
    user?: {
      onProfile?: () => void;
      onSettings?: () => void;
      onLogout?: () => void;
      menuItems?: Array<{
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
        separator?: boolean;
      }>;
    };
  };
  variant?: "default" | "government" | "minimal";
  sticky?: boolean;
  transparent?: boolean;
  showBorder?: boolean;
  mobileBreakpoint?: number;
  className?: string;
  onNavigate?: (href: string) => void;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  brand = { name: "Chakshu Portal", href: "/" },
  items = [],
  user,
  actions,
  variant = "default",
  sticky = true,
  transparent = false,
  showBorder = true,
  mobileBreakpoint = 1024,
  className = "",
  onNavigate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();

  // Responsive detection
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [mobileBreakpoint]);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Filter visible items based on current context
  const getVisibleItems = (
    items: NavigationItem[],
    context: "mobile" | "desktop",
  ) => {
    return items.filter((item) => {
      if (item.hidden) return false;
      if (context === "mobile" && item.desktopOnly) return false;
      if (context === "desktop" && item.mobileOnly) return false;
      // Add role-based filtering here if needed
      return true;
    });
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Get navigation variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "government":
        return {
          bg: "bg-blue-900 dark:bg-blue-950",
          text: "text-white",
          border: "border-blue-800",
        };
      case "minimal":
        return {
          bg: "bg-white/80 backdrop-blur-sm dark:bg-gray-900/80",
          text: "text-gray-900 dark:text-white",
          border: "border-gray-200 dark:border-gray-800",
        };
      default:
        return {
          bg: transparent
            ? "bg-white/95 backdrop-blur-sm dark:bg-gray-900/95"
            : "bg-white dark:bg-gray-900",
          text: "text-gray-900 dark:text-white",
          border: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Handle navigation
  const handleNavigate = (href: string, external = false) => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      onNavigate?.(href);
    }
    setIsMobileMenuOpen(false);
  };

  // Render navigation item
  const renderNavItem = (
    item: NavigationItem,
    context: "mobile" | "desktop" = "desktop",
  ) => {
    const isActive = isActiveLink(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isMobileContext = context === "mobile";

    const baseClasses = cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
      isMobileContext ? "w-full justify-start min-h-[44px] text-base" : "",
      isActive
        ? "bg-primary text-primary-foreground"
        : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
      item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      item.className,
    );

    const content = (
      <>
        {item.icon && (
          <span
            className={cn("flex-shrink-0", isMobileContext ? "mr-3" : "mr-2")}
          >
            {item.icon}
          </span>
        )}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {item.badge}
          </Badge>
        )}
        {hasChildren && !isMobileContext && (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </>
    );

    if (hasChildren && isMobileContext) {
      return (
        <MobileCollapsibleItem key={item.id} item={item} isActive={isActive} />
      );
    }

    if (hasChildren && !isMobileContext) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={baseClasses}>
              {content}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {item.children.map((child) => (
              <DropdownMenuItem
                key={child.id}
                onClick={() => handleNavigate(child.href, child.external)}
                disabled={child.disabled}
                className="min-h-[40px]"
              >
                {child.icon && <span className="mr-2">{child.icon}</span>}
                <span className="flex-1">{child.label}</span>
                {child.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {child.badge}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        className={baseClasses}
        onClick={(e) => {
          e.preventDefault();
          handleNavigate(item.href, item.external);
        }}
      >
        {content}
      </Link>
    );
  };

  // Mobile collapsible navigation item
  const MobileCollapsibleItem: React.FC<{
    item: NavigationItem;
    isActive: boolean;
  }> = ({ item, isActive }) => {
    const [isOpen, setIsOpen] = React.useState(isActive);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md transition-colors min-h-[44px]",
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-gray-100 dark:hover:bg-gray-800",
          )}
        >
          <div className="flex items-center">
            {item.icon && <span className="mr-3">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6 space-y-1">
          {item.children?.map((child) => (
            <Link
              key={child.id}
              to={child.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors min-h-[40px]",
                isActiveLink(child.href)
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(child.href, child.external);
              }}
            >
              {child.icon && <span className="mr-2">{child.icon}</span>}
              <span className="flex-1">{child.label}</span>
              {child.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {child.badge}
                </Badge>
              )}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Render user menu
  const renderUserMenu = () => {
    if (!user) return null;

    const userMenuItems = actions?.user?.menuItems || [
      {
        label: "Profile",
        onClick: actions?.user?.onProfile || (() => {}),
        icon: <User className="h-4 w-4" />,
      },
      {
        label: "Settings",
        onClick: actions?.user?.onSettings || (() => {}),
        icon: <Settings className="h-4 w-4" />,
      },
      {
        label: "Logout",
        onClick: actions?.user?.onLogout || (() => {}),
        separator: true,
      },
    ];

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-3 py-2 h-auto"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{user.name}</span>
              {user.role && (
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {user.role && (
                <Badge variant="outline" className="w-fit text-xs">
                  {user.role}
                </Badge>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userMenuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={item.onClick} className="min-h-[40px]">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Mobile navigation content
  const renderMobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-left">
              <Link
                to={brand.href || "/"}
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {brand.logo && (
                  <span className="flex-shrink-0">{brand.logo}</span>
                )}
                <span className="font-bold text-lg">{brand.name}</span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <nav className="space-y-2 pb-6">
              {getVisibleItems(items, "mobile").map((item) =>
                renderNavItem(item, "mobile"),
              )}
            </nav>
          </ScrollArea>

          {/* Mobile user section */}
          {user && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  {user.role && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {user.role}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                {actions?.user?.menuItems?.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.separator && (
                      <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        item.onClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start min-h-[44px]"
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </Button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header
      className={cn(
        "w-full transition-all duration-200",
        sticky && "sticky top-0 z-50",
        variantStyles.bg,
        variantStyles.text,
        showBorder && `border-b ${variantStyles.border}`,
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand */}
          <div className="flex items-center">
            {renderMobileNavigation()}

            <Link
              to={brand.href || "/"}
              className="flex items-center space-x-2 ml-2 md:ml-0"
            >
              {brand.logo && (
                <span className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10">
                  {brand.logo}
                </span>
              )}
              <span className="font-bold text-lg lg:text-xl">{brand.name}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {getVisibleItems(items, "desktop")
              .slice(0, 6)
              .map((item) => renderNavItem(item, "desktop"))}

            {/* More menu for overflow items */}
            {getVisibleItems(items, "desktop").length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {getVisibleItems(items, "desktop")
                    .slice(6)
                    .map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => handleNavigate(item.href, item.external)}
                        disabled={item.disabled}
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            {actions?.notifications && (
              <Button
                variant="ghost"
                size="icon"
                onClick={actions.notifications.onClick}
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {actions.notifications.count &&
                  actions.notifications.count > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
                    >
                      {actions.notifications.count > 99
                        ? "99+"
                        : actions.notifications.count}
                    </Badge>
                  )}
              </Button>
            )}

            {/* Search - Desktop only */}
            {actions?.search && !isMobile && (
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={actions.search.placeholder || "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && actions.search?.onSearch) {
                      actions.search.onSearch(searchQuery);
                    }
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm w-64"
                />
              </div>
            )}

            {/* User Menu */}
            {renderUserMenu()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResponsiveNavigation;
