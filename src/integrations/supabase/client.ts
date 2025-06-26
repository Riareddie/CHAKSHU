import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly configured.",
  );
}

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "X-Client-Info": "chakshu-portal@1.0.0",
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  },
);

// Remove demo mode functionality - now requires proper Supabase setup
export const isDemoMode = false;

// Enhanced error handling for API calls
export const handleSupabaseError = (error: any) => {
  if (error?.code === "PGRST116") {
    return "No data found";
  }
  if (error?.code === "PGRST301") {
    return "Invalid input data";
  }
  if (error?.code === "23505") {
    return "This record already exists";
  }
  if (error?.code === "23503") {
    return "Referenced record not found";
  }
  return error?.message || "An unexpected error occurred";
};

// Connection health check
export const checkConnection = async (): Promise<{
  connected: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("system_config")
      .select("id")
      .limit(1);

    if (error) {
      return { connected: false, error: handleSupabaseError(error) };
    }

    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
};

// Auth helpers
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Type-safe query helpers
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
): Promise<{ data: T | null; error: string | null; success: boolean }> => {
  try {
    const result = await queryFn();

    if (result.error) {
      return {
        data: null,
        error: handleSupabaseError(result.error),
        success: false,
      };
    }

    return {
      data: result.data,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    };
  }
};

// Real-time subscription helper
export const createSubscription = (
  table: string,
  callback: (payload: any) => void,
  filter?: string,
) => {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table,
        filter,
      },
      callback,
    )
    .subscribe();

  return () => channel.unsubscribe();
};

export default supabase;
