/**
 * Responsive Modal Component
 * Provides mobile-optimized modal dialogs with touch-friendly interactions
 */

import React from "react";
import { cn } from "@/lib/utils";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronDown } from "lucide-react";

export interface ResponsiveModalProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "government" | "alert" | "form";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  // Mobile-specific props
  mobilePosition?: "bottom" | "full" | "center";
  mobileHeight?: "auto" | "half" | "full";
  swipeToClose?: boolean;
  // Responsive breakpoint (px)
  mobileBreakpoint?: number;
  // Accessibility
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  children,
  trigger,
  open,
  onOpenChange,
  title,
  description,
  footer,
  size = "md",
  variant = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  className = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  mobilePosition = "bottom",
  mobileHeight = "auto",
  swipeToClose = true,
  mobileBreakpoint = 768,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  // Responsive detection
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [mobileBreakpoint]);

  // Size classes for desktop modal
  const getSizeClasses = (size: string) => {
    const sizeMap = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-screen-lg",
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  };

  // Variant classes
  const getVariantClasses = (variant: string) => {
    const variantMap = {
      default: "",
      government: "border-2 border-blue-200 bg-blue-50/30",
      alert: "border-2 border-amber-200 bg-amber-50/30",
      form: "border border-gray-200",
    };
    return variantMap[variant as keyof typeof variantMap] || "";
  };

  // Mobile height classes
  const getMobileHeightClasses = (height: string) => {
    const heightMap = {
      auto: "max-h-[85vh]",
      half: "h-[50vh]",
      full: "h-[90vh]",
    };
    return heightMap[height as keyof typeof heightMap] || heightMap.auto;
  };

  // Common content
  const renderContent = (isMobileView: boolean = false) => (
    <div
      className={cn("flex flex-col", isMobileView ? "h-full" : "max-h-[85vh]")}
    >
      {/* Header */}
      {(title || description || showCloseButton) && (
        <div
          className={cn(
            "flex-shrink-0 p-4 sm:p-6",
            isMobileView ? "pb-2" : "pb-4",
            headerClassName,
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              {title && (
                <h2
                  className={cn(
                    "text-lg font-semibold leading-6 text-gray-900",
                    isMobileView ? "text-xl" : "sm:text-xl",
                  )}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className={cn(
                    "mt-1 text-sm text-gray-500",
                    isMobileView ? "text-base" : "sm:text-sm",
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 hover:bg-gray-100",
                  isMobileView && "h-10 w-10 text-gray-500",
                )}
                onClick={() => onOpenChange?.(false)}
                aria-label="Close modal"
              >
                <X className={cn("h-4 w-4", isMobileView && "h-5 w-5")} />
              </Button>
            )}
          </div>

          {/* Mobile drag indicator */}
          {isMobileView && swipeToClose && mobilePosition === "bottom" && (
            <div className="flex justify-center mt-2">
              <div className="w-8 h-1 bg-gray-300 rounded-full" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "flex-1 overflow-hidden",
          isMobileView ? "px-4 pb-4" : "px-4 sm:px-6",
        )}
      >
        <ScrollArea className="h-full">
          <div className={cn("py-2", contentClassName)}>{children}</div>
        </ScrollArea>
      </div>

      {/* Footer */}
      {footer && (
        <div
          className={cn(
            "flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6",
            isMobileView && "py-6 border-t-2",
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );

  // Desktop modal using Dialog
  const DesktopModal = () => (
    <Dialog open={open} onOpenChange={onOpenChange} modal={preventScroll}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          getSizeClasses(size),
          getVariantClasses(variant),
          "p-0 gap-0 overflow-hidden",
          !closeOnOverlayClick && "pointer-events-auto",
          className,
        )}
        onPointerDownOutside={
          closeOnOverlayClick ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {renderContent(false)}
      </DialogContent>
    </Dialog>
  );

  // Mobile modal using Drawer
  const MobileModal = () => {
    if (mobilePosition === "full") {
      return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={preventScroll}>
          {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
          <DialogContent
            className={cn(
              "w-full h-full max-w-none m-0 p-0 gap-0 rounded-none border-none",
              getVariantClasses(variant),
              className,
            )}
            onPointerDownOutside={
              closeOnOverlayClick ? undefined : (e) => e.preventDefault()
            }
            onEscapeKeyDown={
              closeOnEscape ? undefined : (e) => e.preventDefault()
            }
            role={role}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
          >
            {renderContent(true)}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={preventScroll}
        dismissible={swipeToClose}
      >
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent
          className={cn(
            getMobileHeightClasses(mobileHeight),
            getVariantClasses(variant),
            "p-0 gap-0",
            className,
          )}
          role={role}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
        >
          {renderContent(true)}
        </DrawerContent>
      </Drawer>
    );
  };

  return isMobile ? <MobileModal /> : <DesktopModal />;
};

// Convenience components for common modal types
export const FormModal: React.FC<ResponsiveModalProps> = (props) => (
  <ResponsiveModal {...props} variant="form" size="lg" />
);

export const AlertModal: React.FC<ResponsiveModalProps> = (props) => (
  <ResponsiveModal
    {...props}
    variant="alert"
    size="sm"
    showCloseButton={false}
  />
);

export const GovernmentModal: React.FC<ResponsiveModalProps> = (props) => (
  <ResponsiveModal {...props} variant="government" />
);

// Hook for programmatic modal control
export const useResponsiveModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen,
  };
};

// Responsive modal footer with common button layouts
export const ResponsiveModalFooter: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "form" | "confirmation";
  className?: string;
}> = ({ children, variant = "default", className = "" }) => {
  const getLayoutClasses = () => {
    switch (variant) {
      case "form":
        return "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0";
      case "confirmation":
        return "flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0";
      default:
        return "flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0";
    }
  };

  return <div className={cn(getLayoutClasses(), className)}>{children}</div>;
};

// Touch-friendly button for mobile modals
export const ResponsiveModalButton: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({
  children,
  variant = "default",
  size = "default",
  fullWidth = false,
  onClick,
  disabled = false,
  className = "",
}) => (
  <Button
    variant={variant}
    size={size}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "min-h-[44px] touch-manipulation", // WCAG AA touch target
      fullWidth && "w-full sm:w-auto",
      "text-base sm:text-sm", // Larger text on mobile
      className,
    )}
  >
    {children}
  </Button>
);

export default ResponsiveModal;
