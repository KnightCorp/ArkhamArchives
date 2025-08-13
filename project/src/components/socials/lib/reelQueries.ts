import { supabase } from "../../../lib/supabaseClient";

export interface ContentTag {
  id: string;
  name: string;
  category: string;
  description?: string;
  color?: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

// Update the existing Reel interface to include tags and category
export interface Reel {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  file_size?: number;
  video_format?: string;
  likes_count: number;
  views_count: number;
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  is_deleted: boolean;
  tags?: string[]; // ADD THIS
  category?: string; // ADD THIS
  created_at: string;
  updated_at: string;
  // Joined data from profiles
  creator_name?: string;
  creator_username?: string;
  creator_avatar?: string;
  creator_karma?: number;
  // User interaction status
  is_liked_by_user?: boolean;
}

// Update CreateReelData interface
export interface CreateReelData {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  file_size?: number;
  video_format?: string;
  tags?: string[]; // ADD THIS
  category?: string; // ADD THIS
}

export interface ReelComment {
  id: string;
  user_id: string;
  reel_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user_name?: string;
  user_username?: string;
  user_avatar?: string;
}

export interface CreateReelData {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  file_size?: number;
  video_format?: string;
}

export interface UpdateReelData {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  is_published?: boolean;
  tags?: string[]; // ADD THIS
  category?: string; // ADD THIS
}

// =============================================
// REEL CRUD OPERATIONS
// =============================================

export const reelQueries = {
  async getAllReels(
    limit = 50,
    offset = 0
  ): Promise<{ data: Reel[] | null; error: any }> {
    // First get the reels
    const { data: reelsData, error: reelsError } = await supabase
      .from("reels")
      .select("*")
      .eq("is_published", true)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (reelsError) return { data: null, error: reelsError };
    if (!reelsData || reelsData.length === 0) return { data: [], error: null };

    // Get unique user IDs
    const userIds = [...new Set(reelsData.map((reel) => reel.user_id))];

    // Get profiles for these users
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, karma")
      .in("id", userIds);

    if (profilesError) return { data: null, error: profilesError };

    // Create a map for quick profile lookup
    const profilesMap = new Map();
    profilesData?.forEach((profile) => {
      profilesMap.set(profile.id, profile);
    });

    // Combine the data
    const reels = reelsData.map((reel) => {
      const profile = profilesMap.get(reel.user_id);
      return {
        ...reel,
        creator_name: profile?.display_name,
        creator_username: profile?.display_name,
        creator_avatar: profile?.avatar_url,
        creator_karma: profile?.karma,
      };
    });

    return { data: reels, error: null };
  },

  // Get reels with user interaction status
  async getReelsWithUserStatus(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<{ data: Reel[] | null; error: any }> {
    // First get the reels
    const { data: reelsData, error: reelsError } = await supabase
      .from("reels")
      .select("*")
      .eq("is_published", true)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (reelsError) return { data: null, error: reelsError };
    if (!reelsData || reelsData.length === 0) return { data: [], error: null };

    // Get user profiles
    const userIds = [...new Set(reelsData.map((reel) => reel.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, karma")
      .in("id", userIds);

    // Get user likes for these reels
    const reelIds = reelsData.map((reel) => reel.id);
    const { data: likesData } = await supabase
      .from("reel_likes")
      .select("reel_id")
      .eq("user_id", userId)
      .in("reel_id", reelIds);

    // Create maps for quick lookup
    const profilesMap = new Map();
    profilesData?.forEach((profile) => {
      profilesMap.set(profile.id, profile);
    });

    const likedReelsSet = new Set();
    likesData?.forEach((like) => {
      likedReelsSet.add(like.reel_id);
    });

    // Combine the data
    const reels = reelsData.map((reel) => {
      const profile = profilesMap.get(reel.user_id);
      return {
        ...reel,
        creator_name: profile?.display_name,
        creator_username: profile?.display_name,
        creator_avatar: profile?.avatar_url,
        creator_karma: profile?.karma,
        is_liked_by_user: likedReelsSet.has(reel.id),
      };
    });

    return { data: reels, error: null };
  },

  // Get trending reels (most liked in last 7 days)
  async getTrendingReels(
    limit = 50
  ): Promise<{ data: Reel[] | null; error: any }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("reels")
      .select(
        `
        *,
        profiles!user_id (
          display_name,
          username,
          avatar_url,
          karma
        )
      `
      )
      .eq("is_published", true)
      .eq("is_deleted", false)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("likes_count", { ascending: false })
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };

    const reels =
      data?.map((reel) => ({
        ...reel,
        creator_name: reel.profiles?.display_name,
        creator_username: reel.profiles?.display_name,
        creator_avatar: reel.profiles?.avatar_url,
        creator_karma: reel.profiles?.karma,
        profiles: undefined,
      })) || [];

    return { data: reels, error: null };
  },

  // Get user's own reels
  async getUserReels(
    userId: string
  ): Promise<{ data: Reel[] | null; error: any }> {
    const { data, error } = await supabase
      .from("reels")
      .select(
        `
        *,
        profiles!user_id (
          display_name,
          username,
          avatar_url,
          karma
        )
      `
      )
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error };

    const reels =
      data?.map((reel) => ({
        ...reel,
        creator_name: reel.profiles?.display_name,
        creator_username: reel.profiles?.display_name,
        creator_avatar: reel.profiles?.avatar_url,
        creator_karma: reel.profiles?.karma,
        profiles: undefined,
      })) || [];

    return { data: reels, error: null };
  },

  // Get single reel by ID
  async getReelById(
    reelId: string,
    userId?: string
  ): Promise<{ data: Reel | null; error: any }> {
    let query = supabase
      .from("reels")
      .select(
        `
        *,
        profiles!user_id (
          display_name,
          username,
          avatar_url,
          karma
        )
      `
      )
      .eq("id", reelId)
      .eq("is_published", true)
      .eq("is_deleted", false)
      .single();

    if (userId) {
      query = supabase
        .from("reels")
        .select(
          `
          *,
          profiles!user_id (
            display_name,
            username,
            avatar_url,
            karma
          ),
          reel_likes!left (
            user_id
          )
        `
        )
        .eq("id", reelId)
        .eq("is_published", true)
        .eq("is_deleted", false)
        .single();
    }

    const { data, error } = await query;

    if (error) return { data: null, error };

    const reel = {
      ...data,
      creator_name: data.profiles?.display_name,
      creator_username: data.profiles?.display_name,
      creator_avatar: data.profiles?.avatar_url,
      creator_karma: data.profiles?.karma,
      is_liked_by_user: userId
        ? data.reel_likes?.some((like: any) => like.user_id === userId) || false
        : false,
      profiles: undefined,
      reel_likes: undefined,
    };

    return { data: reel, error: null };
  },

  // Create new reel
  async createReel(
    reelData: CreateReelData
  ): Promise<{ data: Reel | null; error: any }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return { data: null, error: userError || new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("reels")
      .insert({
        user_id: user.id,
        ...reelData,
      })
      .select()
      .single();

    return { data, error };
  },

  // Update reel
  async updateReel(
    reelId: string,
    updateData: UpdateReelData
  ): Promise<{ data: Reel | null; error: any }> {
    const { data, error } = await supabase
      .from("reels")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reelId)
      .select()
      .single();

    return { data, error };
  },

  // Delete reel (soft delete)
  async deleteReel(reelId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from("reels")
      .update({ is_deleted: true })
      .eq("id", reelId);

    return { data, error };
  },

  // =============================================
  // REEL INTERACTIONS
  // =============================================

  // Like/Unlike reel
  async toggleReelLike(
    reelId: string
  ): Promise<{ data: any; error: any; isLiked: boolean }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return {
        data: null,
        error: userError || new Error("Not authenticated"),
        isLiked: false,
      };

    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from("reel_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("reel_id", reelId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return { data: null, error: checkError, isLiked: false };
    }

    if (existingLike) {
      // Unlike
      const { data, error } = await supabase
        .from("reel_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("reel_id", reelId);

      return { data, error, isLiked: false };
    } else {
      // Like
      const { data, error } = await supabase.from("reel_likes").insert({
        user_id: user.id,
        reel_id: reelId,
      });

      return { data, error, isLiked: true };
    }
  },

  // Record reel view
  async recordReelView(reelId: string): Promise<{ data: any; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Use upsert to avoid conflicts - one view per user per reel
    const { data, error } = await supabase.from("reel_views").upsert(
      {
        user_id: user?.id || null,
        reel_id: reelId,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,reel_id",
        ignoreDuplicates: true,
      }
    );

    return { data, error };
  },
  // Get reel comments
  async getReelComments(
    reelId: string
  ): Promise<{ data: ReelComment[] | null; error: any }> {
    const { data, error } = await supabase
      .from("reel_comments")
      .select(
        `
        *,
        profiles!user_id (
          display_name,
          username,
          avatar_url
        )
      `
      )
      .eq("reel_id", reelId)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error };

    const comments =
      data?.map((comment) => ({
        ...comment,
        user_name: comment.profiles?.display_name,
        user_username: comment.profiles?.display_name,
        user_avatar: comment.profiles?.avatar_url,
        profiles: undefined,
      })) || [];

    return { data: comments, error: null };
  },

  // Add comment to reel
  async addReelComment(
    reelId: string,
    content: string
  ): Promise<{ data: ReelComment | null; error: any }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return { data: null, error: userError || new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("reel_comments")
      .insert({
        user_id: user.id,
        reel_id: reelId,
        content,
      })
      .select()
      .single();

    return { data, error };
  },

  // Delete comment
  async deleteReelComment(
    commentId: string
  ): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from("reel_comments")
      .delete()
      .eq("id", commentId);

    return { data, error };
  },
};

// =============================================
// STORAGE FUNCTIONS
// =============================================

export const reelStorage = {
  // Upload reel video
  async uploadReelVideo(
    file: File,
    userId: string
  ): Promise<{ data: { path: string; url: string } | null; error: any }> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("reels")
      .upload(fileName, file);

    if (error) return { data: null, error };

    const { data: urlData } = supabase.storage
      .from("reels")
      .getPublicUrl(fileName);

    return {
      data: {
        path: data.path,
        url: urlData.publicUrl,
      },
      error: null,
    };
  },
  async getPersonalizedReels(
    userId: string,
    limit = 20
  ): Promise<{ data: Reel[] | null; error: any }> {
    const { data, error } = await supabase.rpc("get_personalized_reels", {
      target_user_id: userId,
      limit_count: limit,
    });

    return { data, error };
  },

  // Get content by tags using the new database function
  async getContentByTags(
    tags: string[],
    contentType: "reels" | "posts" | "both" = "reels",
    limit = 20
  ): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await supabase.rpc("get_content_by_tags", {
      search_tags: tags,
      filter_type: contentType,
      limit_count: limit,
    });

    return { data, error };
  },

  // Get reels by category
  async getReelsByCategory(
    category: string,
    limit = 50,
    offset = 0
  ): Promise<{ data: Reel[] | null; error: any }> {
    const { data, error } = await supabase
      .from("reels")
      .select(
        `
        *,
        profiles!user_id (
          display_name,
          username,
          avatar_url,
          karma
        )
      `
      )
      .eq("category", category)
      .eq("is_published", true)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { data: null, error };

    const reels =
      data?.map((reel) => ({
        ...reel,
        creator_name: reel.profiles?.display_name,
        creator_username: reel.profiles?.username,
        creator_avatar: reel.profiles?.avatar_url,
        creator_karma: reel.profiles?.karma,
        profiles: undefined,
      })) || [];

    return { data: reels, error: null };
  },

  // Get reels with specific tags (direct query)
  async getReelsWithTags(
    tags: string[],
    limit = 50,
    offset = 0
  ): Promise<{ data: Reel[] | null; error: any }> {
    const { data, error } = await supabase
      .from("reels")
      .select(
        `
        *,
        profiles!user_id (
          display_name,
          username,
          avatar_url,
          karma
        )
      `
      )
      .overlaps("tags", tags)
      .eq("is_published", true)
      .eq("is_deleted", false)
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return { data: null, error };

    const reels =
      data?.map((reel) => ({
        ...reel,
        creator_name: reel.profiles?.display_name,
        creator_username: reel.profiles?.username,
        creator_avatar: reel.profiles?.avatar_url,
        creator_karma: reel.profiles?.karma,
        profiles: undefined,
      })) || [];

    return { data: reels, error: null };
  },

  // Upload reel thumbnail
  async uploadReelThumbnail(
    file: File,
    userId: string
  ): Promise<{ data: { path: string; url: string } | null; error: any }> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("reel-thumbnails")
      .upload(fileName, file);

    if (error) return { data: null, error };

    const { data: urlData } = supabase.storage
      .from("reel-thumbnails")
      .getPublicUrl(fileName);

    return {
      data: {
        path: data.path,
        url: urlData.publicUrl,
      },
      error: null,
    };
  },

  // Delete reel video
  async deleteReelVideo(path: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage.from("reels").remove([path]);

    return { data, error };
  },

  // Delete reel thumbnail
  async deleteReelThumbnail(path: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from("reel-thumbnails")
      .remove([path]);

    return { data, error };
  },

  // Get video duration from file
  getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };

      video.onerror = () => {
        reject(new Error("Failed to load video metadata"));
      };

      video.src = URL.createObjectURL(file);
    });
  },

  // Generate video thumbnail
  generateVideoThumbnail(file: File, timeInSeconds = 1): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = Math.min(timeInSeconds, video.duration / 2);
      });

      video.addEventListener("seeked", () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to generate thumbnail"));
              }
            },
            "image/jpeg",
            0.8
          );
        }
      });

      video.addEventListener("error", () => {
        reject(new Error("Failed to load video"));
      });

      video.src = URL.createObjectURL(file);
    });
  },
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

export const reelUtils = {
  // Format duration from seconds to MM:SS
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  },

  // Format view count
  formatViewCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  },

  // Format file size
  formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  },

  // Validate video file
  validateVideoFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Invalid file type. Please upload MP4, WebM, OGG, or MOV files.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size too large. Maximum size is 100MB.",
      };
    }

    return { isValid: true };
  },

  // Validate image file for thumbnail
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Invalid image type. Please upload JPEG, PNG, or WebP files.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "Image size too large. Maximum size is 5MB.",
      };
    }

    return { isValid: true };
  },
};

export const tagQueries = {
  // Get all available tags
  async getAllTags(): Promise<{ data: ContentTag[] | null; error: any }> {
    const { data, error } = await supabase
      .from("content_tags")
      .select("*")
      .eq("is_active", true)
      .order("usage_count", { ascending: false });

    return { data, error };
  },

  // Get tags by category
  async getTagsByCategory(
    category: string
  ): Promise<{ data: ContentTag[] | null; error: any }> {
    const { data, error } = await supabase
      .from("content_tags")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("usage_count", { ascending: false });

    return { data, error };
  },

  // Get trending tags
  async getTrendingTags(
    limit = 20
  ): Promise<{ data: ContentTag[] | null; error: any }> {
    const { data, error } = await supabase
      .from("content_tags")
      .select("*")
      .eq("is_active", true)
      .order("usage_count", { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Search tags by name
  async searchTags(
    query: string
  ): Promise<{ data: ContentTag[] | null; error: any }> {
    const { data, error } = await supabase
      .from("content_tags")
      .select("*")
      .ilike("name", `%${query}%`)
      .eq("is_active", true)
      .order("usage_count", { ascending: false })
      .limit(10);

    return { data, error };
  },

  // Update tag usage counts
  async updateTagUsageCounts(): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.rpc("update_tag_usage_counts");

    return { data, error };
  },

  // Create new tag (for admin/moderator use)
  async createTag(
    name: string,
    category: string,
    description?: string,
    color?: string
  ): Promise<{ data: ContentTag | null; error: any }> {
    const { data, error } = await supabase
      .from("content_tags")
      .insert({
        name: name.toLowerCase(),
        category,
        description,
        color,
      })
      .select()
      .single();

    return { data, error };
  },
};

// Add these utility functions for tags
export const tagUtils = {
  // Validate tags array
  validateTags(tags: string[]): { isValid: boolean; error?: string } {
    if (!Array.isArray(tags)) {
      return { isValid: false, error: "Tags must be an array" };
    }

    if (tags.length > 10) {
      return { isValid: false, error: "Maximum 10 tags allowed" };
    }

    for (const tag of tags) {
      if (typeof tag !== "string" || tag.length < 2 || tag.length > 50) {
        return {
          isValid: false,
          error: "Each tag must be 2-50 characters long",
        };
      }
    }

    return { isValid: true };
  },

  // Get tag categories
  getTagCategories(): string[] {
    return ["interest", "aesthetic", "genre", "mood"];
  },

  // Format tags for display
  formatTagsForDisplay(tags: string[]): string {
    return tags.map((tag) => `#${tag}`).join(" ");
  },

  // Extract hashtags from text
  extractHashtagsFromText(text: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map((tag) => tag.slice(1).toLowerCase()) : [];
  },
};
