import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../../context/AuthContext";
import { Teacher, Class, SocialPost } from "../../../../types";
import toast from "react-hot-toast";

export const useLMS = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from("lms_teachers")
        .select("*")
        .eq("is_approved", true);

      if (error) throw error;

      // Transform the data to match our TypeScript interface
      const transformedData = (data || []).map((teacher) => ({
        ...teacher,
        createdAt: teacher.created_at
          ? new Date(teacher.created_at)
          : new Date(),
        totalStudents: teacher.total_students || 0,
        totalClasses: teacher.total_classes || 0,
        isApproved: teacher.is_approved || false,
        professionalBackground: teacher.professional_background || "",
        linkedinUrl: teacher.linkedin_url || "",
        youtubeUrl: teacher.youtube_url || "",
        instagramUrl: teacher.instagram_url || "",
        profilePhoto: teacher.profile_photo || "",
        userId: teacher.user_id || "",
      }));

      setTeachers(transformedData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers");
    }
  };

  // Fetch pending teachers (for admin)
  const fetchPendingTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from("lms_teachers")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our TypeScript interface
      const transformedData = (data || []).map((teacher) => ({
        ...teacher,
        createdAt: teacher.created_at
          ? new Date(teacher.created_at)
          : new Date(),
        totalStudents: teacher.total_students || 0,
        totalClasses: teacher.total_classes || 0,
        isApproved: teacher.is_approved || false,
        professionalBackground: teacher.professional_background || "",
        linkedinUrl: teacher.linkedin_url || "",
        youtubeUrl: teacher.youtube_url || "",
        instagramUrl: teacher.instagram_url || "",
        profilePhoto: teacher.profile_photo || "",
        userId: teacher.user_id || "",
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching pending teachers:", error);
      toast.error("Failed to fetch pending teachers");
      return [];
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase.from("lms_classes").select(`
          *,
          teacher:lms_teachers(*)
        `);

      if (error) throw error;

      // Transform the data to match our TypeScript interface
      const transformedData = (data || []).map((classData) => ({
        id: classData.id,
        title: classData.title || "",
        description: classData.description || "",
        teacherId: classData.teacher_id || "",
        topic: classData.topic || "",
        category: classData.category || "",
        difficulty: classData.difficulty || "beginner",
        price: classData.price || 0,
        priceType: classData.price_type || "session",
        dateTime: classData.date_time
          ? new Date(classData.date_time)
          : new Date(),
        duration: classData.duration || 60,
        maxStudents: classData.max_students || 50,
        topicsCovered: classData.topics_covered || [],
        tags: classData.tags || [],
        enrolledStudents: classData.enrolled_students || [],
        isLive: classData.is_live || false,
        certificateOffered: classData.certificate_offered || false,
        homeworkTasks: classData.homework_tasks || [],
        createdAt: classData.created_at || new Date().toISOString(),
        teacher: classData.teacher,
      }));

      setClasses(transformedData);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch social posts
  const fetchSocialPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("lms_social_posts")
        .select(
          `
          *,
          teacher:lms_teachers(*),
          comments:lms_social_comments(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our TypeScript interface
      const transformedData = (data || []).map((post) => ({
        ...post,
        createdAt: post.created_at ? new Date(post.created_at) : new Date(),
        teacherId: post.teacher_id || "",
        sharedToSocial: post.shared_to_social || {
          twitter: false,
          linkedin: false,
        },
        comments: (post.comments || []).map((comment: any) => ({
          ...comment,
          createdAt: comment.created_at
            ? new Date(comment.created_at)
            : new Date(),
          userId: comment.user_id || "",
        })),
      }));

      setSocialPosts(transformedData);
    } catch (error) {
      console.error("Error fetching social posts:", error);
      toast.error("Failed to fetch social posts");
    }
  };

  // Submit teacher application
  const submitTeacherApplication = async (teacherData: any) => {
    if (!user) {
      toast.error("Please sign in to apply");
      return false;
    }

    try {
      // Prepare data with only valid columns and handle optional URLs
      const applicationData = {
        name: teacherData.name,
        bio: teacherData.bio,
        professional_background: teacherData.professionalBackground,
        tags: teacherData.tags,
        expertise: teacherData.expertise,
        linkedin_url: teacherData.linkedinUrl || null,
        youtube_url: teacherData.youtubeUrl || null,
        instagram_url: teacherData.instagramUrl || null,
        user_id: user.id,
        is_approved: false,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("lms_teachers")
        .insert([applicationData]);

      if (error) throw error;
      toast.success("Application submitted successfully!");
      return true;
    } catch (error) {
      console.error("Error submitting teacher application:", error);
      toast.error("Failed to submit application");
      return false;
    }
  };

  // Create class
  const createClass = async (classData: any) => {
    if (!user) {
      toast.error("Please sign in to create a class");
      return false;
    }

    try {
      // Check if user is an approved teacher
      // Note: email comes from auth.users (user.email), other fields from profiles
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_teacher, display_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        console.error("Profile error details:", {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
        });

        // If profile doesn't exist, create it
        if (profileError.code === "PGRST116") {
          console.log("Profile not found, creating new profile...");

          const { data: newProfile, error: createProfileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                display_name:
                  user.user_metadata?.display_name ||
                  user.email?.split("@")[0] ||
                  "User",
                is_teacher: true,
                is_admin: false,
              },
            ])
            .select("is_teacher, display_name")
            .single();

          if (createProfileError) {
            console.error("Error creating profile:", createProfileError);
            toast.error("Failed to create user profile. Please try again.");
            return false;
          }

          profile = newProfile;
        } else {
          toast.error(
            `Profile error: ${
              profileError.message || "Could not verify teacher status"
            }`
          );
          return false;
        }
      }

      if (!profile?.is_teacher) {
        toast.error("Only approved teachers can create classes");
        return false;
      }

      // Get or create the teacher's record in lms_teachers table
      let { data: teacherData, error: teacherError } = await supabase
        .from("lms_teachers")
        .select("id, is_approved, name, email")
        .eq("user_id", user.id)
        .single();

      if (teacherError) {
        console.error("Teacher lookup error:", teacherError);
        console.error("Error details:", {
          code: teacherError.code,
          message: teacherError.message,
          details: teacherError.details,
          hint: teacherError.hint,
        });

        // Handle different error types
        if (teacherError.code === "PGRST116") {
          // No rows found - create teacher record
          console.log("No teacher record found, creating new one...");

          const newTeacherData = {
            user_id: user.id,
            name:
              profile.display_name || user.email?.split("@")[0] || "Teacher",
            email: user.email || "teacher@example.com", // Email always comes from auth.users
            bio: "Experienced educator ready to share knowledge",
            specialization: "General Teaching",
            is_approved: true,
            tags: [],
            rating: 0,
            total_students: 0,
            total_classes: 0,
          };

          const { data: newTeacher, error: createError } = await supabase
            .from("lms_teachers")
            .insert([newTeacherData])
            .select("id, is_approved, name, email")
            .single();

          if (createError) {
            console.error("Error creating teacher record:", createError);
            toast.error(
              `Failed to create teacher profile: ${createError.message}`
            );
            return false;
          }

          teacherData = newTeacher;
        } else if (teacherError.code === "PGRST301") {
          // Multiple rows found - this shouldn't happen but handle it
          console.error("Multiple teacher records found for user");
          toast.error(
            "Multiple teacher records found. Please contact support."
          );
          return false;
        } else {
          // Other errors (like RLS policy violations, 406 errors, etc.)
          toast.error(
            `Database error: ${teacherError.message || "Unknown error"}`
          );
          return false;
        }
      }

      if (!teacherData) {
        toast.error("Teacher profile not found. Please try again.");
        return false;
      }

      if (!teacherData.is_approved) {
        toast.error("Your teacher application is still pending approval");
        return false;
      }

      const { error } = await supabase.from("lms_classes").insert([
        {
          title: classData.title,
          description: classData.description,
          topic: classData.topic,
          category: classData.category || "General",
          difficulty: classData.difficulty || "beginner",
          price: classData.price,
          price_type: classData.priceType || "session",
          date_time: classData.dateTime,
          duration: classData.duration || 60,
          max_students: classData.maxStudents || 50,
          topics_covered: classData.topicsCovered || [],
          tags: classData.tags || [],
          enrolled_students: [],
          is_live: classData.isLive || false,
          certificate_offered: classData.certificateOffered || false,
          homework_tasks: classData.homeworkTasks || [],
          teacher_id: teacherData.id,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      toast.success("Class created successfully!");
      await fetchClasses();
      return true;
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Failed to create class");
      return false;
    }
  };

  // Enroll in class
  const enrollInClass = async (classId: string) => {
    if (!user) {
      toast.error("Please sign in to enroll");
      return false;
    }

    try {
      const payload = {
        class_id: classId,
        student_id: user.id,
        enrolled_at: new Date().toISOString(),
        status: "active",
      };
      console.log("ENROLL PAYLOAD", payload);
      const { error } = await supabase
        .from("lms_enrollments")
        .insert([payload]);

      if (error) throw error;
      toast.success("Enrolled successfully!");
      await fetchClasses();
      return true;
    } catch (error) {
      console.error("Error enrolling in class:", error);
      toast.error("Failed to enroll");
      return false;
    }
  };

  // Like social post
  const likePost = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return false;
    }

    try {
      const { error } = await supabase.from("lms_social_likes").insert([
        {
          post_id: postId,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      await fetchSocialPosts();
      return true;
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
      return false;
    }
  };

  // Add comment to social post
  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast.error("Please sign in to comment");
      return false;
    }

    try {
      const { error } = await supabase.from("lms_social_comments").insert([
        {
          post_id: postId,
          user_id: user.id,
          content,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      await fetchSocialPosts();
      toast.success("Comment added!");
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      return false;
    }
  };

  // Approve teacher (admin only)
  const approveTeacher = async (teacherId: string) => {
    if (!user) {
      toast.error("Please sign in");
      return false;
    }

    try {
      // First, get the teacher's user_id
      const { data: teacherData, error: teacherError } = await supabase
        .from("lms_teachers")
        .select("user_id")
        .eq("id", teacherId)
        .single();

      if (teacherError) throw teacherError;

      // Update the teacher as approved
      const { error: approveError } = await supabase
        .from("lms_teachers")
        .update({ is_approved: true })
        .eq("id", teacherId);

      if (approveError) throw approveError;

      // Update the user's profile to mark them as a teacher
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_teacher: true })
        .eq("id", teacherData.user_id);

      if (profileError) throw profileError;

      toast.success("Teacher approved!");
      await fetchTeachers();
      return true;
    } catch (error) {
      console.error("Error approving teacher:", error);
      toast.error("Failed to approve teacher");
      return false;
    }
  };

  // Reject teacher (admin only)
  const rejectTeacher = async (teacherId: string) => {
    if (!user) {
      toast.error("Please sign in");
      return false;
    }

    try {
      // First, get the teacher's user_id
      const { data: teacherData, error: teacherError } = await supabase
        .from("lms_teachers")
        .select("user_id")
        .eq("id", teacherId)
        .single();

      if (teacherError) throw teacherError;

      // Delete the teacher application
      const { error: deleteError } = await supabase
        .from("lms_teachers")
        .delete()
        .eq("id", teacherId);

      if (deleteError) throw deleteError;

      // Make sure the user's profile is_teacher is set to false
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_teacher: false })
        .eq("id", teacherData.user_id);

      if (profileError) throw profileError;

      toast.success("Teacher application rejected");
      await fetchTeachers();
      return true;
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      toast.error("Failed to reject teacher");
      return false;
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTeachers(),
        fetchClasses(),
        fetchSocialPosts(),
        fetchUserProfile(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Helper functions to check user roles
  const isAdmin = () => userProfile?.is_admin || false;
  const isTeacher = () => userProfile?.is_teacher || false;
  const isStudent = () => !isAdmin() && !isTeacher();

  // Check if user is an approved teacher in the LMS system
  const isApprovedTeacher = async () => {
    if (!user || !isTeacher()) return false;

    try {
      const { data: teacherData, error } = await supabase
        .from("lms_teachers")
        .select("is_approved")
        .eq("user_id", user.id)
        .single();

      if (error) return false;
      return teacherData?.is_approved || false;
    } catch (error) {
      return false;
    }
  };

  return {
    user,
    userProfile,
    teachers,
    classes,
    socialPosts,
    loading,
    isAdmin,
    isTeacher,
    isStudent,
    isApprovedTeacher,
    submitTeacherApplication,
    createClass,
    enrollInClass,
    likePost,
    addComment,
    approveTeacher,
    rejectTeacher,
    fetchTeachers,
    fetchPendingTeachers,
    fetchClasses,
    fetchSocialPosts,
    fetchUserProfile,
  };
};
