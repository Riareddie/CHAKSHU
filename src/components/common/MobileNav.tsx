import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BarChart3,
  Shield,
  FileText,
  Search,
  Users,
  BookOpen,
  Smartphone,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileNav = () => {
  const { t, isRTL } = useLanguage();

  const navItems = [
    {
      to: "/",
      icon: Home,
      label: t.header.reportFraud,
      description: "Report fraud quickly",
    },
    {
      to: "/dashboard",
      icon: BarChart3,
      label: t.header.dashboard,
      description: "View your analytics",
    },
    {
      to: "/citizen-services",
      icon: Shield,
      label: t.header.citizenServices,
      description: "Government services",
    },
    {
      to: "/reports-management",
      icon: FileText,
      label: t.header.myReports,
      description: "Manage your reports",
    },
    {
      to: "/search",
      icon: Search,
      label: t.header.search,
      description: "Search database",
    },
    {
      to: "/community",
      icon: Users,
      label: t.header.community,
      description: "Community insights",
    },
    {
      to: "/education",
      icon: BookOpen,
      label: t.header.education,
      description: "Learn about fraud",
    },
    {
      to: "/mobile-app",
      icon: Smartphone,
      label: t.header.mobileApp,
      description: "Download our app",
    },
    {
      to: "/ai-features",
      icon: Sparkles,
      label: t.header.aiFeatures,
      description: "AI-powered tools",
    },
    {
      to: "/help",
      icon: HelpCircle,
      label: t.header.help,
      description: "Get support",
    },
  ];

  return (
    <div className="lg:hidden">
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {/* Mobile Navigation Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3
            className={`text-sm font-semibold text-gray-500 dark:text-light-yellow uppercase tracking-wide ${isRTL ? "text-right" : ""}`}
          >
            Quick Navigation
          </h3>
        </div>

        {/* Navigation Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-india-saffron dark:hover:border-india-saffron hover:bg-india-saffron/5 dark:hover:bg-india-saffron/10 transition-all duration-200 focus-visible-ring touch-target ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`flex flex-col items-center space-y-2 ${isRTL ? "text-right" : "text-center"}`}
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 group-hover:bg-india-saffron/20 dark:group-hover:bg-india-saffron/30 rounded-lg flex items-center justify-center transition-colors">
                      <IconComponent className="w-5 h-5 text-gray-600 dark:text-light-yellow group-hover:text-india-saffron transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-india-saffron transition-colors leading-tight">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-light-yellow mt-1 leading-tight">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-4">
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4
              className={`text-xs font-semibold text-gray-500 dark:text-light-yellow uppercase tracking-wide mb-3 ${isRTL ? "text-right" : ""}`}
            >
              Quick Actions
            </h4>
            <div className="flex gap-2">
              <Link
                to="/"
                className="flex-1 bg-india-saffron hover:bg-saffron-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors focus-visible-ring touch-target text-center text-sm"
              >
                Report Fraud
              </Link>
              <Link
                to="/search"
                className="flex-1 border border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white px-4 py-3 rounded-lg font-semibold transition-colors focus-visible-ring touch-target text-center text-sm"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
