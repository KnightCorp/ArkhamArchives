import React, { useState } from "react";
import {
  Check,
  X,
  Eye,
  Users,
  BookOpen,
  Calendar,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Teacher } from "../../../types";

interface AdminPanelProps {
  pendingTeachers: Teacher[];
  onApproveTeacher: (teacherId: string) => void;
  onRejectTeacher: (teacherId: string) => void;
  onViewTeacher: (teacherId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  pendingTeachers,
  onApproveTeacher,
  onRejectTeacher,
  onViewTeacher,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    "pending" | "approved" | "analytics"
  >("pending");
  const [showConfirmation, setShowConfirmation] = useState<{
    teacherId: string;
    action: "approve" | "reject";
  } | null>(null);

  const handleConfirmAction = () => {
    if (showConfirmation) {
      if (showConfirmation.action === "approve") {
        onApproveTeacher(showConfirmation.teacherId);
      } else {
        onRejectTeacher(showConfirmation.teacherId);
      }
      setShowConfirmation(null);
    }
  };

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "N/A";

    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="py-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">ADMIN_PANEL.EXE</h2>
        </div>
        <p className="text-white/60 text-sm">
          SYSTEM ADMINISTRATION AND TEACHER APPROVAL
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-white/10">
        <button
          onClick={() => setSelectedTab("pending")}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            selectedTab === "pending"
              ? "border-yellow-400 text-yellow-400"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          PENDING_APPROVALS ({pendingTeachers.length})
        </button>
        <button
          onClick={() => setSelectedTab("approved")}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            selectedTab === "approved"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          APPROVED_TEACHERS
        </button>
        <button
          onClick={() => setSelectedTab("analytics")}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            selectedTab === "analytics"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-white/60 hover:text-white"
          }`}
        >
          SYSTEM_ANALYTICS
        </button>
      </div>

      {/* Pending Approvals Tab */}
      {selectedTab === "pending" && (
        <div>
          {pendingTeachers.length === 0 ? (
            <div className="bg-black/50 border border-white/20 p-8 text-center">
              <Check className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-white/60">No pending teacher applications.</p>
              <p className="text-white/40 text-sm mt-2">
                All applications have been processed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-black/50 border border-yellow-400/30 p-6"
                >
                  {/* Teacher Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center">
                        {teacher.profilePhoto ? (
                          <img
                            src={teacher.profilePhoto}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-8 h-8 text-white/60" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {teacher.name}
                        </h3>
                        <p className="text-white/70 text-sm">{teacher.bio}</p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-white/60">
                          <Calendar className="w-3 h-3" />
                          <span>Applied: {formatDate(teacher.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-sm">
                        PENDING_REVIEW
                      </span>
                    </div>
                  </div>

                  {/* Professional Background */}
                  <div className="mb-4">
                    <h4 className="text-white font-bold text-sm mb-2">
                      PROFESSIONAL_BACKGROUND:
                    </h4>
                    <p className="text-white/80 text-sm bg-black/30 border border-white/10 p-3">
                      {teacher.professionalBackground}
                    </p>
                  </div>

                  {/* Expertise */}
                  <div className="mb-4">
                    <h4 className="text-white font-bold text-sm mb-2">
                      EXPERTISE:
                    </h4>
                    <p className="text-white/80 text-sm bg-black/30 border border-white/10 p-3">
                      {teacher.expertise}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <h4 className="text-white font-bold text-sm mb-2">
                      SPECIALIZATION_TAGS:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-white border border-white/30 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  {(teacher.linkedinUrl ||
                    teacher.youtubeUrl ||
                    teacher.instagramUrl) && (
                    <div className="mb-6">
                      <h4 className="text-white font-bold text-sm mb-2">
                        SOCIAL_VERIFICATION:
                      </h4>
                      <div className="space-y-1">
                        {teacher.linkedinUrl && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-white/60">LinkedIn:</span>
                            <a
                              href={teacher.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {teacher.linkedinUrl}
                            </a>
                          </div>
                        )}
                        {teacher.youtubeUrl && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-white/60">YouTube:</span>
                            <a
                              href={teacher.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300"
                            >
                              {teacher.youtubeUrl}
                            </a>
                          </div>
                        )}
                        {teacher.instagramUrl && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-white/60">Instagram:</span>
                            <a
                              href={teacher.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300"
                            >
                              {teacher.instagramUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => onViewTeacher(teacher.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>VIEW_FULL_PROFILE</span>
                    </button>

                    <button
                      onClick={() =>
                        setShowConfirmation({
                          teacherId: teacher.id,
                          action: "approve",
                        })
                      }
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors text-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>APPROVE</span>
                    </button>

                    <button
                      onClick={() =>
                        setShowConfirmation({
                          teacherId: teacher.id,
                          action: "reject",
                        })
                      }
                      className="flex items-center space-x-2 px-4 py-2 bg-red-400/20 text-red-400 border border-red-400/30 hover:bg-red-400/30 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>REJECT</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approved Teachers Tab */}
      {selectedTab === "approved" && (
        <div className="bg-black/50 border border-white/20 p-8 text-center">
          <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
          <p className="text-white/60">
            Approved teachers management interface.
          </p>
          <p className="text-white/40 text-sm mt-2">Feature coming soon...</p>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/50 border border-white/20 p-4">
            <h3 className="text-white font-bold mb-2">TOTAL_TEACHERS</h3>
            <div className="text-2xl text-white font-mono">--</div>
            <p className="text-white/60 text-sm">Approved instructors</p>
          </div>

          <div className="bg-black/50 border border-white/20 p-4">
            <h3 className="text-white font-bold mb-2">PENDING_REVIEWS</h3>
            <div className="text-2xl text-yellow-400 font-mono">
              {pendingTeachers.length}
            </div>
            <p className="text-white/60 text-sm">Awaiting approval</p>
          </div>

          <div className="bg-black/50 border border-white/20 p-4">
            <h3 className="text-white font-bold mb-2">ACTIVE_CLASSES</h3>
            <div className="text-2xl text-blue-400 font-mono">--</div>
            <p className="text-white/60 text-sm">Currently running</p>
          </div>

          <div className="bg-black/50 border border-white/20 p-4">
            <h3 className="text-white font-bold mb-2">TOTAL_STUDENTS</h3>
            <div className="text-2xl text-purple-400 font-mono">--</div>
            <p className="text-white/60 text-sm">Platform users</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-black border border-white/20 max-w-md w-full p-6">
            <h3 className="text-white font-bold text-lg mb-4">
              CONFIRM_ACTION
            </h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to {showConfirmation.action} this teacher
              application? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(null)}
                className="flex-1 px-4 py-2 border text-white border-white/20 hover:border-white/50"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2 border ${
                  showConfirmation.action === "approve"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-red-400/20 text-red-400 border-red-400/30"
                }`}
              >
                {showConfirmation.action === "approve" ? "APPROVE" : "REJECT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
