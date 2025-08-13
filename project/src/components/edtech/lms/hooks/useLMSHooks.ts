// LMS React Hooks for Supabase Integration
// Following the pattern from CodingIDE.tsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../../context/AuthContext";
import {
  teacherService,
  classService,
  socialService,
} from "../services/lmsService";
// ============================================================================
// TEACHER HOOKS
// ============================================================================

export const useTeacherProfile = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacherProfile = useCallback(async () => {
    if (!user) {
      setTeacher(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profile = await teacherService.getTeacherDetails(user.id);
      setTeacher(profile);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch teacher profile"
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTeacherProfile();
  }, [fetchTeacherProfile]);

  const createProfile = useCallback(
    async (profileData: any) => {
      const result = await teacherService.submitApplication(profileData);
      if (result) {
        await fetchTeacherProfile(); // Refresh the profile
        return { success: true, data: result };
      }
      setError("Failed to create profile");
      return { success: false, error: "Failed to create profile" };
    },
    [fetchTeacherProfile]
  );

  const updateProfile = useCallback(
    async (updates: any) => {
      // TODO: Implement profile update functionality
      // For now, we'll just refetch the profile since the current service doesn't have update
      console.log("Update profile with:", updates);
      await fetchTeacherProfile();
      return { success: true, data: teacher };
    },
    [fetchTeacherProfile, teacher]
  );

  return {
    teacher,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchTeacherProfile,
  };
};

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await teacherService.getApprovedTeachers();
      setTeachers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const searchTeachers = useCallback(async (filters: any) => {
    try {
      setLoading(true);
      console.log("Searching teachers with filters:", filters);
      const data = await teacherService.getApprovedTeachers(); // For now, just get all teachers
      setTeachers(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search teachers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teachers,
    loading,
    error,
    searchTeachers,
    refetch: fetchTeachers,
  };
};

export const useTeacherAnalytics = (teacherId?: string) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      // For now, return mock analytics since this function doesn't exist in the service
      const data = {
        totalStudents: 0,
        totalClasses: 0,
        totalEarnings: 0,
        rating: 0,
      };
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

// ============================================================================
// CLASS HOOKS
// ============================================================================

export const useClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await classService.getAllClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const createClass = useCallback(
    async (classData: any) => {
      const result = await classService.createClass(classData);
      if (result) {
        await fetchClasses(); // Refresh the list
        return { success: true, data: result };
      }
      setError("Failed to create class");
      return { success: false, error: "Failed to create class" };
    },
    [fetchClasses]
  );

  const searchClasses = useCallback(async (filters: any) => {
    try {
      setLoading(true);
      const data = await classService.searchClasses(filters);
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search classes");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    classes,
    loading,
    error,
    createClass,
    searchClasses,
    refetch: fetchClasses,
  };
};

// ============================================================================
// ENROLLMENT HOOKS
// ============================================================================

export const useEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    if (!user) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await classService.getStudentClasses(user.id);
      setEnrollments(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch enrollments"
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enrollInClass = useCallback(
    async (classId: string, teacherId: string) => {
      console.log("Enrolling in class:", classId, "with teacher:", teacherId);
      const result = await classService.enrollInClass(classId);
      if (result) {
        await fetchEnrollments(); // Refresh the list
        return { success: true, data: result };
      }
      setError("Failed to enroll in class");
      return { success: false, error: "Failed to enroll in class" };
    },
    [fetchEnrollments]
  );

  return {
    enrollments,
    loading,
    error,
    enrollInClass,
    refetch: fetchEnrollments,
  };
};

// ============================================================================
// SOCIAL HOOKS
// ============================================================================

export const useSocialFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const data = await socialService.getSocialFeed();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch social feed"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const createPost = useCallback(
    async (postData: any) => {
      const result = await socialService.createPost(postData);
      if (result) {
        await fetchFeed(); // Refresh the feed
        return { success: true, data: result };
      }
      setError("Failed to create post");
      return { success: false, error: "Failed to create post" };
    },
    [fetchFeed]
  );

  const likePost = useCallback(async (postId: string) => {
    const result = await socialService.toggleLike(postId);
    if (result) {
      // Update the post in the current list
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      return { success: true, action: "liked" };
    }
    return { success: false, error: "Failed to like post" };
  }, []);

  const addComment = useCallback(async (postId: string, content: string) => {
    const result = await socialService.addComment(postId, content);
    if (result) {
      // Update the post's comment count
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments_count: (post.comments_count || 0) + 1 }
            : post
        )
      );
      return { success: true, data: result };
    }
    return { success: false, error: "Failed to add comment" };
  }, []);

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    addComment,
    refetch: fetchFeed,
  };
};

export const usePostComments = (postId: string | null) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const data = await socialService.getPostComments(postId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
  };
};

// ============================================================================
// FOLLOW HOOKS
// ============================================================================

export const useFollowedTeachers = () => {
  const { user } = useAuth();
  const [followedTeachers, setFollowedTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowedTeachers = useCallback(async () => {
    if (!user) {
      setFollowedTeachers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Mock data for now since this function doesn't exist in the service
      const data: any[] = [];
      setFollowedTeachers(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch followed teachers"
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollowedTeachers();
  }, [fetchFollowedTeachers]);

  const followTeacher = useCallback(
    async (teacherId: string) => {
      // TODO: Implement follow teacher functionality
      console.log("Following teacher:", teacherId);
      await fetchFollowedTeachers(); // Refresh the list
      return { success: true };
    },
    [fetchFollowedTeachers]
  );

  const unfollowTeacher = useCallback(
    async (teacherId: string) => {
      // TODO: Implement unfollow teacher functionality
      console.log("Unfollowing teacher:", teacherId);
      await fetchFollowedTeachers(); // Refresh the list
      return { success: true };
    },
    [fetchFollowedTeachers]
  );

  return {
    followedTeachers,
    loading,
    error,
    followTeacher,
    unfollowTeacher,
    refetch: fetchFollowedTeachers,
  };
};

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Mock data for now since this function doesn't exist in the service
      const data: any[] = [];
      setNotifications(data);
      setUnreadCount(0);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    // Mock implementation for now
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    return { success: true };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    refetch: fetchNotifications,
  };
};

// ============================================================================
// ADMIN HOOKS
// ============================================================================

export const useAdminPanel = () => {
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await teacherService.getPendingTeachers();
      setPendingTeachers(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch pending teachers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingTeachers();
  }, [fetchPendingTeachers]);

  const approveTeacher = useCallback(
    async (teacherId: string) => {
      const result = await teacherService.approveTeacher(teacherId);
      if (result) {
        await fetchPendingTeachers(); // Refresh the list
        return { success: true };
      }
      return { success: false, error: "Failed to approve teacher" };
    },
    [fetchPendingTeachers]
  );

  const rejectTeacher = useCallback(
    async (teacherId: string) => {
      const result = await teacherService.rejectTeacher(teacherId);
      if (result) {
        await fetchPendingTeachers(); // Refresh the list
        return { success: true };
      }
      return { success: false, error: "Failed to reject teacher" };
    },
    [fetchPendingTeachers]
  );

  return {
    pendingTeachers,
    loading,
    error,
    approveTeacher,
    rejectTeacher,
    refetch: fetchPendingTeachers,
  };
};

// ============================================================================
// AUTHENTICATION HELPER HOOK
// ============================================================================

export const useLMSAuth = () => {
  const { user, loading } = useAuth();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsTeacher(false);
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }

      try {
        setCheckingRole(true);

        // Check if user is a teacher
        const teacherProfile = await teacherService.getTeacherDetails(user.id);
        setIsTeacher(!!teacherProfile);

        // Check if user is admin (you can implement this check based on your needs)
        // For now, we'll assume admin status is in the user metadata or profiles table
        setIsAdmin(user.user_metadata?.role === "admin" || false);
      } catch (err) {
        console.error("Error checking user role:", err);
        setIsTeacher(false);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [user]);

  return {
    user,
    isLoading: loading || checkingRole,
    isAuthenticated: !!user,
    isTeacher,
    isAdmin,
    isStudent: !!user && !isTeacher && !isAdmin,
  };
};

// ============================================================================
// SEARCH HOOK
// ============================================================================

export const useSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters: any = {}) => {
    try {
      setLoading(true);
      setError(null);

      const promises = [];

      // Search teachers
      if (!filters.type || filters.type === "teachers") {
        promises.push(teacherService.getApprovedTeachers());
      }

      // Search classes
      if (!filters.type || filters.type === "classes") {
        promises.push(classService.searchClasses({ query, ...filters }));
      }

      const [teacherResults = [], classResults = []] = await Promise.all(
        promises
      );

      const combinedResults = [
        ...teacherResults.map((item: any) => ({ ...item, type: "teacher" })),
        ...classResults.map((item: any) => ({ ...item, type: "class" })),
      ];

      setResults(combinedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
};
