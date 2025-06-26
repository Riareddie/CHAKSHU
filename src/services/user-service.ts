/**
 * User Service
 * Handles user account creation and verification for database operations
 */

import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserCreationResult {
  success: boolean;
  error?: string;
  created?: boolean;
}

/**
 * Ensures a user exists in the database, creating them if necessary
 */
export async function ensureUserExists(
  authUser: User,
): Promise<UserCreationResult> {
  try {
    // First check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", authUser.id)
      .single();

    if (checkError && checkError.code === "PGRST116") {
      // User doesn't exist, create them
      console.log("Creating new user in database:", authUser.id);

      const { error: createError } = await supabase.from("users").insert({
        id: authUser.id,
        email: authUser.email || "",
        full_name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User",
        phone_number: authUser.user_metadata?.phone_number || null,
        user_role: "citizen",
        is_verified: !!authUser.email_confirmed_at,
        is_banned: false,
      });

      if (createError) {
        console.error("Failed to create user:", createError);
        return {
          success: false,
          error: `Failed to create user account: ${createError.message}`,
        };
      }

      console.log("User created successfully");
      return { success: true, created: true };
    } else if (checkError) {
      console.error("Error checking user existence:", checkError);
      return {
        success: false,
        error: `Database error: ${checkError.message}`,
      };
    }

    // User exists
    return { success: true, created: false };
  } catch (error) {
    console.error("Unexpected error in ensureUserExists:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Updates user information if needed
 */
export async function updateUserInfo(
  authUser: User,
): Promise<UserCreationResult> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        email: authUser.email || "",
        full_name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User",
        phone_number: authUser.user_metadata?.phone_number || null,
        is_verified: !!authUser.email_confirmed_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authUser.id);

    if (error) {
      console.error("Failed to update user:", error);
      return {
        success: false,
        error: `Failed to update user: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Checks if user has necessary permissions for a given action
 */
export async function checkUserPermissions(
  userId: string,
  action: string,
): Promise<boolean> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("user_role, is_banned, is_verified")
      .eq("id", userId)
      .single();

    if (error || !user) {
      console.error("Failed to check user permissions:", error);
      return false;
    }

    // User is banned
    if (user.is_banned) {
      return false;
    }

    // For basic actions like creating reports, just need to not be banned
    if (action === "create_report") {
      return true;
    }

    // For admin actions
    if (action === "admin" && user.user_role !== "admin") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}
