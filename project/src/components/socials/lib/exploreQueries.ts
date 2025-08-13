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

export interface Creator {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  follower_count: number;
  content_count: number;
  categories: string[];
  verified: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentStyle {
  id: string;
  title: string;
  curator_id: string;
  curator_name: string;
  curator_avatar: string | null;
  description: string | null;
  aesthetics_used: string[];
  moodboard: any[];
  tags: string[];
  featured: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface CompatibilityProfile {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  location: string;
  xp: number;
  level: number;
  karma: number;
  is_verified: boolean;
  media: any[];
  interests: string[];
  user_values: string[];
  aesthetics: string[];
  genres: string[];
  compatibility_score: number;
}

export interface InterestGroup {
  id: string;
  name: string;
  curator_id: string;
  curator_name: string;
  curator_avatar: string | null;
  description: string | null;
  interests_covered: string[];
  featured_content: any[];
  member_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  organizer_id: string;
  organizer_name: string;
  location_name: string;
  location_distance: number | null;
  location_city: string | null;
  location_coordinates: any;
  event_interests: string[];
  event_aesthetics: string[];
  image_url: string | null;
  event_date: string;
  event_time: string;
  attendee_count: number;
  max_attendees: number | null;
  description: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: any;
  distance: number | null;
  rating: number;
  image_url: string | null;
  open_hours: string | null;
  location_type: "venue" | "restaurant" | "cafe" | "park" | "gallery" | "club";
  related_interests: string[]; // Added this field
  amenities: string[];
  featured: boolean;
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
  async getCompatibleProfiles(userId: string, limit: number = 10) {
    try {
      const { data, error } = await supabase.rpc("get_compatible_profiles", {
        target_user_id: userId,
        limit_count: limit,
      });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Helper functions using the new database functions
  async isFollowingCreator(userId: string, creatorId: string) {
    try {
      const { data, error } = await supabase.rpc("is_following_creator", {
        target_user_id: userId,
        target_creator_id: creatorId,
      });

      return { data: data || false, error };
    } catch (error) {
      return { data: false, error };
    }
  },

  async isAttendingEvent(userId: string, eventId: string) {
    try {
      const { data, error } = await supabase.rpc("is_attending_event", {
        target_user_id: userId,
        target_event_id: eventId,
      });

      return { data: data || false, error };
    } catch (error) {
      return { data: false, error };
    }
  },

  async isGroupMember(userId: string, groupId: string) {
    try {
      const { data, error } = await supabase.rpc("is_group_member", {
        target_user_id: userId,
        target_group_id: groupId,
      });

      return { data: data || false, error };
    } catch (error) {
      return { data: false, error };
    }
  },

  async hasLikedStyle(userId: string, styleId: string) {
    try {
      const { data, error } = await supabase.rpc("has_liked_style", {
        target_user_id: userId,
        target_style_id: styleId,
      });

      return { data: data || false, error };
    } catch (error) {
      return { data: false, error };
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

  // Explore functionality queries

  // Get personalized creators based on user preferences
  async getPersonalizedCreators(userId: string, limit: number = 10) {
    try {
      const { data: preferences } = await this.getUserPreferences(userId);

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .or(
          preferences?.interests?.length
            ? `categories.ov.{${preferences.interests.join(",")}}`
            : "featured.eq.true"
        )
        .order("follower_count", { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get personalized content styles based on user aesthetics
  async getPersonalizedStyles(userId: string, limit: number = 10) {
    try {
      const { data: preferences } = await this.getUserPreferences(userId);

      const { data, error } = await supabase
        .from("content_styles")
        .select("*")
        .or(
          preferences?.aesthetics?.length
            ? `aesthetics_used.ov.{${preferences.aesthetics.join(",")}}`
            : "featured.eq.true"
        )
        .order("like_count", { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get personalized interest groups based on user interests
  async getPersonalizedInterestGroups(userId: string, limit: number = 10) {
    try {
      const { data: preferences } = await this.getUserPreferences(userId);

      const { data, error } = await supabase
        .from("interest_groups")
        .select("*")
        .or(
          preferences?.interests?.length
            ? `interests_covered.ov.{${preferences.interests.join(",")}}`
            : "featured.eq.true"
        )
        .order("member_count", { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get personalized events based on user preferences
  async getPersonalizedEvents(userId: string, limit: number = 10) {
    try {
      const { data: preferences } = await this.getUserPreferences(userId);

      let query = supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0]);

      if (preferences?.interests?.length || preferences?.aesthetics?.length) {
        const conditions = [];
        if (preferences.interests?.length) {
          conditions.push(
            `event_interests.ov.{${preferences.interests.join(",")}}`
          );
        }
        if (preferences.aesthetics?.length) {
          conditions.push(
            `event_aesthetics.ov.{${preferences.aesthetics.join(",")}}`
          );
        }
        query = query.or(conditions.join(","));
      } else {
        query = query.eq("featured", true);
      }

      const { data, error } = await query
        .order("event_date", { ascending: true })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update getAllEvents to include new event columns
  async getAllEvents(userId?: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true })
        .limit(limit);

      if (error) throw error;

      // If userId is provided, check attendance status for each event
      let eventsWithAttendance = data;
      if (userId && data) {
        const attendanceChecks = await Promise.all(
          data.map(async (event) => {
            const { data: isAttending } = await this.isAttendingEvent(
              userId,
              event.id
            );
            return { ...event, is_attending: isAttending };
          })
        );
        eventsWithAttendance = attendanceChecks;
      }

      return { data: eventsWithAttendance, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get personalized locations based on user interests
  async getPersonalizedLocations(userId: string, limit: number = 10) {
    try {
      const { data: preferences } = await this.getUserPreferences(userId);

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .or(
          preferences?.interests?.length
            ? `related_interests.ov.{${preferences.interests.join(",")}}`
            : "featured.eq.true"
        )
        .order("rating", { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Creator operations
  async createCreatorProfile(userId: string, creatorData: Partial<Creator>) {
    try {
      const { data: profile } = await this.getProfile(userId);

      const { data, error } = await supabase
        .from("creators")
        .insert({
          user_id: userId,
          name: profile?.display_name || profile?.username || "Creator",
          avatar_url: profile?.avatar_url,
          bio: profile?.bio,
          ...creatorData,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateCreatorProfile(userId: string, updates: Partial<Creator>) {
    try {
      const { data, error } = await supabase
        .from("creators")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCreatorProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", userId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserFollowedCreators(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_follows_creators")
        .select(
          `
          creator_id,
          creators (*)
        `
        )
        .eq("user_id", userId);

      return { data: data?.map((item) => item.creators) || [], error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Content style operations
  async createContentStyle(
    userId: string,
    styleData: Omit<
      ContentStyle,
      | "id"
      | "curator_id"
      | "curator_name"
      | "curator_avatar"
      | "created_at"
      | "updated_at"
    >
  ) {
    try {
      const { data: profile } = await this.getProfile(userId);

      const { data, error } = await supabase
        .from("content_styles")
        .insert({
          curator_id: userId,
          curator_name: profile?.display_name || profile?.username || "User",
          curator_avatar: profile?.avatar_url,
          ...styleData,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateContentStyle(styleId: string, updates: Partial<ContentStyle>) {
    try {
      const { data, error } = await supabase
        .from("content_styles")
        .update(updates)
        .eq("id", styleId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserContentStyles(userId: string) {
    try {
      const { data, error } = await supabase
        .from("content_styles")
        .select("*")
        .eq("curator_id", userId)
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Like/Unlike content styles
  async likeContentStyle(userId: string, styleId: string) {
    try {
      const { data, error } = await supabase
        .from("content_style_likes")
        .insert({
          user_id: userId,
          style_id: styleId,
        })
        .select()
        .single();

      // Update like count
      if (!error) {
        await supabase.rpc("increment_style_likes", {
          style_id: styleId,
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async unlikeContentStyle(userId: string, styleId: string) {
    try {
      const { error } = await supabase
        .from("content_style_likes")
        .delete()
        .eq("user_id", userId)
        .eq("style_id", styleId);

      // Update like count
      if (!error) {
        await supabase.rpc("decrement_style_likes", {
          style_id: styleId,
        });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Interest group operations
  async createInterestGroup(
    userId: string,
    groupData: Omit<
      InterestGroup,
      | "id"
      | "curator_id"
      | "curator_name"
      | "curator_avatar"
      | "created_at"
      | "updated_at"
    >
  ) {
    try {
      const { data: profile } = await this.getProfile(userId);

      const { data, error } = await supabase
        .from("interest_groups")
        .insert({
          curator_id: userId,
          curator_name: profile?.display_name || profile?.username || "User",
          curator_avatar: profile?.avatar_url,
          ...groupData,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async joinInterestGroup(userId: string, groupId: string) {
    try {
      const { data, error } = await supabase
        .from("interest_group_members")
        .insert({
          user_id: userId,
          group_id: groupId,
        })
        .select()
        .single();

      // Update member count
      if (!error) {
        await supabase.rpc("increment_group_members", {
          group_id: groupId,
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async leaveInterestGroup(userId: string, groupId: string) {
    try {
      const { error } = await supabase
        .from("interest_group_members")
        .delete()
        .eq("user_id", userId)
        .eq("group_id", groupId);

      // Update member count
      if (!error) {
        await supabase.rpc("decrement_group_members", {
          group_id: groupId,
        });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  },

  async getUserInterestGroups(userId: string) {
    try {
      const { data, error } = await supabase
        .from("interest_group_members")
        .select(
          `
          group_id,
          interest_groups (*)
        `
        )
        .eq("user_id", userId);

      return { data: data?.map((item) => item.interest_groups) || [], error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Event operations
  async createEvent(
    userId: string,
    eventData: Omit<
      Event,
      "id" | "organizer_id" | "organizer_name" | "created_at" | "updated_at"
    >
  ) {
    try {
      const { data: profile } = await this.getProfile(userId);

      const { data, error } = await supabase
        .from("events")
        .insert({
          organizer_id: userId,
          organizer_name:
            profile?.display_name || profile?.username || "Organizer",
          ...eventData,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserEvents(
    userId: string,
    type: "created" | "attending" = "attending"
  ) {
    try {
      if (type === "created") {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("organizer_id", userId)
          .order("event_date", { ascending: true });

        return { data, error };
      } else {
        const { data, error } = await supabase
          .from("event_attendees")
          .select(
            `
            event_id,
            status,
            events (*)
          `
          )
          .eq("user_id", userId)
          .eq("status", "attending");

        return { data: data?.map((item) => item.events) || [], error };
      }
    } catch (error) {
      return { data: null, error };
    }
  },
  // Add these to your profileQueries object
  async getAllLocations(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("rating", { ascending: false })
        .limit(limit);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getFeaturedLocations(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("featured", true)
        .order("rating", { ascending: false })
        .limit(limit);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  // Get comprehensive explore data for dashboard
  async getExploreData(userId: string) {
    try {
      const [
        creatorsResult,
        stylesResult,
        groupsResult,
        eventsResult,
        locationsResult,
      ] = await Promise.all([
        this.getPersonalizedCreators(userId, 6),
        this.getPersonalizedStyles(userId, 6),
        this.getPersonalizedInterestGroups(userId, 6),
        this.getPersonalizedEvents(userId, 6),
        this.getPersonalizedLocations(userId, 6),
      ]);

      return {
        data: {
          creators: creatorsResult.data || [],
          styles: stylesResult.data || [],
          interestGroups: groupsResult.data || [],
          events: eventsResult.data || [],
          locations: locationsResult.data || [],
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Search functionality
  async searchContent(
    query: string,
    type?: "creators" | "styles" | "groups" | "events" | "locations"
  ) {
    try {
      if (!type) {
        // Search across all content types with enhanced fields
        const [creators, styles, groups, events, locations] = await Promise.all(
          [
            supabase
              .from("creators")
              .select("*")
              .or(`name.ilike.%${query}%,bio.ilike.%${query}%`)
              .limit(5),
            supabase
              .from("content_styles")
              .select("*")
              .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
              .limit(5),
            supabase
              .from("interest_groups")
              .select("*")
              .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
              .limit(5),
            supabase
              .from("events")
              .select("*")
              .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
              .limit(5),
            supabase
              .from("locations")
              .select("*")
              .or(
                `name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`
              )
              .limit(5),
          ]
        );

        return {
          data: {
            creators: creators.data || [],
            styles: styles.data || [],
            groups: groups.data || [],
            events: events.data || [],
            locations: locations.data || [],
          },
          error: null,
        };
      } else {
        const tableName =
          type === "creators"
            ? "creators"
            : type === "styles"
            ? "content_styles"
            : type === "groups"
            ? "interest_groups"
            : type === "events"
            ? "events"
            : "locations";

        let searchCondition = "";
        if (type === "creators") {
          searchCondition = `name.ilike.%${query}%,bio.ilike.%${query}%`;
        } else if (type === "styles") {
          searchCondition = `title.ilike.%${query}%,description.ilike.%${query}%`;
        } else if (type === "groups") {
          searchCondition = `name.ilike.%${query}%,description.ilike.%${query}%`;
        } else if (type === "events") {
          searchCondition = `title.ilike.%${query}%,description.ilike.%${query}%`;
        } else {
          searchCondition = `name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`;
        }

        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .or(searchCondition)
          .limit(20);

        return { data, error };
      }
    } catch (error) {
      return { data: null, error };
    }
  },
};
// People/Compatibility matching functions
export const getCompatibleProfiles = async (
  userId: string,
  limit: number = 10
) => {
  try {
    const { data, error } = await supabase.rpc("get_compatible_profiles", {
      target_user_id: userId,
      limit_count: limit,
    });

    if (error) throw error;

    // Transform data to match the expected interface
    return (
      data?.map((profile: any) => ({
        id: profile.id,
        display_name: profile.display_name, // ✅ add this line
        personalityProfile: {
          traits: profile.interests?.slice(0, 3) || ["Explorer"],
        },
        seductiveArchetype: {
          primaryArchetype: profile.aesthetics?.[0] || "Enigmatic",
        },
        coreValues: {
          attachmentStyle: profile.user_values?.[0] || "Secure",
          emotionalIntelligence: Math.min(profile.level || 1, 10),
        },
        communicationStyle: {
          emotionalExpression: Math.min(profile.karma / 10 || 5, 10),
        },
        interests: {
          hobbies: profile.interests || [],
        },
        media:
          profile.media?.length > 0
            ? profile.media
            : [
                {
                  type: "image",
                  url:
                    profile.avatar_url ||
                    "https://images.unsplash.com/photo-1494790108755-2616b332c74c?w=400&h=400&fit=crop",
                },
              ],
        matchPercentage: profile.compatibility_score || 0,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching compatible profiles:", error);
    return [];
  }
};

export const getAllCreators = async (limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .order("follower_count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching creators:", error);
    return [];
  }
};

export const getFeaturedCreators = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .eq("featured", true)
      .order("follower_count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured creators:", error);
    return [];
  }
};

export const getNewCreators = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching new creators:", error);
    return [];
  }
};

export const followCreator = async (userId: string, creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_follows_creators")
      .insert({
        user_id: userId,
        creator_id: creatorId,
      })
      .select()
      .single();

    if (error) throw error;

    // Update follower count
    await supabase.rpc("increment_creator_followers", {
      creator_id: creatorId,
    });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const unfollowCreator = async (userId: string, creatorId: string) => {
  try {
    const { error } = await supabase
      .from("user_follows_creators")
      .delete()
      .eq("user_id", userId)
      .eq("creator_id", creatorId);

    if (error) throw error;

    // Update follower count
    await supabase.rpc("decrement_creator_followers", {
      creator_id: creatorId,
    });

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Events functions
export const getAllEvents = async (limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Transform data to match expected interface
    return (
      data?.map((event: any) => ({
        id: event.id,
        title: event.title,
        organizer_name: event.organizer_name,
        location: {
          name: event.location_name,
          distance: event.location_distance || 0,
          city: event.location_city || "",
        },
        categories:
          event.event_interests?.reduce((acc: any, interest: string) => {
            acc[interest] = 1;
            return acc;
          }, {}) || {},
        image_url: event.image_url,
        date: event.event_date,
        time: event.event_time,
        attendees: event.attendee_count || 0,
        description: event.description,
        is_attending: false, // You'll need to check this separately
      })) || []
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getFeaturedEvents = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("featured", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
};

export const attendEvent = async (userId: string, eventId: string) => {
  try {
    const { data, error } = await supabase
      .from("event_attendees")
      .upsert({
        user_id: userId,
        event_id: eventId,
        status: "attending",
      })
      .select()
      .single();

    if (error) throw error;

    // Update attendee count
    await supabase.rpc("update_event_attendees", {
      event_id: eventId,
    });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const unattendEvent = async (userId: string, eventId: string) => {
  try {
    const { error } = await supabase
      .from("event_attendees")
      .delete()
      .eq("user_id", userId)
      .eq("event_id", eventId);

    if (error) throw error;

    // Update attendee count
    await supabase.rpc("update_event_attendees", {
      event_id: eventId,
    });

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Interest functions
export const getAllInterests = async (limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .select("*")
      .order("member_count", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform data to match expected interface
    return (
      data?.map((group: any) => ({
        id: group.id,
        name: group.name,
        curator_name: group.curator_name,
        curator_avatar: group.curator_avatar,
        preferences:
          group.interests_covered?.reduce((acc: any, interest: string) => {
            acc[interest] = 1;
            return acc;
          }, {}) || {},
        featured: group.featured_content || [],
        tags: group.interests_covered || [],
      })) || []
    );
  } catch (error) {
    console.error("Error fetching interest groups:", error);
    return [];
  }
};

export const getFeaturedInterests = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .select("*")
      .eq("featured", true)
      .order("member_count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured interests:", error);
    return [];
  }
};

// Helper function to create creators from all profiles
export const createCreatorsFromProfiles = async () => {
  try {
    // This function should be run once to populate creators table from existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .is("display_name", null);

    if (profilesError) throw profilesError;

    const creatorsToInsert =
      profiles?.map((profile: any) => ({
        user_id: profile.id,
        name: profile.display_name || profile.username || "Creator",
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        categories: ["general"], // You can make this more sophisticated
        verified: profile.is_verified || false,
        featured: false,
      })) || [];

    const { data, error } = await supabase
      .from("creators")
      .upsert(creatorsToInsert, {
        onConflict: "user_id",
        ignoreDuplicates: true,
      });

    return { data, error };
  } catch (error) {
    console.error("Error creating creators from profiles:", error);
    return { data: null, error };
  }
};
