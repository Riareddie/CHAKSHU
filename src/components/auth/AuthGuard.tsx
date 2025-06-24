import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, Lock, ArrowRight } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showPrompt?: boolean;
  message?: string;
}

const DefaultAuthPrompt: React.FC<{
  onLogin: () => void;
  onSignup: () => void;
  message?: string;
}> = ({ onLogin, onSignup, message }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-india-saffron/10 rounded-full w-fit">
          <Lock className="h-8 w-8 text-india-saffron" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Sign in Required
        </CardTitle>
        <CardDescription>
          {message || "You need to be signed in to access this feature."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            className="w-full bg-india-saffron hover:bg-saffron-600 text-white"
            onClick={onLogin}
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>

          <Button
            variant="outline"
            className="w-full border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white"
            onClick={onSignup}
          >
            <Shield className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Why create an account?
          </p>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-india-saffron" />
              <span>Track your fraud reports</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-india-saffron" />
              <span>Get personalized insights</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-india-saffron" />
              <span>Join the fraud-fighting community</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-india-saffron" />
              <span>Receive real-time alerts</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  showPrompt = true,
  message,
}) => {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-india-saffron mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, show fallback or prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  if (showPrompt) {
    return (
      <>
        <DefaultAuthPrompt
          onLogin={handleOpenLogin}
          onSignup={handleOpenSignup}
          message={message}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  // Return null if no prompt should be shown
  return null;
};

export default AuthGuard;
