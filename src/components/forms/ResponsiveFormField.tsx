/**
 * Responsive Form Field Component
 * Provides responsive, accessible form fields with validation, touch-friendly sizing
 */

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Calendar as CalendarIcon,
  Upload,
  X,
  Info,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export interface FormFieldOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ResponsiveFormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "file";
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FormFieldOption[];
  accept?: string; // For file inputs
  multiple?: boolean; // For file inputs
  maxFiles?: number;
  rows?: number; // For textarea
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  helperText?: string;
  showValidationIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "government";
  loading?: boolean;
  onValueChange?: (value: any) => void;
  // Responsive props
  responsive?: {
    sm?: Partial<ResponsiveFormFieldProps>;
    md?: Partial<ResponsiveFormFieldProps>;
    lg?: Partial<ResponsiveFormFieldProps>;
    xl?: Partial<ResponsiveFormFieldProps>;
  };
}

const getFieldSizeClasses = (
  size: "sm" | "md" | "lg" = "md",
  type?: string,
) => {
  const touchFriendly = "min-h-[44px] touch-manipulation"; // WCAG AA touch target size

  const sizeClasses = {
    sm: "h-8 text-sm px-2",
    md: `h-10 text-sm px-3 sm:h-10 md:h-11 md:text-base md:px-4 ${touchFriendly}`,
    lg: `h-12 text-base px-4 sm:h-12 md:h-14 md:text-lg md:px-6 ${touchFriendly}`,
  };

  // Special sizing for specific field types
  if (type === "textarea") {
    return `${sizeClasses[size]} h-auto min-h-[80px] sm:min-h-[100px] md:min-h-[120px]`;
  }

  if (type === "checkbox" || type === "radio") {
    const checkboxSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6",
      lg: "w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7",
    };
    return checkboxSizes[size];
  }

  return sizeClasses[size];
};

const getVariantClasses = (variant: "default" | "government" = "default") => {
  const variants = {
    default: "",
    government:
      "border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-blue-50/30",
  };
  return variants[variant];
};

export const ResponsiveFormField: React.FC<ResponsiveFormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  description,
  required = false,
  disabled = false,
  options = [],
  accept,
  multiple = false,
  maxFiles = 5,
  rows = 4,
  min,
  max,
  step,
  className = "",
  containerClassName = "",
  labelClassName = "",
  helperText,
  showValidationIcon = true,
  size = "md",
  variant = "default",
  loading = false,
  onValueChange,
  responsive,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const [showPassword, setShowPassword] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  const fieldError = errors[name];
  const fieldValue = watch(name);
  const hasError = !!fieldError;
  const isValid = !hasError && fieldValue !== undefined && fieldValue !== "";

  // Apply responsive overrides
  const responsiveProps = React.useMemo(() => {
    if (!responsive) return {};

    // This is a simplified approach - in a real implementation,
    // you'd use a proper responsive hook or media queries
    const breakpoint =
      typeof window !== "undefined"
        ? window.innerWidth >= 1280
          ? "xl"
          : window.innerWidth >= 1024
            ? "lg"
            : window.innerWidth >= 768
              ? "md"
              : "sm"
        : "md";

    return responsive[breakpoint] || {};
  }, [responsive]);

  const effectiveProps = {
    ...{ size, variant, className, placeholder },
    ...responsiveProps,
  };

  const fieldSizeClasses = getFieldSizeClasses(effectiveProps.size, type);
  const variantClasses = getVariantClasses(effectiveProps.variant);

  const baseInputClasses = cn(
    "w-full rounded-md border border-input bg-background ring-offset-background transition-all duration-200",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    fieldSizeClasses,
    variantClasses,
    hasError && "border-destructive focus-visible:ring-destructive",
    isValid &&
      showValidationIcon &&
      "border-green-500 focus-visible:ring-green-500",
    effectiveProps.className,
  );

  const ValidationIcon = () => {
    if (!showValidationIcon) return null;

    if (loading) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (hasError) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }

    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    return null;
  };

  const renderField = (field: any) => {
    const commonProps = {
      ...field,
      disabled: disabled || loading,
      placeholder: effectiveProps.placeholder,
      onChange: (value: any) => {
        field.onChange(value);
        onValueChange?.(value);
      },
    };

    switch (type) {
      case "textarea":
        return (
          <Textarea {...commonProps} rows={rows} className={baseInputClasses} />
        );

      case "select":
        return (
          <Select
            value={field.value}
            onValueChange={commonProps.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={baseInputClasses}>
              <SelectValue placeholder={effectiveProps.placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-60 sm:max-h-80">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="py-3 sm:py-2" // Touch-friendly on mobile
                >
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-start space-x-3 sm:space-x-2">
            <Checkbox
              checked={field.value || false}
              onCheckedChange={commonProps.onChange}
              disabled={disabled}
              className={cn(
                getFieldSizeClasses(effectiveProps.size, "checkbox"),
                "mt-1",
              )}
              aria-describedby={description ? `${name}-description` : undefined}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={name}
                className={cn(
                  "text-sm font-medium leading-relaxed cursor-pointer",
                  "sm:text-sm md:text-base",
                  labelClassName,
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {description && (
                <p
                  id={`${name}-description`}
                  className="text-xs sm:text-sm text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={field.value}
            onValueChange={commonProps.onChange}
            disabled={disabled}
            className="space-y-3 sm:space-y-2"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-3 sm:space-x-2"
              >
                <RadioGroupItem
                  value={option.value}
                  disabled={option.disabled || disabled}
                  className={cn(
                    getFieldSizeClasses(effectiveProps.size, "radio"),
                    "mt-1",
                  )}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label className="text-sm font-medium leading-relaxed cursor-pointer sm:text-sm md:text-base">
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  baseInputClasses,
                  "justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value
                  ? format(new Date(field.value), "PPP")
                  : effectiveProps.placeholder || "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => commonProps.onChange(date?.toISOString())}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "file":
        return (
          <div className="space-y-3">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                "hover:border-primary/50 hover:bg-primary/5",
                hasError && "border-destructive",
                "cursor-pointer",
              )}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = accept || "";
                input.multiple = multiple;
                input.onchange = (e) => {
                  const files = Array.from(
                    (e.target as HTMLInputElement).files || [],
                  );
                  if (multiple) {
                    const newFiles = [...uploadedFiles, ...files].slice(
                      0,
                      maxFiles,
                    );
                    setUploadedFiles(newFiles);
                    commonProps.onChange(newFiles);
                  } else {
                    setUploadedFiles(files);
                    commonProps.onChange(files[0]);
                  }
                };
                input.click();
              }}
            >
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                {effectiveProps.placeholder || "Click to upload files"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept ? `Supported: ${accept}` : "All file types supported"}
                {multiple && ` (Max ${maxFiles} files)`}
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFiles = uploadedFiles.filter(
                          (_, i) => i !== index,
                        );
                        setUploadedFiles(newFiles);
                        commonProps.onChange(multiple ? newFiles : null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "password":
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type={showPassword ? "text" : "password"}
              className={cn(baseInputClasses, "pr-12")}
              min={min}
              max={max}
              step={step}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        );

      default:
        return (
          <Input
            {...commonProps}
            type={type}
            className={baseInputClasses}
            min={min}
            max={max}
            step={step}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {type !== "checkbox" && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={name}
            className={cn(
              "text-sm font-medium leading-none",
              "sm:text-sm md:text-base",
              hasError && "text-destructive",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>

          <div className="flex items-center space-x-1">
            <ValidationIcon />
            {variant === "government" && required && (
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            )}
          </div>
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            {renderField(field)}
            {showValidationIcon &&
              type !== "checkbox" &&
              type !== "radio" &&
              type !== "file" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ValidationIcon />
                </div>
              )}
          </div>
        )}
      />

      {/* Error message */}
      {hasError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {fieldError?.message as string}
          </AlertDescription>
        </Alert>
      )}

      {/* Helper text */}
      {helperText && !hasError && (
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {helperText}
          </p>
        </div>
      )}

      {/* Description for non-checkbox fields */}
      {description && type !== "checkbox" && type !== "radio" && (
        <p className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default ResponsiveFormField;
