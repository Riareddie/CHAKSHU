/**
 * Form Validation Hook
 * Provides comprehensive form validation with real-time feedback, server-side backup
 */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  Path,
  FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { validateField, validateForm } from "@/lib/validationSchemas";

export interface FormValidationConfig<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  defaultValues?: Partial<T>;
  shouldFocusError?: boolean;
  delayError?: number;
  criteriaMode?: "firstError" | "all";
  shouldUnregister?: boolean;
  shouldUseNativeValidation?: boolean;
  // Real-time validation options
  enableRealTimeValidation?: boolean;
  debounceMs?: number;
  validateOnMount?: boolean;
  // Server-side validation
  serverValidation?: {
    endpoint: string;
    method?: "POST" | "PUT";
    headers?: Record<string, string>;
    transform?: (data: T) => any;
  };
  // Cross-field validation
  crossFieldValidation?: Array<{
    fields: Array<Path<T>>;
    validator: (values: Pick<T, Path<T>>) => string | null;
    triggerFields?: Array<Path<T>>;
  }>;
  // Custom field validators
  customValidators?: Record<
    string,
    {
      validator: (
        value: any,
        formData: T,
      ) => Promise<string | null> | string | null;
      debounce?: number;
      dependencies?: Array<Path<T>>;
    }
  >;
}

export interface ValidationState {
  isValidating: boolean;
  hasErrors: boolean;
  touchedFields: Record<string, boolean>;
  validatedFields: Record<string, boolean>;
  serverErrors: Record<string, string>;
  fieldStates: Record<
    string,
    {
      hasError: boolean;
      isValidating: boolean;
      isValid: boolean;
      error?: string;
      touched: boolean;
      dirty: boolean;
    }
  >;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isValidating: boolean;
  hasAttemptedSubmit: boolean;
  submitCount: number;
  lastSubmitTime?: Date;
  errors: Record<string, string>;
}

export interface UseFormValidationReturn<T extends FieldValues>
  extends UseFormReturn<T> {
  // Enhanced validation state
  validationState: ValidationState;
  submissionState: FormSubmissionState;

  // Validation methods
  validateField: (fieldName: Path<T>) => Promise<boolean>;
  validateAllFields: () => Promise<boolean>;
  clearFieldError: (fieldName: Path<T>) => void;
  clearAllErrors: () => void;
  setServerError: (fieldName: Path<T>, error: string) => void;
  setServerErrors: (errors: Record<string, string>) => void;

  // Form state methods
  markFieldTouched: (fieldName: Path<T>) => void;
  markAllFieldsTouched: () => void;
  resetValidationState: () => void;

  // Enhanced submission
  handleSubmit: (
    onValid: (data: T) => Promise<void> | void,
    onInvalid?: (errors: any) => void,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;

  // Progress tracking
  getFormProgress: () => {
    totalFields: number;
    completedFields: number;
    validFields: number;
    touchedFields: number;
    percentage: number;
  };

  // Accessibility helpers
  getFieldProps: (fieldName: Path<T>) => {
    "aria-invalid": boolean;
    "aria-describedby": string;
    "aria-required": boolean;
  };

  // Utility methods
  isDirtyField: (fieldName: Path<T>) => boolean;
  isValidField: (fieldName: Path<T>) => boolean;
  canSubmit: () => boolean;
}

export function useFormValidation<T extends FieldValues>(
  config: FormValidationConfig<T>,
): UseFormValidationReturn<T> {
  const {
    schema,
    mode = "onChange",
    reValidateMode = "onChange",
    defaultValues,
    shouldFocusError = true,
    delayError = 0,
    criteriaMode = "firstError",
    shouldUnregister = false,
    shouldUseNativeValidation = false,
    enableRealTimeValidation = true,
    debounceMs = 300,
    validateOnMount = false,
    serverValidation,
    crossFieldValidation = [],
    customValidators = {},
  } = config;

  // Form instance using react-hook-form
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode,
    reValidateMode,
    defaultValues,
    shouldFocusError,
    delayError,
    criteriaMode,
    shouldUnregister,
    shouldUseNativeValidation,
  });

  // Validation state
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    hasErrors: false,
    touchedFields: {},
    validatedFields: {},
    serverErrors: {},
    fieldStates: {},
  });

  // Submission state
  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isValidating: false,
    hasAttemptedSubmit: false,
    submitCount: 0,
    errors: {},
  });

  // Debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const validationPromises = useRef<Record<string, Promise<any>>>({});

  // Watch all form values for real-time validation
  const watchedValues = form.watch();

  // Clear debounce timer
  const clearDebounceTimer = useCallback((fieldName: string) => {
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
      delete debounceTimers.current[fieldName];
    }
  }, []);

  // Update field state
  const updateFieldState = useCallback(
    (
      fieldName: string,
      updates: Partial<ValidationState["fieldStates"][string]>,
    ) => {
      setValidationState((prev) => ({
        ...prev,
        fieldStates: {
          ...prev.fieldStates,
          [fieldName]: {
            ...prev.fieldStates[fieldName],
            ...updates,
          },
        },
      }));
    },
    [],
  );

  // Validate single field
  const validateField = useCallback(
    async (fieldName: Path<T>): Promise<boolean> => {
      const fieldNameStr = fieldName as string;
      const value = form.getValues(fieldName);
      const formData = form.getValues();

      // Update validation state
      updateFieldState(fieldNameStr, { isValidating: true });

      try {
        // Clear existing error
        form.clearErrors(fieldName);

        // Schema validation
        const fieldSchema = schema.shape?.[fieldNameStr];
        if (fieldSchema) {
          const fieldError = validateField(fieldSchema, value);
          if (fieldError) {
            form.setError(fieldName, { message: fieldError });
            updateFieldState(fieldNameStr, {
              hasError: true,
              isValid: false,
              error: fieldError,
              isValidating: false,
            });
            return false;
          }
        }

        // Custom validation
        const customValidator = customValidators[fieldNameStr];
        if (customValidator) {
          const customError = await customValidator.validator(value, formData);
          if (customError) {
            form.setError(fieldName, { message: customError });
            updateFieldState(fieldNameStr, {
              hasError: true,
              isValid: false,
              error: customError,
              isValidating: false,
            });
            return false;
          }
        }

        // Cross-field validation
        for (const crossValidation of crossFieldValidation) {
          if (crossValidation.fields.includes(fieldName)) {
            const relevantValues = crossValidation.fields.reduce(
              (acc, field) => {
                acc[field] = form.getValues(field);
                return acc;
              },
              {} as any,
            );

            const crossError = crossValidation.validator(relevantValues);
            if (crossError) {
              form.setError(fieldName, { message: crossError });
              updateFieldState(fieldNameStr, {
                hasError: true,
                isValid: false,
                error: crossError,
                isValidating: false,
              });
              return false;
            }
          }
        }

        // Clear server error if field is now valid
        if (validationState.serverErrors[fieldNameStr]) {
          setValidationState((prev) => ({
            ...prev,
            serverErrors: { ...prev.serverErrors, [fieldNameStr]: "" },
          }));
        }

        updateFieldState(fieldNameStr, {
          hasError: false,
          isValid: true,
          error: undefined,
          isValidating: false,
        });

        return true;
      } catch (error) {
        console.error(`Validation error for field ${fieldNameStr}:`, error);
        updateFieldState(fieldNameStr, {
          hasError: true,
          isValid: false,
          error: "Validation error occurred",
          isValidating: false,
        });
        return false;
      }
    },
    [
      form,
      schema,
      customValidators,
      crossFieldValidation,
      validationState.serverErrors,
      updateFieldState,
    ],
  );

  // Validate all fields
  const validateAllFields = useCallback(async (): Promise<boolean> => {
    setValidationState((prev) => ({ ...prev, isValidating: true }));

    const fieldNames = Object.keys(form.getValues()) as Array<Path<T>>;
    const validationResults = await Promise.all(
      fieldNames.map((fieldName) => validateField(fieldName)),
    );

    const isValid = validationResults.every((result) => result);

    setValidationState((prev) => ({
      ...prev,
      isValidating: false,
      hasErrors: !isValid,
    }));

    return isValid;
  }, [form, validateField]);

  // Server-side validation
  const performServerValidation = useCallback(
    async (data: T): Promise<Record<string, string>> => {
      if (!serverValidation) return {};

      try {
        const transformedData = serverValidation.transform
          ? serverValidation.transform(data)
          : data;

        const response = await fetch(serverValidation.endpoint, {
          method: serverValidation.method || "POST",
          headers: {
            "Content-Type": "application/json",
            ...serverValidation.headers,
          },
          body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return errorData.errors || {};
        }

        return {};
      } catch (error) {
        console.error("Server validation error:", error);
        return { general: "Server validation failed" };
      }
    },
    [serverValidation],
  );

  // Debounced field validation
  const debouncedValidateField = useCallback(
    (fieldName: Path<T>) => {
      const fieldNameStr = fieldName as string;
      clearDebounceTimer(fieldNameStr);

      const customValidator = customValidators[fieldNameStr];
      const delay = customValidator?.debounce || debounceMs;

      debounceTimers.current[fieldNameStr] = setTimeout(() => {
        validateField(fieldName);
      }, delay);
    },
    [validateField, customValidators, debounceMs, clearDebounceTimer],
  );

  // Mark field as touched
  const markFieldTouched = useCallback(
    (fieldName: Path<T>) => {
      const fieldNameStr = fieldName as string;
      setValidationState((prev) => ({
        ...prev,
        touchedFields: { ...prev.touchedFields, [fieldNameStr]: true },
      }));
      updateFieldState(fieldNameStr, { touched: true });
    },
    [updateFieldState],
  );

  // Mark all fields as touched
  const markAllFieldsTouched = useCallback(() => {
    const fieldNames = Object.keys(form.getValues());
    const touchedFields = fieldNames.reduce(
      (acc, fieldName) => {
        acc[fieldName] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setValidationState((prev) => ({ ...prev, touchedFields }));
  }, [form]);

  // Clear field error
  const clearFieldError = useCallback(
    (fieldName: Path<T>) => {
      const fieldNameStr = fieldName as string;
      form.clearErrors(fieldName);
      updateFieldState(fieldNameStr, {
        hasError: false,
        error: undefined,
      });

      // Clear server error
      setValidationState((prev) => ({
        ...prev,
        serverErrors: { ...prev.serverErrors, [fieldNameStr]: "" },
      }));
    },
    [form, updateFieldState],
  );

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    form.clearErrors();
    setValidationState((prev) => ({
      ...prev,
      serverErrors: {},
      hasErrors: false,
      fieldStates: Object.keys(prev.fieldStates).reduce(
        (acc, fieldName) => {
          acc[fieldName] = {
            ...prev.fieldStates[fieldName],
            hasError: false,
            error: undefined,
          };
          return acc;
        },
        {} as ValidationState["fieldStates"],
      ),
    }));
  }, [form]);

  // Set server error
  const setServerError = useCallback(
    (fieldName: Path<T>, error: string) => {
      const fieldNameStr = fieldName as string;
      setValidationState((prev) => ({
        ...prev,
        serverErrors: { ...prev.serverErrors, [fieldNameStr]: error },
      }));
      form.setError(fieldName, { message: error });
      updateFieldState(fieldNameStr, {
        hasError: true,
        error,
      });
    },
    [form, updateFieldState],
  );

  // Set multiple server errors
  const setServerErrors = useCallback(
    (errors: Record<string, string>) => {
      setValidationState((prev) => ({
        ...prev,
        serverErrors: { ...prev.serverErrors, ...errors },
      }));

      Object.entries(errors).forEach(([fieldName, error]) => {
        form.setError(fieldName as Path<T>, { message: error });
        updateFieldState(fieldName, {
          hasError: true,
          error,
        });
      });
    },
    [form, updateFieldState],
  );

  // Reset validation state
  const resetValidationState = useCallback(() => {
    setValidationState({
      isValidating: false,
      hasErrors: false,
      touchedFields: {},
      validatedFields: {},
      serverErrors: {},
      fieldStates: {},
    });
    setSubmissionState({
      isSubmitting: false,
      isValidating: false,
      hasAttemptedSubmit: false,
      submitCount: 0,
      errors: {},
    });
  }, []);

  // Enhanced form submission
  const handleSubmit = useCallback(
    (
      onValid: (data: T) => Promise<void> | void,
      onInvalid?: (errors: any) => void,
    ) => {
      return async (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();

        setSubmissionState((prev) => ({
          ...prev,
          hasAttemptedSubmit: true,
          isSubmitting: true,
          isValidating: true,
        }));

        try {
          // Client-side validation
          const isValid = await validateAllFields();

          if (!isValid) {
            setSubmissionState((prev) => ({
              ...prev,
              isSubmitting: false,
              isValidating: false,
            }));

            if (onInvalid) {
              onInvalid(form.formState.errors);
            }
            return;
          }

          const formData = form.getValues();

          // Server-side validation
          if (serverValidation) {
            const serverErrors = await performServerValidation(formData);
            if (Object.keys(serverErrors).length > 0) {
              setServerErrors(serverErrors);
              setSubmissionState((prev) => ({
                ...prev,
                isSubmitting: false,
                isValidating: false,
                errors: serverErrors,
              }));

              if (onInvalid) {
                onInvalid(serverErrors);
              }
              return;
            }
          }

          setSubmissionState((prev) => ({ ...prev, isValidating: false }));

          // Execute submission
          await onValid(formData);

          setSubmissionState((prev) => ({
            ...prev,
            isSubmitting: false,
            submitCount: prev.submitCount + 1,
            lastSubmitTime: new Date(),
            errors: {},
          }));
        } catch (error) {
          console.error("Form submission error:", error);
          setSubmissionState((prev) => ({
            ...prev,
            isSubmitting: false,
            isValidating: false,
            errors: { general: "Submission failed. Please try again." },
          }));

          if (onInvalid) {
            onInvalid({ general: "Submission failed. Please try again." });
          }
        }
      };
    },
    [
      validateAllFields,
      form,
      serverValidation,
      performServerValidation,
      setServerErrors,
    ],
  );

  // Get form progress
  const getFormProgress = useCallback(() => {
    const formData = form.getValues();
    const fieldNames = Object.keys(formData);
    const totalFields = fieldNames.length;

    const completedFields = fieldNames.filter((fieldName) => {
      const value = formData[fieldName];
      return value !== undefined && value !== null && value !== "";
    }).length;

    const validFields = fieldNames.filter(
      (fieldName) => validationState.fieldStates[fieldName]?.isValid,
    ).length;

    const touchedFields = Object.keys(validationState.touchedFields).length;

    const percentage =
      totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

    return {
      totalFields,
      completedFields,
      validFields,
      touchedFields,
      percentage: Math.round(percentage),
    };
  }, [form, validationState.fieldStates, validationState.touchedFields]);

  // Get accessibility props for field
  const getFieldProps = useCallback(
    (fieldName: Path<T>) => {
      const fieldNameStr = fieldName as string;
      const fieldState = validationState.fieldStates[fieldNameStr];
      const hasError =
        !!form.formState.errors[fieldName] || fieldState?.hasError;

      return {
        "aria-invalid": hasError,
        "aria-describedby": hasError
          ? `${fieldNameStr}-error`
          : `${fieldNameStr}-description`,
        "aria-required": true, // This should be determined by schema
      };
    },
    [form.formState.errors, validationState.fieldStates],
  );

  // Utility methods
  const isDirtyField = useCallback(
    (fieldName: Path<T>) => {
      return !!form.formState.dirtyFields[fieldName];
    },
    [form.formState.dirtyFields],
  );

  const isValidField = useCallback(
    (fieldName: Path<T>) => {
      const fieldNameStr = fieldName as string;
      return validationState.fieldStates[fieldNameStr]?.isValid || false;
    },
    [validationState.fieldStates],
  );

  const canSubmit = useCallback(() => {
    return (
      !submissionState.isSubmitting &&
      !validationState.isValidating &&
      form.formState.isValid
    );
  }, [
    submissionState.isSubmitting,
    validationState.isValidating,
    form.formState.isValid,
  ]);

  // Real-time validation on field change
  useEffect(() => {
    if (!enableRealTimeValidation) return;

    const subscription = form.watch((value, { name, type }) => {
      if (name && type === "change") {
        const fieldName = name as Path<T>;

        // Mark field as dirty
        updateFieldState(name, { dirty: true });

        // Trigger validation for field and its dependencies
        debouncedValidateField(fieldName);

        // Trigger validation for dependent fields
        const dependentFields = Object.entries(customValidators)
          .filter(([_, validator]) =>
            validator.dependencies?.includes(fieldName),
          )
          .map(([fieldName]) => fieldName as Path<T>);

        dependentFields.forEach((depField) => {
          debouncedValidateField(depField);
        });

        // Trigger cross-field validation
        crossFieldValidation.forEach((crossValidation) => {
          if (
            crossValidation.triggerFields?.includes(fieldName) ||
            crossValidation.fields.includes(fieldName)
          ) {
            crossValidation.fields.forEach((field) => {
              if (field !== fieldName) {
                debouncedValidateField(field);
              }
            });
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [
    form,
    enableRealTimeValidation,
    debouncedValidateField,
    customValidators,
    crossFieldValidation,
    updateFieldState,
  ]);

  // Validate on mount if required
  useEffect(() => {
    if (validateOnMount) {
      validateAllFields();
    }
  }, [validateOnMount, validateAllFields]);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  return {
    ...form,
    validationState,
    submissionState,
    validateField,
    validateAllFields,
    clearFieldError,
    clearAllErrors,
    setServerError,
    setServerErrors,
    markFieldTouched,
    markAllFieldsTouched,
    resetValidationState,
    handleSubmit,
    getFormProgress,
    getFieldProps,
    isDirtyField,
    isValidField,
    canSubmit,
  };
}

export default useFormValidation;
