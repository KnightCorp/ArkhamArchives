/**
 * User utility functions for profile management
 */

import supabase from "./supabaseClient";

/**
 * Extract username from email address
 * @param email - The email address
 * @returns The username part (before @)
 */
export const getUsernameFromEmail = (email: string | null): string => {
  if (!email) return "User";
  return email.split("@")[0];
};

/**
 * Get or update user display name with email fallback
 * Uses Supabase function to ensure consistency
 * @param userId - The user ID
 * @returns Promise<string> - The display name
 */
export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc("get_user_display_name", {
      user_uuid: userId,
    });

    if (error) {
      console.warn("Error getting display name:", error);
      return "User";
    }

    return data || "User";
  } catch (error) {
    console.warn("Error in getUserDisplayName:", error);
    return "User";
  }
};

/**
 * Update user display name
 * @param userId - The user ID
 * @param displayName - The new display name
 * @returns Promise<boolean> - Success status
 */
export const updateUserDisplayName = async (
  userId: string,
  displayName: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating display name:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateUserDisplayName:", error);
    return false;
  }
};

/**
 * Initialize user profile with proper name handling
 * @param userId - The user ID
 * @param email - The user email
 * @param name - The user name (optional)
 * @returns Promise<string | null> - The referral code or null on error
 */
export const initializeUserProfile = async (
  userId: string,
  email: string | null = null,
  name: string | null = null
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc("initialize_user_profile", {
      user_uuid: userId,
      user_email: email,
      user_name: name,
    });

    if (error) {
      console.error("Error initializing user profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in initializeUserProfile:", error);
    return null;
  }
};
