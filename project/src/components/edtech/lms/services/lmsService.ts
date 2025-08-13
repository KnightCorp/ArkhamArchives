import { supabase } from "../../../../lib/supabaseClient";
import { Teacher, Class } from "../../../../types";
import toast from "react-hot-toast";

// Teacher Services
export const teacherService = {
  // Get all approved teachers
  async getApprovedTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from("lms_teachers")
      .select("*")
      .eq("is_approved", true)
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }

    return data || [];
  },

  // Get pending teachers (admin only)
  async getPendingTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from("lms_teachers")
      .select("*")
      .eq("is_approved", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending teachers:", error);
      throw error;
    }

    return data || [];
  },

  // Submit teacher application
  async submitApplication(teacherData: Partial<Teacher>): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to apply");
      return false;
    }

    const { error } = await supabase.from("lms_teachers").insert([
      {
        user_id: user.id,
        name: teacherData.name,
        bio: teacherData.bio,
        professional_background: teacherData.professionalBackground,
        expertise: teacherData.expertise,
        tags: teacherData.tags || [],
        linkedin_url: teacherData.linkedinUrl,
        youtube_url: teacherData.youtubeUrl,
        instagram_url: teacherData.instagramUrl,
        profile_photo: teacherData.profilePhoto,
        is_approved: false,
      },
    ]);

    if (error) {
      console.error("Error submitting teacher application:", error);
      toast.error("Failed to submit application");
      return false;
    }

    toast.success("Application submitted successfully!");
    return true;
  },

  // Approve teacher (admin only)
  async approveTeacher(teacherId: string): Promise<boolean> {
    const { error } = await supabase.rpc("approve_teacher_application", {
      teacher_uuid: teacherId,
    });

    if (error) {
      console.error("Error approving teacher:", error);
      toast.error("Failed to approve teacher");
      return false;
    }

    toast.success("Teacher approved successfully!");
    return true;
  },

  // Reject teacher (admin only)
  async rejectTeacher(teacherId: string): Promise<boolean> {
    const { error } = await supabase.rpc("reject_teacher_application", {
      teacher_uuid: teacherId,
    });

    if (error) {
      console.error("Error rejecting teacher:", error);
      toast.error("Failed to reject teacher");
      return false;
    }

    toast.success("Teacher application rejected");
    return true;
  },

  // Get teacher details with stats
  async getTeacherDetails(teacherId: string): Promise<any> {
    const { data, error } = await supabase.rpc("get_teacher_details", {
      teacher_id: teacherId,
    });

    if (error) {
      console.error("Error fetching teacher details:", error);
      throw error;
    }

    return data?.[0] || null;
  },
};

// Class Services
export const classService = {
  // Get all classes
  async getAllClasses(): Promise<Class[]> {
    const { data, error } = await supabase
      .from("lms_classes")
      .select(
        `
        *,
        teacher:lms_teachers(*),
        enrollments:lms_enrollments(count)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }

    return data || [];
  },

  // Get popular classes
  async getPopularClasses(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase.rpc("get_popular_classes", {
      limit_count: limit,
    });

    if (error) {
      console.error("Error fetching popular classes:", error);
      throw error;
    }

    return data || [];
  },

  // Search classes
  async searchClasses(filters: {
    searchTerm?: string;
    category?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const { data, error } = await supabase.rpc("search_classes", {
      search_term: filters.searchTerm || "",
      category_filter: filters.category || "",
      difficulty_filter: filters.difficulty || "",
      min_price: filters.minPrice || 0,
      max_price: filters.maxPrice || 999999,
      tags_filter: filters.tags || [],
      limit_count: filters.limit || 20,
      offset_count: filters.offset || 0,
    });

    if (error) {
      console.error("Error searching classes:", error);
      throw error;
    }

    return data || [];
  },

  // Create class
  async createClass(classData: Partial<Class>): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to create a class");
      return false;
    }

    // Get teacher ID from user ID
    const { data: teacher } = await supabase
      .from("lms_teachers")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_approved", true)
      .single();

    if (!teacher) {
      toast.error("You must be an approved teacher to create classes");
      return false;
    }

    const { error } = await supabase.from("lms_classes").insert([
      {
        teacher_id: teacher.id,
        title: classData.title,
        topic: classData.topic,
        description: classData.description,
        date_time: classData.dateTime?.toISOString(),
        price: classData.price,
        price_type: classData.priceType,
        topics_covered: classData.topicsCovered || [],
        is_live: classData.isLive || false,
        tags: classData.tags || [],
        difficulty: classData.difficulty,
        category: classData.category,
        duration: classData.duration,
        prerequisites: classData.prerequisites || [],
        certificate_offered: classData.certificateOffered || false,
      },
    ]);

    if (error) {
      console.error("Error creating class:", error);
      toast.error("Failed to create class");
      return false;
    }

    toast.success("Class created successfully!");
    return true;
  },

  // Enroll in class
  async enrollInClass(classId: string): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to enroll");
      return false;
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from("lms_enrollments")
      .select("id")
      .eq("class_id", classId)
      .eq("student_id", user.id)
      .single();

    if (existingEnrollment) {
      toast.error("You are already enrolled in this class");
      return false;
    }

    const { error } = await supabase.from("lms_enrollments").insert([
      {
        class_id: classId,
        student_id: user.id,
        status: "active",
      },
    ]);

    if (error) {
      console.error("Error enrolling in class:", error);
      toast.error("Failed to enroll in class");
      return false;
    }

    toast.success("Successfully enrolled in class!");
    return true;
  },

  // Get student's enrolled classes
  async getStudentClasses(userId: string): Promise<any[]> {
    const { data, error } = await supabase.rpc("get_student_enrolled_classes", {
      student_user_id: userId,
    });

    if (error) {
      console.error("Error fetching student classes:", error);
      throw error;
    }

    return data || [];
  },

  // Get teacher's classes with stats
  async getTeacherClasses(userId: string): Promise<any[]> {
    const { data, error } = await supabase.rpc(
      "get_teacher_classes_with_stats",
      {
        teacher_user_id: userId,
      }
    );

    if (error) {
      console.error("Error fetching teacher classes:", error);
      throw error;
    }

    return data || [];
  },
};

// Social Services
export const socialService = {
  // Get social feed
  async getSocialFeed(limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase.rpc("get_social_feed_with_stats", {
      limit_count: limit,
    });

    if (error) {
      console.error("Error fetching social feed:", error);
      throw error;
    }

    return data || [];
  },

  // Create social post
  async createPost(postData: {
    content: string;
    type: "milestone" | "announcement" | "tips" | "general";
  }): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to post");
      return false;
    }

    // Get teacher ID from user ID
    const { data: teacher } = await supabase
      .from("lms_teachers")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_approved", true)
      .single();

    if (!teacher) {
      toast.error("You must be an approved teacher to post");
      return false;
    }

    const { error } = await supabase.from("lms_social_posts").insert([
      {
        teacher_id: teacher.id,
        content: postData.content,
        type: postData.type,
      },
    ]);

    if (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      return false;
    }

    toast.success("Post created successfully!");
    return true;
  },

  // Like/unlike post
  async toggleLike(postId: string): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to like posts");
      return false;
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from("lms_social_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from("lms_social_likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) {
        console.error("Error unliking post:", error);
        return false;
      }
    } else {
      // Like
      const { error } = await supabase.from("lms_social_likes").insert([
        {
          post_id: postId,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error("Error liking post:", error);
        return false;
      }
    }

    return true;
  },

  // Add comment
  async addComment(postId: string, content: string): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to comment");
      return false;
    }

    const { error } = await supabase.from("lms_social_comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        content,
      },
    ]);

    if (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      return false;
    }

    return true;
  },

  // Get post comments
  async getPostComments(postId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("lms_social_comments")
      .select(
        `
        *,
        user:auth.users(*)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }

    return data || [];
  },
};

// Analytics Services
export const analyticsService = {
  // Get trending topics
  async getTrendingTopics(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase.rpc("get_trending_topics", {
      limit_count: limit,
    });

    if (error) {
      console.error("Error fetching trending topics:", error);
      throw error;
    }

    return data || [];
  },

  // Get admin dashboard stats
  async getAdminStats(): Promise<any> {
    const { data, error } = await supabase.rpc("get_admin_dashboard_stats");

    if (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }

    return data?.[0] || null;
  },
};

// Utility Services
export const utilityService = {
  // Check if user has liked a post
  async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("has_user_liked_post", {
      post_uuid: postId,
      user_uuid: userId,
    });

    if (error) {
      console.error("Error checking like status:", error);
      return false;
    }

    return data || false;
  },

  // Check if user is enrolled in a class
  async isUserEnrolled(classId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("is_user_enrolled", {
      class_uuid: classId,
      user_uuid: userId,
    });

    if (error) {
      console.error("Error checking enrollment status:", error);
      return false;
    }

    return data || false;
  },

  // Upload file to Supabase Storage
  async uploadFile(
    file: File,
    bucket: string,
    path: string
  ): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  },
};
