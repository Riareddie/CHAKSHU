/**
 * API Client with HTTP Interceptors
 * Handles automatic authentication headers, token refresh, and error handling
 */

import { authService } from "./auth";
import { toast } from "@/hooks/use-toast";

// Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Request/Response interfaces
export interface ApiRequestConfig extends RequestInit {
  url?: string;
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make an authenticated API request
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = API_CONFIG.RETRY_ATTEMPTS,
      skipAuth = false,
      skipErrorHandling = false,
      ...fetchOptions
    } = options;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    // Prepare headers
    const headers = new Headers({
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    });

    // Add authentication if not skipped and user is authenticated
    if (!skipAuth && authService.isAuthenticated) {
      // Note: With HTTP-only cookies, we don't need to manually add auth headers
      // The browser will automatically include the authentication cookies
    }

    // Prepare request config
    const requestConfig: RequestInit = {
      ...fetchOptions,
      headers,
      credentials: "include", // Always include cookies for authentication
    };

    // Execute request with retry logic
    return this.executeWithRetry(
      url,
      requestConfig,
      retries,
      skipErrorHandling,
    );
  }

  /**
   * Execute request with automatic retry on failure
   */
  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retries: number,
    skipErrorHandling: boolean,
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.executeRequest<T>(url, config);

        // If successful, return the response
        if (response.success || response.data) {
          return response;
        }

        // If not successful but no network error, don't retry
        if (!skipErrorHandling) {
          this.handleApiError(response as any);
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        // Check if it's a network error worth retrying
        if (this.isRetryableError(error as Error) && attempt < retries) {
          // Wait before retry with exponential backoff
          await this.delay(API_CONFIG.RETRY_DELAY * Math.pow(2, attempt));
          continue;
        }

        // If not retryable or max retries reached, handle the error
        if (!skipErrorHandling) {
          this.handleNetworkError(error as Error);
        }

        throw error;
      }
    }

    throw lastError;
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest<T>(
    url: string,
    config: RequestInit,
  ): Promise<ApiResponse<T>> {
    const response = await fetch(url, config);

    // Handle HTTP errors
    if (!response.ok) {
      await this.handleHttpError(response);
    }

    // Parse response
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Transform to standard API response format
    return this.transformResponse<T>(data, response);
  }

  /**
   * Handle HTTP error responses
   */
  private async handleHttpError(response: Response): Promise<void> {
    const status = response.status;

    // Handle authentication errors
    if (status === 401) {
      // Try to refresh the token
      try {
        const refreshed = await authService.refreshTokens();
        if (!refreshed) {
          // If refresh fails, redirect to login
          this.handleAuthenticationFailure();
        }
      } catch (error) {
        this.handleAuthenticationFailure();
      }
      return;
    }

    // Handle authorization errors
    if (status === 403) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      });
      return;
    }

    // Handle rate limiting
    if (status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many requests. Please try again ${retryAfter ? `in ${retryAfter} seconds` : "later"}.`,
        variant: "destructive",
      });
      return;
    }

    // Handle server errors
    if (status >= 500) {
      toast({
        title: "Server Error",
        description:
          "An internal server error occurred. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // For other errors, let the response be processed normally
  }

  /**
   * Handle authentication failure
   */
  private handleAuthenticationFailure(): void {
    // Clear authentication state
    authService.logout();

    // Show notification
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please log in again.",
      variant: "destructive",
    });

    // Redirect to login page
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/") {
      sessionStorage.setItem("redirectAfterLogin", currentPath);
    }

    window.location.href = "/login";
  }

  /**
   * Transform response to standard format
   */
  private transformResponse<T>(data: any, response: Response): ApiResponse<T> {
    // If data is already in the correct format
    if (typeof data === "object" && data !== null && "success" in data) {
      return data;
    }

    // Transform to standard format
    return {
      data: data,
      success: response.ok,
      message: response.statusText,
    };
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: ApiError): void {
    const message = error.message || "An unexpected error occurred";

    toast({
      title: "API Error",
      description: message,
      variant: "destructive",
    });
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(error: Error): void {
    console.error("Network error:", error);

    if (error.name === "AbortError") {
      toast({
        title: "Request Cancelled",
        description: "The request was cancelled.",
        variant: "destructive",
      });
    } else if (error.message.includes("fetch")) {
      toast({
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: Error): boolean {
    // Network errors that are worth retrying
    return (
      error.name === "TypeError" || // Network error
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("timeout")
    );
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Convenience methods for different HTTP verbs

  async get<T = any>(
    endpoint: string,
    options?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(
    endpoint: string,
    options?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  // File upload method
  async upload<T = any>(
    endpoint: string,
    file: File | FormData,
    options?: Omit<ApiRequestConfig, "body">,
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    }

    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...options?.headers,
        "Content-Type": undefined,
      } as any,
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiRequestConfig, ApiResponse, ApiError };
