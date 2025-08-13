import { supabase } from "../../../lib/supabaseClient";

export interface Profile {
  id: string;
  display_name: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  xp: number;
  total_xp: number;
  level: number;
  karma: number;
  current_streak: number;
  longest_streak: number;
  total_earnings: number;
  is_verified: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  interests: string[];
  values: string[];
  aesthetics: string[];
  genres: string[];
  moods: string[]; // Add the new moods field
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_type: "collectible" | "badge" | "theme" | "effect";
  item_name: string;
  item_rarity: "common" | "rare" | "epic" | "legendary";
  item_image_url: string | null;
  acquired_at: string;
  is_equipped: boolean;
  metadata: Record<string, any>;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type:
    | "content_creator"
    | "social_butterfly"
    | "explorer"
    | "trendsetter";
  progress: number;
  max_progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const profileQueries = {
  // Profile operations
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createProfile(profile: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert(profile)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Avatar upload
  async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete old avatar if exists
      await supabase.storage.from("avatars").remove([fileName]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId)
        .select()
        .single();

      return { data: publicUrl, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Preferences operations
  async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async upsertUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ) {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .upsert(
          {
            user_id: userId,
            ...preferences,
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Inventory operations
  async getUserInventory(userId: string, itemType?: string) {
    try {
      let query = supabase
        .from("user_inventory")
        .select("*")
        .eq("user_id", userId)
        .order("acquired_at", { ascending: false });

      if (itemType) {
        query = query.eq("item_type", itemType);
      }

      const { data, error } = await query;

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async addInventoryItem(
    userId: string,
    item: Omit<InventoryItem, "id" | "user_id" | "acquired_at">
  ) {
    try {
      const { data, error } = await supabase
        .from("user_inventory")
        .insert({
          user_id: userId,
          ...item,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateInventoryItem(itemId: string, updates: Partial<InventoryItem>) {
    try {
      const { data, error } = await supabase
        .from("user_inventory")
        .update(updates)
        .eq("id", itemId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteInventoryItem(itemId: string) {
    try {
      const { error } = await supabase
        .from("user_inventory")
        .delete()
        .eq("id", itemId);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Achievement operations
  async getUserAchievements(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId)
        .order("achievement_type");

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateAchievementProgress(
    userId: string,
    achievementType: string,
    progress: number
  ) {
    try {
      const { data, error } = await supabase
        .from("user_achievements")
        .update({
          progress,
          completed: progress >= 100,
          completed_at: progress >= 100 ? new Date().toISOString() : null,
        })
        .eq("user_id", userId)
        .eq("achievement_type", achievementType)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createDefaultAchievements(userId: string) {
    try {
      const { data, error } = await supabase.rpc(
        "create_default_achievements",
        { user_id: userId }
      );

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Stats operations
  async getProfileStats(userId: string) {
    try {
      // Get profile data
      const { data: profile, error: profileError } = await this.getProfile(
        userId
      );
      if (profileError) throw profileError;

      // Get achievements
      const { data: achievements, error: achievementsError } =
        await this.getUserAchievements(userId);
      if (achievementsError) throw achievementsError;

      // Get inventory count
      const { data: inventory, error: inventoryError } =
        await this.getUserInventory(userId);
      if (inventoryError) throw inventoryError;

      // Calculate stats
      const stats = {
        achievementScore: profile?.total_xp || 0,
        followers: 0, // You might want to implement a followers system
        contentRating: 4.8, // Calculate based on actual content ratings
        profileViews: Math.floor(Math.random() * 50000) + 1000, // Implement view tracking
        level: profile?.level || 1,
        xp: profile?.xp || 0,
        totalXp: profile?.total_xp || 0,
        karma: profile?.karma || 0,
        currentStreak: profile?.current_streak || 0,
        longestStreak: profile?.longest_streak || 0,
        inventoryCount: inventory?.length || 0,
        achievements: achievements || [],
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Check if username is available
  async isUsernameAvailable(username: string, currentUserId?: string) {
    try {
      let query = supabase
        .from("profiles")
        .select("id")
        .eq("username", username);

      if (currentUserId) {
        query = query.neq("id", currentUserId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { available: !data || data.length === 0, error: null };
    } catch (error) {
      return { available: false, error };
    }
  },
};
