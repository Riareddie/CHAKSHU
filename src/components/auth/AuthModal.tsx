import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  const handleClose = () => {
    onClose();
    // Reset to default mode when modal closes
    setTimeout(() => setMode(defaultMode), 200);
  };

  const switchToLogin = () => setMode("login");
  const switchToSignup = () => setMode("signup");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-0 shadow-none">
        <VisuallyHidden>
          <DialogTitle>
            {mode === "login"
              ? "Login - Chakshu Portal"
              : "Sign Up - Chakshu Portal"}
          </DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          {mode === "login" ? (
            <LoginForm
              onSwitchToSignup={switchToSignup}
              onClose={handleClose}
            />
          ) : (
            <SignupForm onSwitchToLogin={switchToLogin} onClose={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
