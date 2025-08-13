import React, { useState, useEffect } from "react";
import { Terminal, Loader, CheckCircle, AlertCircle } from "lucide-react";
import TeacherOnboarding from "./TeacherOnboarding";
import ClassCreation from "./ClassCreation";
import TeacherProfile from "./TeacherProfile";
import SocialFeed from "./SocialFeed";
import AdminPanel from "./AdminPanel";
import { ClassDetails } from "./ClassDetails";
import { Teacher } from "../../../types";
import { useLMS } from "./hooks/useLMS";
import "./LMSMentors.css";
import { supabase } from "../../../lib/supabaseClient";

// ========================================
// DEVELOPMENT MODE CONFIGURATION
// ========================================
// Set this to true to enable Razorpay payment integration
// Set to false for development of post-enrollment features
const ENABLE_PAYMENT_INTEGRATION = true;

// ========================================
// RAZORPAY TYPES AND CONFIGURATION
// ========================================
// These are ready to use when ENABLE_PAYMENT_INTEGRATION is true
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface VerificationResult {
  verified: boolean;
  payment_id?: string;
  error?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// USD to INR conversion rate
const USD_TO_INR_RATE = 84;

// Mock data - keeping only what might be needed

// Utility function to safely format dates
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  return dateObj.toLocaleDateString();
};

// Utility function to format date and time together
const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";

  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  // Use local timezone for display
  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};

const LMSMentors: React.FC = () => {
  const {
    user,
    userProfile,
    teachers,
    classes,
    socialPosts,
    loading,
    isAdmin,
    isTeacher,
    submitTeacherApplication,
    createClass,
    enrollInClass,
    likePost,
    addComment,
    approveTeacher,
    rejectTeacher,
    fetchPendingTeachers,
  } = useLMS();

  const [currentView, setCurrentView] = useState<
    "classes" | "marketplace" | "social" | "admin" | "class-details"
  >("classes");
  const [showTeacherOnboarding, setShowTeacherOnboarding] = useState(false);
  const [showClassCreation, setShowClassCreation] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [followedTeachers, setFollowedTeachers] = useState<string[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<Teacher[]>([]);
  const [teacherStatus, setTeacherStatus] = useState<
    "none" | "pending" | "approved"
  >("none");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<string[]>([]);

  // ========================================
  // PAYMENT STATE
  // ========================================
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState<string | null>(
    null
  );

  // ========================================
  // PAYMENT FUNCTIONS
  // ========================================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (
    amount: number,
    classTitle: string,
    classId: string
  ): Promise<RazorpayOrder> => {
    try {
      const response = await fetch(
        "https://arkhamrazorpay.onrender.com/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: "INR",
            receipt: `class_${classId}_${Date.now()}`.substring(0, 40),
            notes: {
              class_title: classTitle,
              class_id: classId,
              type: "class_enrollment",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Create order error:", errorData);
        throw new Error(
          `Failed to create order: ${response.status} ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const verifyPayment = async (
    paymentData: RazorpayResponse
  ): Promise<VerificationResult> => {
    try {
      const response = await fetch(
        "https://arkhamrazorpay.onrender.com/api/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          }),
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  // ========================================
  // ENROLLMENT HANDLER (CONDITIONAL PAYMENT)
  // ========================================
  const handleEnrollInClass = async (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    if (ENABLE_PAYMENT_INTEGRATION) {
      // Payment flow
      setPaymentLoading(classId);
      setSelectedClass(classId);
      setPaymentStatus("");

      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay script");
        }

        const priceINR = Math.round(cls.price * USD_TO_INR_RATE);
        const order = await createOrder(priceINR, cls.title, cls.id);
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        const teacher = teachers.find((t) => t.id === cls.teacherId);

        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: "LMS Class Enrollment",
          description: `${cls.title} by ${teacher?.name || "Teacher"} - $${
            cls.price
          } (₹${priceINR})`,
          order_id: order.id,
          prefill: {
            name: userProfile?.email || user?.email || "Student",
            email: user?.email || "student@example.com",
            contact: "9999999999",
          },
          theme: { color: "#000000" },
          handler: async (response: RazorpayResponse) => {
            try {
              setPaymentStatus("verifying");
              const verificationResult = await verifyPayment(response);

              if (verificationResult.verified) {
                const success = await enrollInClass(classId);
                if (success) {
                  setPaymentStatus("success");
                  handleSuccessfulEnrollment(classId);
                  setTimeout(() => {
                    setPaymentStatus("");
                    setSelectedClass(null);
                  }, 3000);
                } else {
                  setPaymentStatus("enrollment_failed");
                }
              } else {
                setPaymentStatus("failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              setPaymentStatus("failed");
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentLoading(null);
              setSelectedClass(null);
              setPaymentStatus("cancelled");
              setTimeout(() => setPaymentStatus(""), 2000);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response: any) {
          console.error("Payment failed:", response.error);
          setPaymentStatus("failed");
          setPaymentLoading(null);
          setSelectedClass(null);
        });
        razorpay.open();
      } catch (error) {
        console.error("Enrollment error:", error);
        setPaymentStatus("error");
      } finally {
        setPaymentLoading(null);
      }
    } else {
      // Direct enrollment for development
      setEnrollmentLoading(classId);
      try {
        const success = await enrollInClass(classId);
        if (success) {
          handleSuccessfulEnrollment(classId);
          console.log(`✅ Successfully enrolled in class: ${cls.title}`);
        } else {
          console.error("❌ Enrollment failed");
        }
      } catch (error) {
        console.error("Enrollment error:", error);
      } finally {
        setEnrollmentLoading(null);
      }
    }
  };

  // ========================================
  // UI HELPER FUNCTIONS
  // ========================================
  const getEnrollButtonContent = (classId: string) => {
    if (ENABLE_PAYMENT_INTEGRATION) {
      if (paymentLoading === classId) {
        return (
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </div>
        );
      }
      if (paymentStatus === "verifying" && selectedClass === classId) {
        return (
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        );
      }
      if (paymentStatus === "success" && selectedClass === classId) {
        return (
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Enrolled!</span>
          </div>
        );
      }
      const cls = classes.find((c) => c.id === classId);
      const priceINR = cls ? Math.round(cls.price * USD_TO_INR_RATE) : 0;
      return cls && cls.price > 0 ? `Pay ₹${priceINR} to Enroll` : "Enroll Now";
    } else {
      // Development mode
      if (enrollmentLoading === classId) {
        return (
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Enrolling...</span>
          </div>
        );
      }
      return "Enroll Now (Dev Mode)";
    }
  };

  const getEnrollButtonDisabled = (classId: string) => {
    if (ENABLE_PAYMENT_INTEGRATION) {
      return (
        paymentLoading === classId ||
        (selectedClass === classId &&
          (paymentStatus === "verifying" || paymentStatus === "success"))
      );
    } else {
      return enrollmentLoading === classId;
    }
  };

  // Fetch enrolled classes for the current user
  const fetchEnrolledClasses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("lms_enrollments")
        .select("class_id")
        .eq("student_id", user.id)
        .eq("status", "active");

      if (error) throw error;
      setEnrolledClasses(
        data?.map((enrollment: any) => enrollment.class_id) || []
      );
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
    }
  };

  // Enhanced enrollInClass function to update local state
  const handleSuccessfulEnrollment = (classId: string) => {
    setEnrolledClasses((prev) => [...prev, classId]);
  };

  // Fetch enrolled classes when user changes
  useEffect(() => {
    fetchEnrolledClasses();
  }, [user]);

  // Helper to check teacher status from Supabase
  const fetchTeacherStatus = async () => {
    if (!user) return;
    // Query lms_teachers for this user
    const { data, error } = await supabase
      .from("lms_teachers")
      .select("is_approved")
      .eq("user_id", user.id)
      .single();
    if (error || !data) {
      setTeacherStatus("none");
      setStatusMessage(null);
      return;
    }
    if (data.is_approved === true) {
      setTeacherStatus("approved");
      setStatusMessage(null);
    } else {
      setTeacherStatus("pending");
      setStatusMessage("Your application is pending admin approval.");
    }
  };

  useEffect(() => {
    fetchTeacherStatus();
    // eslint-disable-next-line
  }, [user]);

  // Redirect non-admins away from admin view
  useEffect(() => {
    if (currentView === "admin" && !isAdmin()) {
      setCurrentView("classes");
    }
  }, [currentView, isAdmin]);

  const handleTeacherOnboarding = async (data: any) => {
    // Check if already a teacher or pending
    await fetchTeacherStatus();
    if (teacherStatus === "approved") {
      setStatusMessage("You are already a teacher.");
      setShowTeacherOnboarding(false);
      return;
    }
    if (teacherStatus === "pending") {
      setStatusMessage("Your application is pending admin approval.");
      setShowTeacherOnboarding(false);
      return;
    }
    // Submit application
    const success = await submitTeacherApplication(data);
    if (success) {
      setShowTeacherOnboarding(false);
      setStatusMessage("Your application is pending admin approval.");
      setTeacherStatus("pending");
    }
  };

  const handleClassCreation = async (data: any) => {
    console.log("Class creation data:", data);
    const success = await createClass(data);
    if (success) {
      setShowClassCreation(false);
    }
  };

  const handleFollowTeacher = (teacherId: string) => {
    setFollowedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSocialInteraction = (
    postId: string,
    action: string,
    data?: any
  ) => {
    console.log("Social interaction:", postId, action, data);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/lms.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10">
        {/* Terminal Header */}
        <header className="border-b border-white/10 glass-panel">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-6 h-6 text-white" />
                  <span className="text-white chrome-text text-xl font-bold">
                    LMS_&_MENTORS.EXE
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* User Actions */}
                <div className="flex items-center space-x-2">
                  {/* Only show "BECOME TEACHER" if user is not already a teacher */}
                  {teacherStatus === "none" && !isTeacher() && (
                    <button
                      onClick={() => setShowTeacherOnboarding(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/30 py-1 px-3 text-sm transition-colors"
                    >
                      BECOME TEACHER
                    </button>
                  )}
                  {/* Show 'Create Class' if teacher is approved */}
                  {(teacherStatus === "approved" || isTeacher()) && (
                    <button
                      onClick={() => setShowClassCreation(true)}
                      className="bg-blue-400/20 text-blue-400 border border-blue-400/30 py-1 px-3 text-sm hover:bg-blue-400/30 transition-colors"
                    >
                      CREATE CLASS
                    </button>
                  )}
                  {/* Show combined roles */}
                  <div className="text-sm text-white/80">
                    {isAdmin() && isTeacher() && "Teacher Admin"}
                    {isAdmin() && !isTeacher() && "Admin"}
                    {!isAdmin() &&
                      (teacherStatus === "approved" || isTeacher()) &&
                      "Teacher"}
                    {!isAdmin() &&
                      teacherStatus === "pending" &&
                      "Pending Teacher"}
                    {!isAdmin() &&
                      teacherStatus === "none" &&
                      !isTeacher() &&
                      "Student"}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-white/80">
                    <span className="text-white">USER:</span>{" "}
                    {userProfile?.email || user?.email || "Guest"}
                  </div>
                  <div className="text-white/80">
                    <span className="text-blue-400">ONLINE</span> NOW
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <button
                  onClick={() => setCurrentView("classes")}
                  className={`px-4 py-2 border transition-colors ${
                    currentView === "classes"
                      ? "bg-white/20 text-white border-white/30"
                      : "text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  CLASSES
                </button>
                <button
                  onClick={() => setCurrentView("marketplace")}
                  className={`px-4 py-2 border transition-colors ${
                    currentView === "marketplace"
                      ? "bg-white/20 text-white border-white/30"
                      : "text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  MENTORS
                </button>
                <button
                  onClick={() => setCurrentView("social")}
                  className={`px-4 py-2 border transition-colors ${
                    currentView === "social"
                      ? "bg-white/20 text-white border-white/30"
                      : "text-white/80 border-white/20 hover:border-white/50"
                  }`}
                >
                  SOCIAL
                </button>
                {isAdmin() && (
                  <button
                    onClick={() => setCurrentView("admin")}
                    className={`px-4 py-2 border transition-colors ${
                      currentView === "admin"
                        ? "bg-white/20 text-white border-white/30"
                        : "text-white/80 border-white/20 hover:border-white/50"
                    }`}
                  >
                    ADMIN
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 pb-8">
          {loading ? (
            <div className="py-12 text-center">
              <div className="glass-panel p-8 rounded-lg inline-block">
                <div className="text-2xl font-bold chrome-text mb-4">
                  INITIALIZING LMS SYSTEM...
                </div>
                <div className="text-silver">
                  Loading your learning management system
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Classes View */}
              {currentView === "classes" && (
                <div className="py-6">
                  <div className="glass-panel p-6 rounded-lg">
                    <h2 className="text-2xl font-bold chrome-text mb-4">
                      Browse Classes
                    </h2>
                    <p className="text-silver mb-6">
                      Discover classes in all subjects and skills
                    </p>

                    {/* Payment Status Messages (only shown when payment is enabled) */}
                    {ENABLE_PAYMENT_INTEGRATION && (
                      <>
                        {paymentStatus === "failed" && (
                          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2 mb-6">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400">
                              Payment verification failed. Please try again.
                            </span>
                          </div>
                        )}

                        {paymentStatus === "cancelled" && (
                          <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 flex items-center space-x-2 mb-6">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400">
                              Payment was cancelled.
                            </span>
                          </div>
                        )}

                        {paymentStatus === "error" && (
                          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2 mb-6">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400">
                              An error occurred. Please try again.
                            </span>
                          </div>
                        )}

                        {paymentStatus === "enrollment_failed" && (
                          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2 mb-6">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400">
                              Payment successful but enrollment failed. Please
                              contact support.
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Development Mode Notice */}
                    {!ENABLE_PAYMENT_INTEGRATION && (
                      <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 flex items-center space-x-2 mb-6">
                        <Terminal className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400">
                          <strong>Development Mode:</strong> Payment integration
                          is disabled. Enrollment happens directly for testing
                          post-enrollment features.
                        </span>
                      </div>
                    )}

                    {loading ? (
                      <div className="text-center py-8">
                        <div className="text-silver">Loading classes...</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => {
                          const teacher = teachers.find(
                            (t) => t.id === cls.teacherId
                          );
                          return (
                            <div
                              key={cls.id}
                              className="glass-panel p-6 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              {/* Class Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-silver">
                                    {cls.category}
                                  </span>
                                </div>
                                <div
                                  className={`px-2 py-1 border rounded-full text-xs ${
                                    cls.difficulty === "beginner"
                                      ? "text-green-400 border-green-400"
                                      : cls.difficulty === "intermediate"
                                      ? "text-yellow-400 border-yellow-400"
                                      : "text-red-400 border-red-400"
                                  }`}
                                >
                                  {cls.difficulty}
                                </div>
                              </div>

                              {/* Class Title */}
                              <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                                {cls.title}
                              </h3>

                              {/* Teacher Info */}
                              {teacher && (
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black font-bold text-sm">
                                    {teacher.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </div>
                                  <div>
                                    <div className="text-sm text-white">
                                      {teacher.name}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-silver">
                                      <span>⭐</span>
                                      <span>{teacher.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Description */}
                              <p className="text-silver text-sm mb-4 line-clamp-3">
                                {cls.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {cls.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {cls.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-silver">
                                    +{cls.tags.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* Class Info */}
                              <div className="flex items-center justify-between text-sm text-silver mb-4">
                                <div className="flex items-center gap-1">
                                  <span>📅</span>
                                  <span>{formatDateTime(cls.dateTime)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>⏱️</span>
                                  <span>{cls.duration} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>👥</span>
                                  <span>{cls.enrolledStudents.length}</span>
                                </div>
                              </div>

                              {/* Price and Action */}
                              <div className="flex items-center justify-between">
                                <div className="text-white font-semibold">
                                  ${cls.price}
                                  <span className="text-sm text-silver ml-1">
                                    /{cls.priceType}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white py-1.5 px-2.5 rounded-lg transition-colors text-xs">
                                    Preview
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Teachers and admins can always view details directly
                                      if (
                                        isTeacher() ||
                                        isAdmin() ||
                                        enrolledClasses.includes(cls.id)
                                      ) {
                                        setSelectedClass(cls.id);
                                        setCurrentView("class-details");
                                      } else {
                                        // Only students need to enroll
                                        handleEnrollInClass(cls.id);
                                      }
                                    }}
                                    disabled={
                                      !isTeacher() &&
                                      !isAdmin() &&
                                      getEnrollButtonDisabled(cls.id)
                                    }
                                    className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                                      isTeacher() ||
                                      isAdmin() ||
                                      enrolledClasses.includes(cls.id)
                                        ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer"
                                        : getEnrollButtonDisabled(cls.id)
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                        : "chrome-button text-black hover:scale-105 transition-transform"
                                    }`}
                                  >
                                    {isTeacher() || isAdmin()
                                      ? "View Details"
                                      : enrolledClasses.includes(cls.id)
                                      ? "View Details"
                                      : getEnrollButtonContent(cls.id)}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mentors View */}
              {currentView === "marketplace" && (
                <div className="py-6">
                  <div className="glass-panel p-6 rounded-lg">
                    <h2 className="text-2xl font-bold chrome-text mb-4">
                      Find Expert Mentors
                    </h2>
                    <p className="text-silver mb-6">
                      Connect with experienced professionals across all fields
                      and subjects
                    </p>

                    {loading ? (
                      <div className="text-center py-8">
                        <div className="text-silver">Loading mentors...</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teachers.map((mentor) => (
                          <div
                            key={mentor.id}
                            className="glass-panel p-6 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            {/* Mentor Avatar */}
                            <div className="flex items-center mb-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black font-bold text-xl">
                                {mentor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-semibold text-white">
                                  {mentor.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-silver">
                                  <span>⭐ {mentor.rating}</span>
                                  <span>•</span>
                                  <span>
                                    👥 {mentor.totalStudents} students
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Bio */}
                            <p className="text-silver text-sm mb-4 line-clamp-3">
                              {mentor.bio}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {mentor.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white"
                                >
                                  {tag}
                                </span>
                              ))}
                              {mentor.tags.length > 3 && (
                                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-silver">
                                  +{mentor.tags.length - 3} more
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => setSelectedTeacher(mentor)}
                              className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                              View Profile
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Feed View */}
              {currentView === "social" && <SocialFeed />}

              {/* Admin Panel View */}
              {currentView === "admin" &&
                (isAdmin() ? (
                  <AdminPanel
                    pendingTeachers={pendingTeachers}
                    onApproveTeacher={async (teacherId) => {
                      const success = await approveTeacher(teacherId);
                      if (success) {
                        // Refresh pending teachers list
                        const pending = await fetchPendingTeachers();
                        setPendingTeachers(pending);
                      }
                    }}
                    onRejectTeacher={async (teacherId) => {
                      const success = await rejectTeacher(teacherId);
                      if (success) {
                        // Refresh pending teachers list
                        const pending = await fetchPendingTeachers();
                        setPendingTeachers(pending);
                      }
                    }}
                    onViewTeacher={(teacherId) => {
                      const teacher = pendingTeachers.find(
                        (t) => t.id === teacherId
                      );
                      if (teacher) setSelectedTeacher(teacher);
                    }}
                  />
                ) : (
                  <div className="py-6">
                    <div className="glass-panel p-6 rounded-lg text-center">
                      <h2 className="text-2xl font-bold text-red-400 mb-4">
                        Access Denied
                      </h2>
                      <p className="text-silver">
                        You don't have administrator privileges to access this
                        section.
                      </p>
                    </div>
                  </div>
                ))}

              {/* Class Details View */}
              {currentView === "class-details" && selectedClass && (
                <ClassDetails
                  classData={classes.find((c) => c.id === selectedClass)}
                  user={user}
                  teachers={teachers}
                  isTeacher={isTeacher}
                  onBack={() => {
                    setCurrentView("classes");
                    setSelectedClass(null);
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showTeacherOnboarding && (
        <TeacherOnboarding
          onSubmit={handleTeacherOnboarding}
          onCancel={() => setShowTeacherOnboarding(false)}
        />
      )}

      {showClassCreation && (
        <ClassCreation
          onSubmit={handleClassCreation}
          onCancel={() => setShowClassCreation(false)}
        />
      )}

      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TeacherProfile
              teacher={selectedTeacher}
              onFollow={handleFollowTeacher}
              onMessage={(teacherId) =>
                console.log("Message teacher:", teacherId)
              }
              isFollowing={followedTeachers.includes(selectedTeacher.id)}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="bg-white/10 text-white py-2 px-6 border border-white/20 hover:bg-white/20 transition-colors"
              >
                [CLOSE]
              </button>
            </div>
          </div>
        </div>
      )}
      {statusMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-900 text-yellow-200 px-6 py-3 rounded shadow-lg z-50">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default LMSMentors;
