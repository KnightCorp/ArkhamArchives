// LMS Supabase Integration Services
// Similar to how CodingIDE.tsx integrates with Supabase
import toast from "react-hot-toast";
import supabase from "../../../../lib/supabaseClient";

// ============================================================================
// TEACHER SERVICES
// ============================================================================

export const createTeacherProfile = async (teacherData: {
  name: string;
  bio: string;
  professionalBackground: string;
  tags: string[];
  expertise: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Error getting user:", userError);
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("teachers")
      .insert({
        user_id: user.id,
        name: teacherData.name,
        bio: teacherData.bio,
        professional_background: teacherData.professionalBackground,
        tags: teacherData.tags,
        expertise: teacherData.expertise,
        profile_photo: teacherData.profilePhoto,
        linkedin_url: teacherData.linkedinUrl,
        youtube_url: teacherData.youtubeUrl,
        instagram_url: teacherData.instagramUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating teacher profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in createTeacherProfile:", error);
    return { success: false, error: "Failed to create teacher profile" };
  }
};

export const getTeacherProfile = async (userId?: string) => {
  try {
    let targetUserId = userId;

    if (!targetUserId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return null;
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("user_id", targetUserId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching teacher profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getTeacherProfile:", error);
    return null;
  }
};

export const updateTeacherProfile = async (updates: any) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return { success: false, error: "User not authenticated" };

    const { data, error } = await supabase
      .from("teachers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating teacher profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateTeacherProfile:", error);
    return { success: false, error: "Failed to update teacher profile" };
  }
};

export const getAllApprovedTeachers = async () => {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("is_approved", true)
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching approved teachers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllApprovedTeachers:", error);
    return [];
  }
};

export const searchTeachers = async (filters: {
  query?: string;
  tags?: string[];
  minRating?: number;
  category?: string;
}) => {
  try {
    const { data, error } = await supabase.rpc("search_teachers", {
      search_query: filters.query || null,
      tag_filters: filters.tags || null,
      min_rating: filters.minRating || null,
      category_filter: filters.category || null,
    });

    if (error) {
      console.error("Error searching teachers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in searchTeachers:", error);
    return [];
  }
};

// ============================================================================
// CLASS SERVICES
// ============================================================================

export const createClass = async (classData: {
  title: string;
  topic: string;
  description: string;
  dateTime: Date;
  price: number;
  priceType: "session" | "monthly" | "course";
  topicsCovered: string[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  duration: number;
  maxStudents?: number;
  prerequisites?: string[];
  certificateOffered?: boolean;
}) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return { success: false, error: "User not authenticated" };

    // Get teacher profile
    const teacher = await getTeacherProfile();
    if (!teacher) {
      return { success: false, error: "Teacher profile not found" };
    }

    const { data, error } = await supabase
      .from("classes")
      .insert({
        teacher_id: teacher.id,
        title: classData.title,
        topic: classData.topic,
        description: classData.description,
        date_time: classData.dateTime.toISOString(),
        price: classData.price,
        price_type: classData.priceType,
        topics_covered: classData.topicsCovered,
        tags: classData.tags,
        difficulty: classData.difficulty,
        category: classData.category,
        duration: classData.duration,
        max_students: classData.maxStudents,
        prerequisites: classData.prerequisites || [],
        certificate_offered: classData.certificateOffered || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating class:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in createClass:", error);
    return { success: false, error: "Failed to create class" };
  }
};

export const getAllClasses = async () => {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select(
        `
        *,
        teachers:teacher_id (
          name,
          rating,
          profile_photo
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching classes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllClasses:", error);
    return [];
  }
};

export const searchClasses = async (filters: {
  query?: string;
  category?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}) => {
  try {
    const { data, error } = await supabase.rpc("search_classes", {
      search_query: filters.query || null,
      category_filter: filters.category || null,
      difficulty_filter: filters.difficulty || null,
      min_price: filters.minPrice || null,
      max_price: filters.maxPrice || null,
      tag_filters: filters.tags || null,
    });

    if (error) {
      console.error("Error searching classes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in searchClasses:", error);
    return [];
  }
};

// ============================================================================
// ENROLLMENT SERVICES
// ============================================================================

export const enrollInClass = async (classId: string, teacherId: string) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return { success: false, error: "User not authenticated" };

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        class_id: classId,
        status: "active",
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error enrolling in class:", error);
      return { success: false, error: error.message };
    }

    // Update enrolled_students array in classes table
    const { error: updateError } = await supabase.rpc("add_student_to_class", {
      class_uuid: classId,
      student_uuid: user.id,
    });

    if (updateError) {
      console.error("Error updating class enrollment list:", updateError);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in enrollInClass:", error);
    return { success: false, error: "Failed to enroll in class" };
  }
};

export const getUserEnrollments = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return [];

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        classes:class_id (
          title,
          topic,
          description,
          date_time,
          duration,
          category
        ),
        teachers:teacher_id (
          name,
          profile_photo
        )
      `
      )
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false });

    if (error) {
      console.error("Error fetching user enrollments:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserEnrollments:", error);
    return [];
  }
};

export const socialPostService = {
  // Create a new social post (teachers only)
  async createPost(postData: {
    content: string;
    type: "milestone" | "announcement" | "tips" | "general";
    images?: string[];
    videoUrl?: string;
    tags?: string[];
    visibility?: "public" | "followers" | "private";
    isPinned?: boolean;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Get teacher profile
      const { data: teacher, error: teacherError } = await supabase
        .from("lms_teachers")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_approved", true)
        .single();

      if (teacherError || !teacher) {
        return {
          success: false,
          error: "Only approved teachers can create posts",
        };
      }

      const { data, error } = await supabase
        .from("lms_social_posts")
        .insert([
          {
            teacher_id: teacher.id,
            content: postData.content,
            type: postData.type,
            images: postData.images || [],
            video_url: postData.videoUrl,
            tags: postData.tags || [],
            visibility: postData.visibility || "public",
            is_pinned: postData.isPinned || false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating post:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error in createPost:", error);
      return { success: false, error: "Failed to create post" };
    }
  },

  // Get social feed with pagination
  async getSocialFeed(params: {
    limit?: number;
    offset?: number;
    teacherId?: string;
    type?: string[];
    tags?: string[];
    followingOnly?: boolean;
  }): Promise<any[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase.from("lms_social_posts").select(`
          *,
          teacher:lms_teachers!inner(
            id,
            name,
            profile_photo,
            rating,
            total_students,
            tags,
            expertise
          ),
          like_count,
          comment_count,
          share_count
        `);

      // Filter by visibility
      if (user) {
        // If user is logged in, show public posts and posts from followed teachers
        if (params.followingOnly) {
          const { data: followedTeachers } = await supabase
            .from("lms_teacher_follows")
            .select("teacher_id")
            .eq("follower_id", user.id);

          const followedTeacherIds =
            followedTeachers?.map((f) => f.teacher_id) || [];

          if (followedTeacherIds.length > 0) {
            query = query.in("teacher_id", followedTeacherIds);
          } else {
            return []; // No followed teachers
          }
        } else {
          query = query.or(
            `visibility.eq.public,and(visibility.eq.followers,teacher_id.in.(${await this.getFollowedTeacherIds(
              user.id
            )}))`
          );
        }
      } else {
        // If user is not logged in, only show public posts
        query = query.eq("visibility", "public");
      }

      // Apply filters
      if (params.teacherId) {
        query = query.eq("teacher_id", params.teacherId);
      }

      if (params.type && params.type.length > 0) {
        query = query.in("type", params.type);
      }

      if (params.tags && params.tags.length > 0) {
        query = query.overlaps("tags", params.tags);
      }

      // Order by pinned first, then by creation date
      query = query.order("is_pinned", { ascending: false });
      query = query.order("created_at", { ascending: false });

      // Pagination
      query = query.range(
        params.offset || 0,
        (params.offset || 0) + (params.limit || 20) - 1
      );

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching social feed:", error);
        return [];
      }

      // For each post, check if current user has liked it
      if (user && data) {
        const postsWithLikeStatus = await Promise.all(
          data.map(async (post) => {
            const { data: likeData } = await supabase
              .from("lms_social_likes")
              .select("id")
              .eq("post_id", post.id)
              .eq("user_id", user.id)
              .single();

            return {
              ...post,
              isLikedByCurrentUser: !!likeData,
            };
          })
        );
        return postsWithLikeStatus;
      }

      return data || [];
    } catch (error) {
      console.error("Error in getSocialFeed:", error);
      return [];
    }
  },

  // Get trending posts
  async getTrendingPosts(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc("get_trending_posts", {
        limit_count: limit,
      });

      if (error) {
        console.error("Error fetching trending posts:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTrendingPosts:", error);
      return [];
    }
  },

  // Update post
  async updatePost(
    postId: string,
    updates: {
      content?: string;
      images?: string[];
      videoUrl?: string;
      tags?: string[];
      visibility?: "public" | "followers" | "private";
      isPinned?: boolean;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if user owns the post
      const { data: existingPost, error: fetchError } = await supabase
        .from("lms_social_posts")
        .select("teacher_id, lms_teachers!inner(user_id)")
        .eq("id", postId)
        .single();

      if (fetchError || !existingPost) {
        return { success: false, error: "Post not found" };
      }

      if (
        !Array.isArray(existingPost.lms_teachers) ||
        existingPost.lms_teachers.length === 0 ||
        existingPost.lms_teachers[0].user_id !== user.id
      ) {
        return { success: false, error: "You can only edit your own posts" };
      }

      const updateData: any = { updated_at: new Date().toISOString() };

      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.videoUrl !== undefined)
        updateData.video_url = updates.videoUrl;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.visibility !== undefined)
        updateData.visibility = updates.visibility;
      if (updates.isPinned !== undefined)
        updateData.is_pinned = updates.isPinned;

      const { data, error } = await supabase
        .from("lms_social_posts")
        .update(updateData)
        .eq("id", postId)
        .select()
        .single();

      if (error) {
        console.error("Error updating post:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error in updatePost:", error);
      return { success: false, error: "Failed to update post" };
    }
  },

  // Delete post
  async deletePost(
    postId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if user owns the post
      const { data: existingPost, error: fetchError } = await supabase
        .from("lms_social_posts")
        .select("teacher_id, lms_teachers!inner(user_id)")
        .eq("id", postId)
        .single();

      if (fetchError || !existingPost) {
        return { success: false, error: "Post not found" };
      }

      if (
        !Array.isArray(existingPost.lms_teachers) ||
        existingPost.lms_teachers.length === 0 ||
        existingPost.lms_teachers[0].user_id !== user.id
      ) {
        return { success: false, error: "You can only delete your own posts" };
      }

      const { error } = await supabase
        .from("lms_social_posts")
        .delete()
        .eq("id", postId);

      if (error) {
        console.error("Error deleting post:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in deletePost:", error);
      return { success: false, error: "Failed to delete post" };
    }
  },

  // Helper function to get followed teacher IDs
  async getFollowedTeacherIds(userId: string): Promise<string> {
    const { data } = await supabase
      .from("lms_teacher_follows")
      .select("teacher_id")
      .eq("follower_id", userId);

    return data?.map((f) => f.teacher_id).join(",") || "";
  },
};

// ============================================================================
// SOCIAL INTERACTION SERVICES
// ============================================================================

export const socialInteractionService = {
  // Like/Unlike post
  async toggleLike(
    postId: string
  ): Promise<{ success: boolean; action?: string; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Please sign in to like posts" };
      }

      // Check if user already liked the post
      const { data: existingLike, error: fetchError } = await supabase
        .from("lms_social_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking like status:", fetchError);
        return { success: false, error: "Failed to check like status" };
      }

      if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
          .from("lms_social_likes")
          .delete()
          .eq("id", existingLike.id);

        if (deleteError) {
          console.error("Error unliking post:", deleteError);
          return { success: false, error: "Failed to unlike post" };
        }

        // Update like count
        await this.updatePostStats(postId, "like_count", -1);

        return { success: true, action: "unliked" };
      } else {
        // Like
        const { error: insertError } = await supabase
          .from("lms_social_likes")
          .insert([
            {
              post_id: postId,
              user_id: user.id,
            },
          ]);

        if (insertError) {
          console.error("Error liking post:", insertError);
          return { success: false, error: "Failed to like post" };
        }

        // Update like count
        await this.updatePostStats(postId, "like_count", 1);

        return { success: true, action: "liked" };
      }
    } catch (error) {
      console.error("Error in toggleLike:", error);
      return { success: false, error: "Failed to toggle like" };
    }
  },

  // Add comment
  async addComment(
    postId: string,
    content: string,
    parentCommentId?: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Please sign in to comment" };
      }

      const { data, error } = await supabase
        .from("lms_social_comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content,
            parent_comment_id: parentCommentId || null,
          },
        ])
        .select(
          `
          *,
          user:auth.users(
            id,
            email
          )
        `
        )
        .single();

      if (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: error.message };
      }

      // Update comment count
      await this.updatePostStats(postId, "comment_count", 1);

      return { success: true, data };
    } catch (error) {
      console.error("Error in addComment:", error);
      return { success: false, error: "Failed to add comment" };
    }
  },

  // Get post comments
  async getPostComments(postId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("lms_social_comments")
        .select(
          `
          *,
          user:auth.users(
            id,
            email
          ),
          replies:lms_social_comments!parent_comment_id(
            *,
            user:auth.users(
              id,
              email
            )
          )
        `
        )
        .eq("post_id", postId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPostComments:", error);
      return [];
    }
  },

  // Delete comment
  async deleteComment(
    commentId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if user owns the comment
      const { data: comment, error: fetchError } = await supabase
        .from("lms_social_comments")
        .select("user_id, post_id")
        .eq("id", commentId)
        .single();

      if (fetchError || !comment) {
        return { success: false, error: "Comment not found" };
      }

      if (comment.user_id !== user.id) {
        return {
          success: false,
          error: "You can only delete your own comments",
        };
      }

      const { error } = await supabase
        .from("lms_social_comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: error.message };
      }

      // Update comment count
      await this.updatePostStats(comment.post_id, "comment_count", -1);

      return { success: true };
    } catch (error) {
      console.error("Error in deleteComment:", error);
      return { success: false, error: "Failed to delete comment" };
    }
  },

  // Share post
  async sharePost(
    postId: string,
    platform: "internal" | "twitter" | "linkedin" | "facebook"
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Please sign in to share posts" };
      }

      const { data, error } = await supabase
        .from("lms_social_shares")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            platform,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sharing post:", error);
        return { success: false, error: error.message };
      }

      // Update share count
      await this.updatePostStats(postId, "share_count", 1);

      return { success: true, data };
    } catch (error) {
      console.error("Error in sharePost:", error);
      return { success: false, error: "Failed to share post" };
    }
  },

  // Helper function to update post statistics
  async updatePostStats(
    postId: string,
    field: string,
    increment: number
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc("update_post_stats", {
        post_uuid: postId,
        stat_field: field,
        increment_value: increment,
      });

      if (error) {
        console.error("Error updating post stats:", error);
      }
    } catch (error) {
      console.error("Error in updatePostStats:", error);
    }
  },
};

// ============================================================================
// TEACHER FOLLOW SERVICES
// ============================================================================

export const teacherFollowService = {
  // Follow teacher
  async followTeacher(
    teacherId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Please sign in to follow teachers" };
      }

      // Check if already following
      const { data: existingFollow } = await supabase
        .from("lms_teacher_follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("teacher_id", teacherId)
        .single();

      if (existingFollow) {
        return { success: false, error: "Already following this teacher" };
      }

      const { error } = await supabase.from("lms_teacher_follows").insert([
        {
          follower_id: user.id,
          teacher_id: teacherId,
        },
      ]);

      if (error) {
        console.error("Error following teacher:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in followTeacher:", error);
      return { success: false, error: "Failed to follow teacher" };
    }
  },

  // Unfollow teacher
  async unfollowTeacher(
    teacherId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const { error } = await supabase
        .from("lms_teacher_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("teacher_id", teacherId);

      if (error) {
        console.error("Error unfollowing teacher:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in unfollowTeacher:", error);
      return { success: false, error: "Failed to unfollow teacher" };
    }
  },

  // Get followed teachers
  async getFollowedTeachers(userId?: string): Promise<any[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        return [];
      }

      const { data, error } = await supabase
        .from("lms_teacher_follows")
        .select(
          `
          teacher:lms_teachers(
            id,
            name,
            bio,
            profile_photo,
            rating,
            total_students,
            expertise,
            tags
          )
        `
        )
        .eq("follower_id", targetUserId);

      if (error) {
        console.error("Error fetching followed teachers:", error);
        return [];
      }

      return data?.map((item: any) => item.teacher) || [];
    } catch (error) {
      console.error("Error in getFollowedTeachers:", error);
      return [];
    }
  },

  // Get teacher followers
  async getTeacherFollowers(teacherId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("lms_teacher_follows")
        .select(
          `
          follower:auth.users(
            id,
            email
          )
        `
        )
        .eq("teacher_id", teacherId);

      if (error) {
        console.error("Error fetching teacher followers:", error);
        return [];
      }

      return data?.map((item: any) => item.follower) || [];
    } catch (error) {
      console.error("Error in getTeacherFollowers:", error);
      return [];
    }
  },

  // Check if user is following teacher
  async isFollowingTeacher(teacherId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from("lms_teacher_follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("teacher_id", teacherId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking follow status:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error in isFollowingTeacher:", error);
      return false;
    }
  },
};

// ============================================================================
// NOTIFICATION SERVICES
// ============================================================================

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message?: string,
  data?: any
) => {
  try {
    const { data: notification, error } = await supabase.rpc(
      "create_notification",
      {
        p_user_id: userId,
        p_type: type,
        p_title: title,
        p_message: message || null,
        p_data: data || {},
      }
    );

    if (error) {
      console.error("Error creating notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: notification };
  } catch (error) {
    console.error("Error in createNotification:", error);
    return { success: false, error: "Failed to create notification" };
  }
};

export const getUserNotifications = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return [];

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
};

// ============================================================================
// ADMIN SERVICES
// ============================================================================

export const getPendingTeachers = async () => {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("is_approved", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending teachers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getPendingTeachers:", error);
    return [];
  }
};

export const approveTeacher = async (teacherId: string) => {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq("id", teacherId)
      .select()
      .single();

    if (error) {
      console.error("Error approving teacher:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in approveTeacher:", error);
    return { success: false, error: "Failed to approve teacher" };
  }
};

export const rejectTeacher = async (teacherId: string) => {
  try {
    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", teacherId);

    if (error) {
      console.error("Error rejecting teacher:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in rejectTeacher:", error);
    return { success: false, error: "Failed to reject teacher" };
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Add student to class enrolled_students array (needs SQL function)
// This will be created in additional SQL functions below

export const getTeacherAnalytics = async (teacherId?: string) => {
  try {
    let targetTeacherId = teacherId;

    if (!targetTeacherId) {
      const teacher = await getTeacherProfile();
      if (!teacher) return null;
      targetTeacherId = teacher.id;
    }

    // Get enrollment stats
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("status, created_at")
      .eq("teacher_id", targetTeacherId);

    if (enrollError) {
      console.error("Error fetching enrollment analytics:", enrollError);
      return null;
    }

    // Get class stats
    const { data: classes, error: classError } = await supabase
      .from("classes")
      .select("enrolled_students, created_at")
      .eq("teacher_id", targetTeacherId);

    if (classError) {
      console.error("Error fetching class analytics:", classError);
      return null;
    }

    return {
      totalEnrollments: enrollments?.length || 0,
      activeEnrollments:
        enrollments?.filter((e: any) => e.status === "active").length || 0,
      totalClasses: classes?.length || 0,
      totalStudents: new Set(
        classes?.flatMap((c: any) => c.enrolled_students || [])
      ).size,
    };
  } catch (error) {
    console.error("Error in getTeacherAnalytics:", error);
    return null;
  }
};
