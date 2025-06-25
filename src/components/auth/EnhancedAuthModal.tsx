/**
 * Enhanced Authentication Modal
 * Provides a unified modal for login, signup, and password reset
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import EnhancedLoginForm from "./EnhancedLoginForm";
import EnhancedSignupForm from "./EnhancedSignupForm";
import PasswordResetForm from "./PasswordResetForm";

export type AuthMode = "login" | "signup" | "reset";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  redirectAfterLogin?: boolean;
  title?: string;
  description?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
  redirectAfterLogin = true,
  title,
  description,
}) => {
  const [currentMode, setCurrentMode] = useState<AuthMode>(defaultMode);

  // Reset to default mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    onClose();
  };

  // Mode switching handlers
  const switchToLogin = () => setCurrentMode("login");
  const switchToSignup = () => setCurrentMode("signup");
  const switchToReset = () => setCurrentMode("reset");

  // Get modal title based on current mode
  const getModalTitle = () => {
    if (title) return title;

    switch (currentMode) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "Create Account";
      case "reset":
        return "Reset Password";
      default:
        return "Authentication";
    }
  };

  // Get modal description based on current mode
  const getModalDescription = () => {
    if (description) return description;

    switch (currentMode) {
      case "login":
        return "Sign in to your government portal account";
      case "signup":
        return "Join the fraud reporting community";
      case "reset":
        return "Reset your account password securely";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>

        {/* Close Button */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[90vh] overflow-y-auto">
          {currentMode === "reset" ? (
            // Password Reset Form (standalone)
            <PasswordResetForm
              onSwitchToLogin={switchToLogin}
              onClose={handleAuthSuccess}
              className="border-0 shadow-none"
            />
          ) : (
            // Login/Signup Tabs
            <Tabs
              value={currentMode}
              onValueChange={(value) => setCurrentMode(value as AuthMode)}
            >
              <div className="px-6 pt-6 pb-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="text-sm font-medium">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm font-medium">
                    Create Account
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="login" className="mt-0">
                <EnhancedLoginForm
                  onSwitchToSignup={switchToSignup}
                  onSwitchToReset={switchToReset}
                  onClose={handleAuthSuccess}
                  redirectAfterLogin={redirectAfterLogin}
                  className="border-0 shadow-none"
                />
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <EnhancedSignupForm
                  onSwitchToLogin={switchToLogin}
                  onClose={handleAuthSuccess}
                  className="border-0 shadow-none"
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
