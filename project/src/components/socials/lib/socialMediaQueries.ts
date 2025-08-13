import { supabase } from "../../../lib/supabaseClient";

interface Profile {
  id: string;
  display_name: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  karma: number;
  bio: string | null;
  location: string | null;
  website: string | null;
  is_verified: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  impressions_count: number;
  tags?: string[]; // ADD THIS
  category?: string; // ADD THIS
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}
interface TransformedPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    karma: number;
  };
  image: string | null;
  likes: number;
  caption: string | null;
  comments: number;
  impressions: number;
  tags?: string[]; // ADD THIS
  category?: string; // ADD THIS
  isLiked?: boolean;
  created_at: string;
}
interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  stream_url: string | null;
  is_active: boolean;
  viewers_count: number;
  created_at: string;
  ended_at: string | null;
  profiles?: Profile;
}

interface EmergencyAlert {
  id: string;
  user_id: string;
  emergency_type: string;
  message: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  contact_number: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  profiles?: Profile;
}

interface Gossip {
  id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  likes_count: number;
  created_at: string;
  profiles?: Profile;
}

interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

interface UserStats {
  postsCount: number;
  totalLikes: number;
  followersCount: number;
  followingCount: number;
}

interface MutualConnection {
  id: string;
  following_id: string;
  created_at: string;
  connected_user: Profile | null;
}

interface ConnectionInfo {
  isConnected: boolean;
  connectionsCount: number;
  postsCount: number;
}

interface ApiResponse<T> {
  data: T | null;
  error: any;
}
export const getFeedPosts = async (
  userId: string | null = null
): Promise<ApiResponse<TransformedPost[]>> => {
  try {
    console.log("Fetching posts for user:", userId);

    // Get posts first - INCLUDE tags and category
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*, tags, category") // ADD tags and category here
      .order("created_at", { ascending: false })
      .limit(20);

    if (postsError) {
      console.error("Posts error:", postsError);
      throw postsError;
    }

    console.log("Posts fetched:", posts?.length || 0);

    if (!posts || posts.length === 0) {
      return { data: [], error: null };
    }

    // Get unique user IDs from posts
    const userIds = [...new Set(posts.map((post) => post.user_id))];
    console.log("User IDs to fetch:", userIds);

    // Get user profiles for these posts - SELECT ALL NEEDED FIELDS INCLUDING display_name
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(
        "id, display_name, full_name, username, avatar_url, karma, bio, is_verified"
      )
      .in("id", userIds);

    if (profilesError) {
      console.error("Profiles error:", profilesError);
      throw profilesError;
    }

    console.log("Profiles fetched:", profiles?.length || 0);
    console.log("Sample profile:", profiles?.[0]); // Debug log

    // Create a map of profiles for easy lookup
    const profilesMap = new Map();
    profiles?.forEach((profile) => {
      console.log(`Mapping profile ${profile.id}:`, profile); // Debug log
      profilesMap.set(profile.id, profile);
    });

    // Get likes for each post if user is provided
    let userLikes: any[] = [];
    if (userId && posts.length > 0) {
      const postIds = posts.map((post) => post.id);
      const { data: likesData, error: likesError } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds);

      if (likesError) {
        console.warn("Likes error:", likesError);
      }

      userLikes = likesData || [];
    }

    const likedPostIds = new Set(userLikes.map((like) => like.post_id));

    // Transform data with better fallback logic
    const transformedPosts = posts.map((post) => {
      const profile = profilesMap.get(post.user_id);
      console.log(`Transforming post ${post.id}, profile found:`, profile);

      const displayName =
        profile?.display_name ||
        profile?.full_name ||
        profile?.username ||
        `User ${post.user_id.slice(0, 8)}`;

      const avatarUrl =
        profile?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=6366f1&color=ffffff&size=150`;

      return {
        id: post.id,
        originalId: post.id,
        user: {
          name: displayName,
          avatar: avatarUrl,
          karma: profile?.karma || 0,
        },
        image: post.image_url,
        likes: post.likes_count || 0,
        caption: post.caption,
        comments: post.comments_count || 0,
        impressions: post.impressions_count || 0,
        tags: post.tags || [], // ADD THIS
        category: post.category, // ADD THIS
        isLiked: likedPostIds.has(post.id),
        created_at: post.created_at,
      };
    });

    console.log("Transformed posts:", transformedPosts.length);
    console.log("Sample transformed post:", transformedPosts[0]);
    return { data: transformedPosts, error: null };
  } catch (error) {
    console.error("Error in getFeedPosts:", error);
    return { data: null, error };
  }
};

export const createPost = async (
  userId: string,
  caption: string,
  imageUrl: string,
  tags?: string[], // ADD THIS
  category?: string // ADD THIS
): Promise<ApiResponse<Post>> => {
  try {
    console.log("Creating post for user:", userId);

    // First create the post with tags and category
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        caption,
        image_url: imageUrl,
        tags: tags || [], // ADD THIS
        category: category, // ADD THIS
        likes_count: 0,
        comments_count: 0,
        impressions_count: 0,
      })
      .select()
      .single();

    if (postError) {
      console.error("Post creation error:", postError);
      throw postError;
    }

    console.log("Post created:", postData);

    // Then get the user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, username, avatar_url, karma")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.warn("Could not fetch profile:", profileError);
    }

    // Combine the data
    const combinedData = {
      ...postData,
      profiles: profileData,
    };

    return { data: combinedData, error: null };
  } catch (error) {
    console.error("Error in createPost:", error);
    return { data: null, error };
  }
};
export const getPersonalizedPosts = async (
  userId: string,
  limit = 20
): Promise<ApiResponse<any[]>> => {
  try {
    const { data, error } = await supabase.rpc("get_personalized_posts", {
      target_user_id: userId,
      limit_count: limit,
    });

    return { data, error };
  } catch (error) {
    console.error("Error in getPersonalizedPosts:", error);
    return { data: null, error };
  }
};

// Get posts by category
export const getPostsByCategory = async (
  category: string,
  limit = 20,
  offset = 0
): Promise<ApiResponse<TransformedPost[]>> => {
  try {
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*, tags, category")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (postsError) throw postsError;

    if (!posts || posts.length === 0) {
      return { data: [], error: null };
    }

    // Get user profiles (same logic as getFeedPosts)
    const userIds = [...new Set(posts.map((post) => post.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, full_name, username, avatar_url, karma")
      .in("id", userIds);

    const profilesMap = new Map();
    profiles?.forEach((profile) => {
      profilesMap.set(profile.id, profile);
    });

    // Transform data
    const transformedPosts = posts.map((post) => {
      const profile = profilesMap.get(post.user_id);
      const displayName =
        profile?.display_name ||
        profile?.full_name ||
        profile?.username ||
        `User ${post.user_id.slice(0, 8)}`;

      const avatarUrl =
        profile?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=6366f1&color=ffffff&size=150`;

      return {
        id: post.id,
        originalId: post.id,
        user: {
          name: displayName,
          avatar: avatarUrl,
          karma: profile?.karma || 0,
        },
        image: post.image_url,
        likes: post.likes_count || 0,
        caption: post.caption,
        comments: post.comments_count || 0,
        impressions: post.impressions_count || 0,
        tags: post.tags || [],
        category: post.category,
        isLiked: false, // We'd need userId to check this
        created_at: post.created_at,
      };
    });

    return { data: transformedPosts, error: null };
  } catch (error) {
    console.error("Error in getPostsByCategory:", error);
    return { data: null, error };
  }
};

// Get posts with specific tags
export const getPostsWithTags = async (
  tags: string[],
  limit = 20,
  offset = 0
): Promise<ApiResponse<TransformedPost[]>> => {
  try {
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*, tags, category")
      .overlaps("tags", tags)
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (postsError) throw postsError;

    if (!posts || posts.length === 0) {
      return { data: [], error: null };
    }

    // Same transformation logic as above...
    // (You can reuse the transformation code from getPostsByCategory)

    return { data: [], error: null }; // Implement transformation here
  } catch (error) {
    console.error("Error in getPostsWithTags:", error);
    return { data: null, error };
  }
};

// Update post with tags
export const updatePostTags = async (
  postId: string,
  userId: string,
  tags: string[],
  category?: string
): Promise<ApiResponse<Post>> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update({
        tags,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("user_id", userId) // Ensure user owns the post
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in updatePostTags:", error);
    return { data: null, error };
  }
};
export const likePost = async (
  userId: string,
  postId: string
): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: userId, post_id: postId });

    if (error && error.code !== "23505") {
      // Ignore duplicate key error
      throw error;
    }
    return { data: null, error: null };
  } catch (error) {
    console.error("Error in likePost:", error);
    return { data: null, error };
  }
};

export const unlikePost = async (
  userId: string,
  postId: string
): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from("likes")
      .delete()
      .match({ user_id: userId, post_id: postId });

    if (error) throw error;
    return { data: null, error: null };
  } catch (error) {
    console.error("Error in unlikePost:", error);
    return { data: null, error };
  }
};

export const likePostWithCount = async (
  userId: string,
  postId: string
): Promise<ApiResponse<null>> => {
  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (existingLike) {
      // Already liked, do nothing
      return { data: null, error: null };
    }

    // Insert like
    const { error: likeError } = await supabase
      .from("likes")
      .insert({ user_id: userId, post_id: postId });

    if (likeError && likeError.code !== "23505") {
      throw likeError;
    }

    // Update likes count (this should be handled by trigger, but let's be safe)
    const { error: updateError } = await supabase.rpc("increment_likes_count", {
      post_id: postId,
    });

    if (updateError) {
      console.warn("Could not update likes count via RPC:", updateError);
      // Fallback: manual count update
      const { data: likesCount } = await supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("post_id", postId);

      await supabase
        .from("posts")
        .update({ likes_count: likesCount?.length || 0 })
        .eq("id", postId);
    }

    return { data: null, error: null };
  } catch (error) {
    console.error("Error in likePostWithCount:", error);
    return { data: null, error };
  }
};
export const unlikePostWithCount = async (
  userId: string,
  postId: string
): Promise<ApiResponse<null>> => {
  try {
    // Remove like
    const { error: unlikeError } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (unlikeError) throw unlikeError;

    // Update likes count (this should be handled by trigger, but let's be safe)
    const { error: updateError } = await supabase.rpc("decrement_likes_count", {
      post_id: postId,
    });

    if (updateError) {
      console.warn("Could not update likes count via RPC:", updateError);
      // Fallback: manual count update
      const { data: likesCount } = await supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("post_id", postId);

      await supabase
        .from("posts")
        .update({ likes_count: likesCount?.length || 0 })
        .eq("id", postId);
    }

    return { data: null, error: null };
  } catch (error) {
    console.error("Error in unlikePostWithCount:", error);
    return { data: null, error };
  }
};
// =============================================
// USER PROFILE FUNCTIONS
// =============================================

export const getUserProfile = async (
  userId: string
): Promise<ApiResponse<Profile>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, display_name, full_name, username, avatar_url, karma, bio, location, website, is_verified, is_private, created_at, updated_at"
      )
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return { data: null, error };
  }
};

export const getAllUsers = async (): Promise<ApiResponse<Profile[]>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        posts:posts!user_id (count),
        followers:followers!following_id (count),
        following:followers!follower_id (count)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return { data: [], error };
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<ApiResponse<Profile>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return { data: null, error };
  }
};

// =============================================
// COMMENTS FUNCTIONS
// =============================================

export const getPostComments = async (
  postId: string
): Promise<ApiResponse<Comment[]>> => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles!comments_user_id_fkey (
          full_name,
          username,
          avatar_url
        )
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in getPostComments:", error);
    return { data: null, error };
  }
};

export const addComment = async (
  userId: string,
  postId: string,
  content: string
): Promise<ApiResponse<Comment>> => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: userId,
        post_id: postId,
        content,
      })
      .select(
        `
        *,
        profiles!comments_user_id_fkey (
          full_name,
          username,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in addComment:", error);
    return { data: null, error };
  }
};

// =============================================
// FOLLOWERS FUNCTIONS
// =============================================
export const followUser = async (
  followerId: string,
  followingId: string
): Promise<ApiResponse<null>> => {
  try {
    console.log(`${followerId} attempting to follow ${followingId}`);

    // Validate that user is not trying to follow themselves
    if (followerId === followingId) {
      return { data: null, error: "Cannot follow yourself" };
    }

    // Check if users are already connected
    const { data: existingFollow } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .single();

    if (existingFollow) {
      console.log("Users are already connected");
      return { data: null, error: "Already following" };
    }

    // Insert the follow - the trigger will automatically create the reverse follow
    const { data, error } = await supabase.from("followers").insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) {
      console.error("Follow error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Handle specific RLS errors
      if (error.code === "42501") {
        console.error(
          "RLS Policy violation - check if user is properly authenticated"
        );
        return { data: null, error: "Authentication required to follow users" };
      }

      throw error;
    }

    console.log("Follow successful, data:", data);
    return { data: null, error: null };
  } catch (error) {
    console.error("Error in followUser:", error);
    return { data: null, error };
  }
};

export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<ApiResponse<null>> => {
  try {
    console.log(`${followerId} attempting to unfollow ${followingId}`);

    // Delete the follow - the trigger will automatically remove the reverse follow
    const { error } = await supabase.from("followers").delete().match({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) {
      console.error("Unfollow error:", error);

      // Handle specific RLS errors
      if (error.code === "42501") {
        console.error(
          "RLS Policy violation - check if user is properly authenticated"
        );
        return {
          data: null,
          error: "Authentication required to unfollow users",
        };
      }

      throw error;
    }

    console.log("Unfollow completed successfully");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    return { data: null, error };
  }
};

// Fixed getUserFollowers and getUserFollowing functions
export const getUserFollowers = async (
  userId: string
): Promise<ApiResponse<any[]>> => {
  try {
    console.log("Getting connections for user:", userId);

    // In mutual system, followers = connections
    return await getMutualConnections(userId);
  } catch (error) {
    console.error("Error in getUserFollowers:", error);
    return { data: [], error };
  }
};

export const getUserFollowing = async (
  userId: string
): Promise<ApiResponse<any[]>> => {
  try {
    console.log("Getting connections for user:", userId);

    // In mutual system, following = connections (same as followers)
    return await getMutualConnections(userId);
  } catch (error) {
    console.error("Error in getUserFollowing:", error);
    return { data: [], error };
  }
};

export const checkUserAuthentication = async (): Promise<{
  isAuthenticated: boolean;
  userId: string | null;
  error: any;
}> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth check error:", error);
      return { isAuthenticated: false, userId: null, error };
    }

    return {
      isAuthenticated: !!user,
      userId: user?.id || null,
      error: null,
    };
  } catch (error) {
    console.error("Error checking authentication:", error);
    return { isAuthenticated: false, userId: null, error };
  }
};

export const isFollowing = async (
  userId: string,
  targetUserId: string
): Promise<{ isFollowing: boolean; error: any }> => {
  try {
    // First check authentication
    const authCheck = await checkUserAuthentication();
    if (!authCheck.isAuthenticated) {
      return { isFollowing: false, error: "Authentication required" };
    }

    // In a mutual system, we just need to check if one direction exists
    const { data, error } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", userId)
      .eq("following_id", targetUserId)
      .single();

    if (error && error.code !== "PGRST116") {
      // Ignore "not found" error
      console.error("isFollowing error:", error);
      return { isFollowing: false, error };
    }

    return { isFollowing: !!data, error: null };
  } catch (error) {
    console.error("Error in isFollowing:", error);
    return { isFollowing: false, error };
  }
};

// New function: Get mutual connections (same as followers in mutual system)
export const getMutualConnections = async (
  userId: string
): Promise<ApiResponse<any[]>> => {
  try {
    // In mutual system, followers = following, so we can use either direction
    const { data, error } = await supabase
      .from("followers")
      .select(
        `
        id,
        following_id,
        created_at
      `
      )
      .eq("follower_id", userId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { data: [], error: null };
    }

    // Get profiles for connected users
    const connectedUserIds = data.map((f) => f.following_id);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(
        "id, display_name, full_name, username, avatar_url, karma, is_verified"
      )
      .in("id", connectedUserIds);

    if (profilesError) throw profilesError;

    // Combine the data
    const connectionsWithProfiles = data.map((connection) => ({
      ...connection,
      connected_user:
        profiles?.find((p) => p.id === connection.following_id) || null,
    }));

    return { data: connectionsWithProfiles, error: null };
  } catch (error) {
    console.error("Error in getMutualConnections:", error);
    return { data: [], error };
  }
};

export const getSuggestedUsers = async (
  userId: string
): Promise<ApiResponse<Profile[]>> => {
  try {
    console.log("Getting suggestions for user:", userId);

    // Get users the current user is already connected to
    const { data: connections } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", userId);

    const connectedIds = connections?.map((c) => c.following_id) || [];
    connectedIds.push(userId); // Don't suggest self

    console.log("Already connected to:", connectedIds.length, "users");

    // Get suggested users (not connected and not self)
    let query = supabase.from("profiles").select(`
        *,
        posts:posts!user_id (count),
        connections:followers!following_id (count)
      `);

    if (connectedIds.length > 0) {
      query = query.not("id", "in", `(${connectedIds.join(",")})`);
    }

    const { data, error } = await query
      .order("karma", { ascending: false })
      .limit(10);

    if (error) throw error;

    console.log("Found", data?.length || 0, "suggestions");
    return { data, error: null };
  } catch (error) {
    console.error("Error in getSuggestedUsers:", error);
    return { data: [], error };
  }
};
export const debugFollowersTable = async () => {
  try {
    console.log("=== DEBUGGING FOLLOWERS TABLE ===");

    // Check authentication
    const authCheck = await checkUserAuthentication();
    console.log("Authentication:", authCheck);

    if (!authCheck.isAuthenticated) {
      console.log("User not authenticated - this might be the issue!");
      return;
    }

    // Try to select from followers table
    const { data: followers, error: selectError } = await supabase
      .from("followers")
      .select("*")
      .limit(5);

    console.log("Select test:", { followers, selectError });

    // Try to count followers
    const { count, error: countError } = await supabase
      .from("followers")
      .select("*", { count: "exact", head: true });

    console.log("Count test:", { count, countError });
  } catch (error) {
    console.error("Debug error:", error);
  }
};

// New function: Get connection count (replaces separate follower/following counts)
export const getConnectionCount = async (
  userId: string
): Promise<{ count: number; error: any }> => {
  try {
    const { count, error } = await supabase
      .from("followers")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    if (error) throw error;
    return { count: count || 0, error: null };
  } catch (error) {
    console.error("Error in getConnectionCount:", error);
    return { count: 0, error };
  }
};
// =============================================
// JOURNAL FUNCTIONS
// =============================================

export const createJournalEntry = async (
  userId: string,
  title: string,
  content: string,
  mood: string,
  isPrivate: boolean = true
): Promise<ApiResponse<JournalEntry>> => {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: userId,
        title,
        content,
        mood,
        is_private: isPrivate,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in createJournalEntry:", error);
    return { data: null, error };
  }
};

export const getUserJournalEntries = async (
  userId: string
): Promise<ApiResponse<JournalEntry[]>> => {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in getUserJournalEntries:", error);
    return { data: [], error };
  }
};

export const updateJournalEntry = async (
  entryId: string,
  userId: string,
  updates: Partial<JournalEntry>
): Promise<ApiResponse<JournalEntry>> => {
  try {
    const { data, error } = await supabase
      .from("journal_entries")
      .update(updates)
      .eq("id", entryId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in updateJournalEntry:", error);
    return { data: null, error };
  }
};

export const deleteJournalEntry = async (
  entryId: string,
  userId: string
): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", userId);

    if (error) throw error;
    return { data: null, error };
  } catch (error) {
    console.error("Error in deleteJournalEntry:", error);
    return { data: null, error };
  }
};

// =============================================
// LIVE STREAM FUNCTIONS
// =============================================

export const createLiveStream = async (
  userId: string,
  title: string,
  description: string,
  streamUrl: string
): Promise<ApiResponse<LiveStream>> => {
  try {
    const { data, error } = await supabase
      .from("live_streams")
      .insert({
        user_id: userId,
        title,
        description,
        stream_url: streamUrl,
        is_active: true,
      })
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          username,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in createLiveStream:", error);
    return { data: null, error };
  }
};

export const getActiveLiveStreams = async (): Promise<
  ApiResponse<LiveStream[]>
> => {
  try {
    const { data, error } = await supabase
      .from("live_streams")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          username,
          avatar_url
        )
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in getActiveLiveStreams:", error);
    return { data: [], error };
  }
};

export const endLiveStream = async (
  streamId: string,
  userId: string
): Promise<ApiResponse<LiveStream>> => {
  try {
    const { data, error } = await supabase
      .from("live_streams")
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", streamId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in endLiveStream:", error);
    return { data: null, error };
  }
};

// =============================================
// EMERGENCY SOS FUNCTIONS
// =============================================

export const createEmergencyAlert = async (
  userId: string,
  emergencyType: string,
  message: string,
  lat: number,
  lng: number,
  address: string,
  contactNumber: string
): Promise<ApiResponse<EmergencyAlert>> => {
  try {
    const { data, error } = await supabase
      .from("emergency_sos")
      .insert({
        user_id: userId,
        emergency_type: emergencyType,
        message,
        location_lat: lat,
        location_lng: lng,
        location_address: address,
        contact_number: contactNumber,
        status: "active",
      })
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          username,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in createEmergencyAlert:", error);
    return { data: null, error };
  }
};

export const getActiveEmergencyAlerts = async (): Promise<
  ApiResponse<EmergencyAlert[]>
> => {
  try {
    const { data, error } = await supabase
      .from("emergency_sos")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          username,
          avatar_url
        )
      `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in getActiveEmergencyAlerts:", error);
    return { data: [], error };
  }
};

export const resolveEmergencyAlert = async (
  alertId: string,
  userId: string
): Promise<ApiResponse<EmergencyAlert>> => {
  try {
    const { data, error } = await supabase
      .from("emergency_sos")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", alertId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in resolveEmergencyAlert:", error);
    return { data: null, error };
  }
};

// =============================================
// GOSSIPS/WHISPERS FUNCTIONS
// =============================================
export const getGossips = async (): Promise<ApiResponse<any[]>> => {
  try {
    console.log("Fetching gossips...");

    // First, get all gossips
    const { data: gossipsData, error: gossipsError } = await supabase
      .from("gossips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (gossipsError) {
      console.error("Gossips error:", gossipsError);
      throw gossipsError;
    }

    console.log("Gossips fetched:", gossipsData?.length || 0);

    if (!gossipsData || gossipsData.length === 0) {
      return { data: [], error: null };
    }

    // Get unique user IDs from non-anonymous gossips
    const userIds = [
      ...new Set(
        gossipsData
          .filter((gossip) => !gossip.is_anonymous)
          .map((gossip) => gossip.user_id)
      ),
    ];

    console.log("User IDs to fetch for gossips:", userIds);

    let profilesData: any[] = [];

    // Only fetch profiles if we have non-anonymous gossips
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(
          "id, display_name, full_name, username, avatar_url, karma, is_verified"
        )
        .in("id", userIds);

      if (profilesError) {
        console.warn("Error fetching profiles:", profilesError);
        // Continue without profiles data
      } else {
        profilesData = profiles || [];
        console.log("Profiles fetched for gossips:", profilesData.length);
        console.log("Sample profile:", profilesData[0]); // Debug log
      }
    }

    // Create a lookup map for profiles
    const profilesMap = new Map();
    profilesData.forEach((profile) => {
      console.log(`Mapping gossip profile ${profile.id}:`, profile); // Debug log
      profilesMap.set(profile.id, profile);
    });

    // Transform data to include profile information
    const transformedData = gossipsData.map((gossip) => {
      const profile = profilesMap.get(gossip.user_id);
      console.log(`Transforming gossip ${gossip.id}, profile found:`, profile); // Debug log

      // Use same display name logic as getFeedPosts - prioritize display_name
      const displayName = gossip.is_anonymous
        ? "Anonymous"
        : profile?.display_name ||
          profile?.full_name ||
          profile?.username ||
          `User ${gossip.user_id.slice(0, 8)}`;

      // Better fallback logic for avatar
      const avatarUrl = gossip.is_anonymous
        ? null
        : profile?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayName
          )}&background=6366f1&color=ffffff&size=150`;

      return {
        ...gossip,
        profiles: gossip.is_anonymous ? null : profile,
        user_name: displayName,
        user_avatar: avatarUrl,
      };
    });

    console.log("Transformed gossips:", transformedData.length);
    console.log("Sample transformed gossip:", transformedData[0]); // Debug log
    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in getGossips:", error);
    return { data: [], error };
  }
};

export const createGossip = async (
  userId: string,
  content: string,
  isAnonymous: boolean = true
): Promise<ApiResponse<Gossip>> => {
  try {
    const { data, error } = await supabase
      .from("gossips")
      .insert({
        user_id: userId,
        content,
        is_anonymous: isAnonymous,
      })
      .select("*")
      .single();

    if (error) throw error;

    // If not anonymous, fetch the user profile with same fields as getGossips
    let profileData = null;
    if (!isAnonymous) {
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "id, display_name, full_name, username, avatar_url, karma, is_verified"
        )
        .eq("id", userId)
        .single();

      profileData = profile;
    }

    // Use same display name logic as getGossips
    const displayName = isAnonymous
      ? "Anonymous"
      : profileData?.display_name ||
        profileData?.full_name ||
        profileData?.username ||
        `User ${userId.slice(0, 8)}`;

    const avatarUrl = isAnonymous
      ? null
      : profileData?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=6366f1&color=ffffff&size=150`;

    const result = {
      ...data,
      profiles: profileData,
      user_name: displayName,
      user_avatar: avatarUrl,
    };

    return { data: result, error: null };
  } catch (error) {
    console.error("Error in createGossip:", error);
    return { data: null, error };
  }
};
// =============================================
// SEARCH FUNCTIONS
// =============================================

export const searchUsers = async (
  query: string
): Promise<ApiResponse<Profile[]>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return { data: [], error };
  }
};

export const searchPosts = async (
  query: string
): Promise<ApiResponse<Post[]>> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          username,
          avatar_url,
          karma
        )
      `
      )
      .ilike("caption", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in searchPosts:", error);
    return { data: [], error };
  }
};

// =============================================
// ANALYTICS FUNCTIONS
// =============================================

export const incrementPostImpressions = async (
  postId: string
): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.rpc("increment_impressions", {
      post_id: postId,
    });

    if (error) throw error;
    return { data: null, error };
  } catch (error) {
    console.error("Error in incrementPostImpressions:", error);
    return { data: null, error };
  }
};

export const getUserStats = async (
  userId: string
): Promise<ApiResponse<UserStats & { connectionsCount: number }>> => {
  try {
    // Get posts count
    const { count: postsCount, error: postsError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (postsError) throw postsError;

    // Get total likes on user's posts
    const { data: userPosts, error: userPostsError } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("user_id", userId);

    if (userPostsError) throw userPostsError;

    const totalLikes =
      userPosts?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

    // Get connections count (replaces followers/following)
    const { count: connectionsCount, error: connectionsError } =
      await getConnectionCount(userId);

    if (connectionsError) throw connectionsError;

    const stats = {
      postsCount: postsCount || 0,
      totalLikes,
      followersCount: connectionsCount, // Keep for backward compatibility
      followingCount: connectionsCount, // Keep for backward compatibility
      connectionsCount: connectionsCount, // New field
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return {
      data: {
        postsCount: 0,
        totalLikes: 0,
        followersCount: 0,
        followingCount: 0,
        connectionsCount: 0,
      },
      error,
    };
  }
};

// New function: Check if two users are connected
export const areUsersConnected = async (
  userId1: string,
  userId2: string
): Promise<{ connected: boolean; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", userId1)
      .eq("following_id", userId2)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return { connected: !!data, error: null };
  } catch (error) {
    console.error("Error in areUsersConnected:", error);
    return { connected: false, error };
  }
};
export const getUserConnectionInfo = async (
  currentUserId: string,
  targetUserId: string
): Promise<
  ApiResponse<{
    isConnected: boolean;
    connectionsCount: number;
    postsCount: number;
  }>
> => {
  try {
    // Check if connected
    const { connected } = await areUsersConnected(currentUserId, targetUserId);

    // Get connection count
    const { count: connectionsCount } = await getConnectionCount(targetUserId);

    // Get posts count
    const { count: postsCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", targetUserId);

    return {
      data: {
        isConnected: connected,
        connectionsCount: connectionsCount,
        postsCount: postsCount || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in getUserConnectionInfo:", error);
    return { data: null, error };
  }
};
// =============================================
// AUTHENTICATION HELPERS
// =============================================

export const getCurrentUser = async (): Promise<{ user: any; error: any }> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error);
      return { user: null, error };
    }

    if (!user) {
      return { user: null, error: "No authenticated user" };
    }

    // Get the user's profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.warn("Profile error:", profileError);
      // Return user without profile if profile doesn't exist
      return { user: { ...user, profile: null }, error: null };
    }

    return { user: { ...user, profile }, error: null };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { user: null, error };
  }
};

export const signOut = async (): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { data: null, error };
  } catch (error) {
    console.error("Error in signOut:", error);
    return { data: null, error };
  }
};

// =============================================
// FILE UPLOAD HELPERS
// =============================================

export const uploadImage = async (
  file: File,
  bucket: string = "posts"
): Promise<ApiResponse<{ url: string }>> => {
  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User must be authenticated to upload images");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    console.log("Uploading file:", filePath, "User:", user.id);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return { data: { url: publicUrl }, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { data: null, error };
  }
};
// =============================================
// REAL-TIME SUBSCRIPTIONS
// =============================================

export const subscribeToFeedUpdates = (callback: (payload: any) => void) => {
  try {
    const subscription = supabase
      .channel("posts-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  } catch (error) {
    console.error("Error setting up real-time subscription:", error);
    return null;
  }
};

export const subscribeToLiveStreams = (callback: (payload: any) => void) => {
  return supabase
    .channel("live-streams")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_streams",
      },
      callback
    )
    .subscribe();
};

export const subscribeToEmergencyAlerts = (
  callback: (payload: any) => void
) => {
  return supabase
    .channel("emergency-alerts")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "emergency_sos",
      },
      callback
    )
    .subscribe();
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please select a valid image file (JPEG, PNG, or WebP)",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  return { valid: true };
};

// =============================================
// BATCH OPERATIONS
// =============================================

export const deletePost = async (
  postId: string,
  userId: string
): Promise<ApiResponse<null>> => {
  try {
    // First verify the post belongs to the user
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .single();

    if (fetchError) throw fetchError;
    if (post.user_id !== userId) {
      throw new Error("Unauthorized: Cannot delete post");
    }

    // Delete the post (cascade will handle likes and comments)
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) throw error;
    return { data: null, error };
  } catch (error) {
    console.error("Error in deletePost:", error);
    return { data: null, error };
  }
};

// =============================================
// QUICK TEST FUNCTIONS FOR YOUR USERS
// =============================================

// Quick function to test with your specific user IDs
export const testWithYourUsers = async (): Promise<{
  posts: TransformedPost[] | null;
  profile: Profile | null;
}> => {
  const userIds = [
    "d63e0814-f7bb-4dc0-9a95-f0121d318092", // rakshaaa@gmail.com
    "7c96d1c5-6aac-41b8-9884-6d7cfedbff9c", // goku1234@gmail.com
    "f6118efd-72f1-429d-879b-0638216a0a85", // rojer1234@gmail.com
    "62440ae3-f3f1-4665-8d0c-b0dab46b12e5", // mh1234@gmail.com
    "7672bc12-a78c-4e2a-8768-7727bae8694c", // raksha@gmail.com
  ];

  console.log("Testing with your user IDs:", userIds);

  // Test getting posts
  const { data: posts, error: postsError } = await getFeedPosts(userIds[0]);
  console.log("Posts:", posts, "Error:", postsError);

  // Test getting user profile
  const { data: profile, error: profileError } = await getUserProfile(
    userIds[0]
  );
  console.log("Profile:", profile, "Error:", profileError);

  return { posts, profile };
};

export type { MutualConnection, ConnectionInfo };
