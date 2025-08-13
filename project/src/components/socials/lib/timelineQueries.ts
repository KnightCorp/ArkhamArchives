import { supabase } from "../../../lib/supabaseClient";

export interface TimelineEvent {
  id: string;
  user_id: string;
  event_type: "post" | "reel" | "achievement" | "like" | "comment" | "follow";
  content: any;
  metadata?: any;
  created_at: string;
  // Joined data
  post?: {
    id: string;
    caption: string;
    image_url: string;
    likes_count: number;
    comments_count: number;
  };
  reel?: {
    id: string;
    title: string;
    video_url: string;
    thumbnail_url: string;
    likes_count: number;
    views_count: number;
  };
  target_user?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string;
  };
}

export interface TimelinePost {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface TimelineReel {
  id: string;
  user_id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  likes_count: number;
  views_count: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  badge_icon?: string;
  created_at: string;
}

// =============================================
// TIMELINE QUERIES
// =============================================

export const timelineQueries = {
  // Get user's timeline events
  async getUserTimeline(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<{ data: TimelineEvent[] | null; error: any }> {
    try {
      // Get posts
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(
          "id, caption, image_url, likes_count, comments_count, created_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

      if (postsError) throw postsError;

      // Get reels
      const { data: reels, error: reelsError } = await supabase
        .from("reels")
        .select(
          "id, title, video_url, thumbnail_url, likes_count, views_count, created_at"
        )
        .eq("user_id", userId)
        .eq("is_published", true)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (reelsError) throw reelsError;

      // Get likes given by user (for timeline events)
      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select(
          `
          id,
          created_at,
          posts!inner (
            id,
            caption,
            image_url,
            user_id,
            profiles!posts_user_id_fkey (
              display_name,
              username,
              avatar_url
            )
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (likesError) console.warn("Likes error:", likesError);

      // Get reel likes
      const { data: reelLikes, error: reelLikesError } = await supabase
        .from("reel_likes")
        .select(
          `
          id,
          created_at,
          reels!inner (
            id,
            title,
            thumbnail_url,
            user_id,
            profiles!reels_user_id_fkey (
              display_name,
              username,
              avatar_url
            )
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (reelLikesError) console.warn("Reel likes error:", reelLikesError);

      // Get follows
      const { data: follows, error: followsError } = await supabase
        .from("followers")
        .select(
          `
          id,
          created_at,
          following_id,
          profiles!followers_following_id_fkey (
            display_name,
            username,
            avatar_url
          )
        `
        )
        .eq("follower_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (followsError) console.warn("Follows error:", followsError);

      // Get comments made by user
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          posts!inner (
            id,
            caption,
            image_url
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (commentsError) console.warn("Comments error:", commentsError);

      // Transform all data into timeline events
      const timelineEvents: TimelineEvent[] = [];

      // Add posts
      posts?.forEach((post) => {
        timelineEvents.push({
          id: `post-${post.id}`,
          user_id: userId,
          event_type: "post",
          content: post,
          created_at: post.created_at,
          post: post,
        });
      });

      // Add reels
      reels?.forEach((reel) => {
        timelineEvents.push({
          id: `reel-${reel.id}`,
          user_id: userId,
          event_type: "reel",
          content: reel,
          created_at: reel.created_at,
          reel: reel,
        });
      });

      // Add likes
      likes?.forEach((like) => {
        timelineEvents.push({
          id: `like-${like.id}`,
          user_id: userId,
          event_type: "like",
          content: {
            liked_post: like.posts,
          },
          created_at: like.created_at,
          post: {
            id: like.posts[0]?.id,
            caption: like.posts[0]?.caption,
            image_url: like.posts[0]?.image_url,
            likes_count: 0,
            comments_count: 0,
          },
          target_user: {
            id: like.posts[0]?.user_id,
            display_name:
              Array.isArray(like.posts[0]?.profiles) &&
              like.posts[0]?.profiles[0]?.display_name
                ? like.posts[0].profiles[0].display_name
                : "Unknown User",
            username:
              Array.isArray(like.posts[0]?.profiles) &&
              like.posts[0]?.profiles[0]?.username
                ? like.posts[0].profiles[0].username
                : "",
            avatar_url:
              Array.isArray(like.posts[0]?.profiles) &&
              like.posts[0]?.profiles[0]?.avatar_url
                ? like.posts[0].profiles[0].avatar_url
                : "",
          },
        });
      });

      // Add reel likes
      reelLikes?.forEach((like) => {
        timelineEvents.push({
          id: `reel-like-${like.id}`,
          user_id: userId,
          event_type: "like",
          content: {
            liked_reel: like.reels,
          },
          created_at: like.created_at,
          reel: {
            id: like.reels[0]?.id,
            title: like.reels[0]?.title,
            video_url: "",
            thumbnail_url: like.reels[0]?.thumbnail_url,
            likes_count: 0,
            views_count: 0,
          },
          target_user: {
            id: like.reels[0]?.user_id,
            display_name:
              Array.isArray(like.reels[0]?.profiles) &&
              like.reels[0]?.profiles[0]?.display_name
                ? like.reels[0].profiles[0].display_name
                : "Unknown User",
            username:
              Array.isArray(like.reels[0]?.profiles) &&
              like.reels[0]?.profiles[0]?.username
                ? like.reels[0].profiles[0].username
                : "",
            avatar_url:
              Array.isArray(like.reels[0]?.profiles) &&
              like.reels[0]?.profiles[0]?.avatar_url
                ? like.reels[0].profiles[0].avatar_url
                : "",
          },
        });
      });

      // Add follows
      follows?.forEach((follow) => {
        timelineEvents.push({
          id: `follow-${follow.id}`,
          user_id: userId,
          event_type: "follow",
          content: {
            followed_user: follow.profiles,
          },
          created_at: follow.created_at,
          target_user: {
            id: follow.following_id,
            display_name:
              Array.isArray(follow.profiles) && follow.profiles[0]?.display_name
                ? follow.profiles[0].display_name
                : "Unknown User",
            username:
              Array.isArray(follow.profiles) && follow.profiles[0]?.username
                ? follow.profiles[0].username
                : "",
            avatar_url:
              Array.isArray(follow.profiles) && follow.profiles[0]?.avatar_url
                ? follow.profiles[0].avatar_url
                : "",
          },
        });
      });

      // Add comments
      comments?.forEach((comment) => {
        timelineEvents.push({
          id: `comment-${comment.id}`,
          user_id: userId,
          event_type: "comment",
          content: {
            comment_text: comment.content,
            post: comment.posts,
          },
          created_at: comment.created_at,
          post: {
            id: comment.posts[0]?.id,
            caption: comment.posts[0]?.caption,
            image_url: comment.posts[0]?.image_url,
            likes_count: 0,
            comments_count: 0,
          },
        });
      });

      // Sort all events by created_at
      timelineEvents.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return { data: timelineEvents.slice(0, limit), error: null };
    } catch (error) {
      console.error("Error in getUserTimeline:", error);
      return { data: null, error };
    }
  },

  // Get user achievements
  async getUserAchievements(
    userId: string
  ): Promise<{ data: Achievement[] | null; error: any }> {
    try {
      // For now, we'll generate achievements based on user activity
      // You can create an achievements table later if needed

      // Get user stats
      const { data: posts } = await supabase
        .from("posts")
        .select("id")
        .eq("user_id", userId);

      const { data: reels } = await supabase
        .from("reels")
        .select("id")
        .eq("user_id", userId)
        .eq("is_published", true);

      const { data: totalLikes } = await supabase
        .from("posts")
        .select("likes_count")
        .eq("user_id", userId);

      const { data: followers } = await supabase
        .from("followers")
        .select("id")
        .eq("following_id", userId);

      const achievements: Achievement[] = [];
      const now = new Date().toISOString();

      // Post achievements
      const postCount = posts?.length || 0;
      if (postCount >= 1) {
        achievements.push({
          id: "first-post",
          user_id: userId,
          achievement_type: "post_milestone",
          title: "First Steps",
          description: "Posted your first photo",
          badge_icon: "📸",
          created_at: now,
        });
      }
      if (postCount >= 10) {
        achievements.push({
          id: "active-poster",
          user_id: userId,
          achievement_type: "post_milestone",
          title: "Active Photographer",
          description: "Posted 10 photos",
          badge_icon: "📱",
          created_at: now,
        });
      }
      if (postCount >= 50) {
        achievements.push({
          id: "photography-master",
          user_id: userId,
          achievement_type: "post_milestone",
          title: "Photography Master",
          description: "Posted 50 amazing photos",
          badge_icon: "🏆",
          created_at: now,
        });
      }

      // Reel achievements
      const reelCount = reels?.length || 0;
      if (reelCount >= 1) {
        achievements.push({
          id: "first-reel",
          user_id: userId,
          achievement_type: "reel_milestone",
          title: "Reel Creator",
          description: "Created your first reel",
          badge_icon: "🎬",
          created_at: now,
        });
      }

      // Likes achievements
      const totalLikesCount =
        totalLikes?.reduce((sum, post) => sum + (post.likes_count || 0), 0) ||
        0;
      if (totalLikesCount >= 100) {
        achievements.push({
          id: "popular-creator",
          user_id: userId,
          achievement_type: "engagement_milestone",
          title: "Popular Creator",
          description: "Received 100+ likes across all posts",
          badge_icon: "❤️",
          created_at: now,
        });
      }

      // Follower achievements
      const followerCount = followers?.length || 0;
      if (followerCount >= 10) {
        achievements.push({
          id: "social-butterfly",
          user_id: userId,
          achievement_type: "social_milestone",
          title: "Social Butterfly",
          description: "Gained 10 followers",
          badge_icon: "🦋",
          created_at: now,
        });
      }

      return { data: achievements, error: null };
    } catch (error) {
      console.error("Error in getUserAchievements:", error);
      return { data: [], error };
    }
  },

  // Record timeline event (for manual events)
  async recordTimelineEvent(
    userId: string,
    eventType: TimelineEvent["event_type"],
    content: any,
    metadata?: any
  ): Promise<{ data: TimelineEvent | null; error: any }> {
    try {
      // This would be useful if you want to create a timeline_events table
      // For now, we'll just return the event structure
      const event: TimelineEvent = {
        id: `manual-${Date.now()}`,
        user_id: userId,
        event_type: eventType,
        content,
        metadata,
        created_at: new Date().toISOString(),
      };

      return { data: event, error: null };
    } catch (error) {
      console.error("Error in recordTimelineEvent:", error);
      return { data: null, error };
    }
  },
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

export const timelineUtils = {
  // Format time for timeline display
  formatTimelineTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },

  // Format date for timeline display
  formatTimelineDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Group timeline events by date
  groupEventsByDate(events: TimelineEvent[]): {
    [date: string]: TimelineEvent[];
  } {
    const grouped: { [date: string]: TimelineEvent[] } = {};

    events.forEach((event) => {
      const date = new Date(event.created_at).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });

    return grouped;
  },

  // Get event display text
  getEventDisplayText(event: TimelineEvent): string {
    switch (event.event_type) {
      case "post":
        return "Posted a new photo";
      case "reel":
        return "Created a new reel";
      case "like":
        if (event.reel) {
          return `Liked ${event.target_user?.display_name || "someone"}'s reel`;
        }
        return `Liked ${event.target_user?.display_name || "someone"}'s post`;
      case "comment":
        return "Commented on a post";
      case "follow":
        return `Started following ${
          event.target_user?.display_name || "someone"
        }`;
      case "achievement":
        return "Unlocked an achievement";
      default:
        return "Activity";
    }
  },

  // Get event icon
  getEventIcon(event: TimelineEvent): string {
    switch (event.event_type) {
      case "post":
        return "📸";
      case "reel":
        return "🎬";
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👥";
      case "achievement":
        return "🏆";
      default:
        return "📌";
    }
  },
};
