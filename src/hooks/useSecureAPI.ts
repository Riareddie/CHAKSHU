/**
 * Secure API Client Hook
 * Provides session-aware API requests with automatic CSRF protection
 */

import { useCallback } from "react";
import { useAuth } from "@/contexts/SecureAuthContext";
import { toast } from "@/hooks/use-toast";

interface ApiRequestOptions extends RequestInit {
  skipCSRF?: boolean;
  skipAuth?: boolean;
  timeout?: number;
}

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export const useSecureAPI = () => {
  const { getCSRFToken, updateActivity, isAuthenticated } = useAuth();

  const makeRequest = useCallback(
    async <T = any>(
      endpoint: string,
      options: ApiRequestOptions = {},
    ): Promise<ApiResponse<T>> => {
      const {
        skipCSRF = false,
        skipAuth = false,
        timeout = 30000,
        ...fetchOptions
      } = options;

      // Update user activity
      if (isAuthenticated) {
        updateActivity("api_request", { endpoint });
      }

      // Prepare headers
      const headers = new Headers(fetchOptions.headers);
      headers.set("Content-Type", "application/json");

      // Add CSRF token if not skipped and available
      if (!skipCSRF) {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          headers.set("X-CSRF-Token", csrfToken);
        }
      }

      // Add device fingerprint for security
      const deviceInfo = {
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };
      headers.set("X-Device-Info", btoa(JSON.stringify(deviceInfo)));

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(endpoint, {
          ...fetchOptions,
          headers,
          credentials: "include", // Always include cookies
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
          if (response.status === 401) {
            toast({
              title: "Authentication Required",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });

            // Redirect to login
            window.location.href = "/login";
            throw new Error("Authentication required");
          }

          if (response.status === 403) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to perform this action.",
              variant: "destructive",
            });
            throw new Error("Access denied");
          }

          if (response.status === 429) {
            toast({
              title: "Rate Limit Exceeded",
              description: "Too many requests. Please try again later.",
              variant: "destructive",
            });
            throw new Error("Rate limit exceeded");
          }

          // For other errors, try to parse error message
          let errorMessage = "An error occurred";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = response.statusText || errorMessage;
          }

          throw new Error(errorMessage);
        }

        // Parse response
        const contentType = response.headers.get("content-type");
        let data: any;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        // Return standardized response
        return {
          data: data.data || data,
          success: true,
          message: data.message,
          errors: data.errors,
        };
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            toast({
              title: "Request Timeout",
              description: "The request took too long to complete.",
              variant: "destructive",
            });
            throw new Error("Request timeout");
          }

          // Network errors
          if (error.message.includes("fetch")) {
            toast({
              title: "Network Error",
              description: "Unable to connect to the server.",
              variant: "destructive",
            });
            throw new Error("Network error");
          }
        }

        throw error;
      }
    },
    [getCSRFToken, updateActivity, isAuthenticated],
  );

  // Convenience methods
  const get = useCallback(
    <T = any>(endpoint: string, options?: ApiRequestOptions) => {
      return makeRequest<T>(endpoint, { ...options, method: "GET" });
    },
    [makeRequest],
  );

  const post = useCallback(
    <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) => {
      return makeRequest<T>(endpoint, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [makeRequest],
  );

  const put = useCallback(
    <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) => {
      return makeRequest<T>(endpoint, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [makeRequest],
  );

  const patch = useCallback(
    <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) => {
      return makeRequest<T>(endpoint, {
        ...options,
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [makeRequest],
  );

  const del = useCallback(
    <T = any>(endpoint: string, options?: ApiRequestOptions) => {
      return makeRequest<T>(endpoint, { ...options, method: "DELETE" });
    },
    [makeRequest],
  );

  return {
    request: makeRequest,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};

export default useSecureAPI;
