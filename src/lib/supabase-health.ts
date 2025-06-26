import { supabase, isDemoMode } from "@/integrations/supabase/client";

export interface SupabaseHealthCheck {
  isAvailable: boolean;
  responseTime?: number;
  error?: string;
}

/**
 * Checks the health of the Supabase connection
 * Returns availability status, response time, and any errors
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthCheck> {
  // If we're in demo mode, return offline status
  if (isDemoMode) {
    return {
      isAvailable: false,
      error: "Demo mode - Supabase not configured",
    };
  }

  const startTime = Date.now();

  try {
    // Simple health check by attempting to get the current session
    // This is a lightweight operation that tests the connection
    const { error } = await supabase.auth.getSession();

    const responseTime = Date.now() - startTime;

    if (error && error.message !== "Demo mode active") {
      return {
        isAvailable: false,
        responseTime,
        error: error.message,
      };
    }

    return {
      isAvailable: true,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      isAvailable: false,
      responseTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Performs a more comprehensive health check including database connectivity
 */
export async function checkSupabaseFullHealth(): Promise<SupabaseHealthCheck> {
  if (isDemoMode) {
    return {
      isAvailable: false,
      error: "Demo mode - Supabase not configured",
    };
  }

  const startTime = Date.now();

  try {
    // Test both auth and database connectivity
    const [authResult, dbResult] = await Promise.allSettled([
      supabase.auth.getSession(),
      supabase.from("reports").select("count", { count: "exact", head: true }),
    ]);

    const responseTime = Date.now() - startTime;

    // Check if both operations succeeded
    const authSuccess =
      authResult.status === "fulfilled" &&
      (!authResult.value.error ||
        authResult.value.error.message === "Demo mode active");

    const dbSuccess = dbResult.status === "fulfilled" && !dbResult.value.error;

    if (!authSuccess || !dbSuccess) {
      let error = "Service unavailable";

      if (authResult.status === "rejected") {
        error = `Auth error: ${authResult.reason}`;
      } else if (dbResult.status === "rejected") {
        error = `Database error: ${dbResult.reason}`;
      } else if (
        authResult.value.error &&
        authResult.value.error.message !== "Demo mode active"
      ) {
        error = `Auth error: ${authResult.value.error.message}`;
      } else if (dbResult.status === "fulfilled" && dbResult.value.error) {
        error = `Database error: ${dbResult.value.error.message}`;
      }

      return {
        isAvailable: false,
        responseTime,
        error,
      };
    }

    return {
      isAvailable: true,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      isAvailable: false,
      responseTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
