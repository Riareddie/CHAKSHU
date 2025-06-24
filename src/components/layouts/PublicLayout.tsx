/**
 * Public Layout Component
 * Layout for non-authenticated users with limited navigation and public content
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Lock,
  Users,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSelector from "@/components/language/LanguageSelector";

interface PublicLayoutProps {
  children: React.ReactNode;
  showCTA?: boolean; // Show Call-to-Action sections
}

const PublicHeader: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActivePath = (path: string) => location.pathname === path;

  const publicNavigation = [
    { name: "Home", path: "/", icon: Shield },
    { name: "About", path: "/about", icon: Users },
    { name: "Features", path: "/features", icon: BarChart3 },
    { name: "Resources", path: "/resources", icon: BookOpen },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+91 1930 (Toll Free)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>support@chakshu.gov.in</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-india-saffron to-saffron-600 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Chakshu Portal
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhanced Fraud Reporting
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {publicNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? "bg-india-saffron text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2">
            <Link to="/admin/login">
              <Button variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </Link>
            <Link to="/get-started">
              <Button
                size="sm"
                className="bg-india-saffron hover:bg-saffron-600"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-india-saffron to-saffron-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Chakshu Portal</h3>
                <p className="text-sm text-gray-400">
                  Enhanced Fraud Reporting
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              A Government of India initiative to combat fraud and protect
              citizens from digital scams and cyber crimes.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/success-stories"
                  className="text-gray-400 hover:text-white"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-gray-400 hover:text-white"
                >
                  Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-gray-400 hover:text-white"
                >
                  Resources
                </Link>
              </li>
              <li>
                <a
                  href="tel:1930"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  1930 (Toll Free)
                </a>
              </li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h4 className="font-semibold mb-4">Government</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.india.gov.in"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  India.gov.in
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  Cybercrime Portal
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  Digital India
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Government of India. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-4 md:mt-0">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Made in India</span>
              </div>
              <Badge
                variant="outline"
                className="text-gray-400 border-gray-600"
              >
                Official Government Portal
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LoginPromptSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-india-saffron to-saffron-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of citizens helping to make India safer from fraud
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/get-started">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-india-saffron hover:bg-gray-100"
            >
              <Shield className="h-5 w-5 mr-2" />
              Start Reporting
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-india-saffron"
            >
              <Lock className="h-5 w-5 mr-2" />
              Admin Access
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const TrustIndicators: React.FC = () => {
  const stats = [
    { label: "Reports Submitted", value: "50,000+", icon: Shield },
    { label: "Frauds Prevented", value: "₹100 Cr+", icon: BarChart3 },
    { label: "Active Users", value: "2.5 Lakh+", icon: Users },
    { label: "Success Rate", value: "94%", icon: BookOpen },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Millions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Since launch, Chakshu Portal has become India's most trusted
            platform for fraud reporting and prevention.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 p-3 bg-india-saffron/10 rounded-full w-fit">
                    <Icon className="h-8 w-8 text-india-saffron" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showCTA = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PublicHeader />

      <main className="flex-1">
        {children}

        {showCTA && (
          <>
            <TrustIndicators />
            <LoginPromptSection />
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
