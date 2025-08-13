import React from "react";
import {
  Star,
  Users,
  BookOpen,
  MessageCircle,
  Heart,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Teacher } from "../../../types";

interface TeacherProfileProps {
  teacher: Teacher;
  onFollow: (teacherId: string) => void;
  onMessage: (teacherId: string) => void;
  isFollowing: boolean;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({
  teacher,
  onFollow,
  onMessage,
  isFollowing,
}) => {
  return (
    <div className="bg-black border border-white/20 text-white max-w-4xl w-full">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start space-x-6">
          {/* Profile Photo */}
          <div className="w-24 h-24 bg-white/10 border border-white/20 flex items-center justify-center">
            {teacher.profilePhoto ? (
              <img
                src={teacher.profilePhoto}
                alt={teacher.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-12 h-12 text-white/60" />
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {teacher.name}
                </h1>
                <p className="text-white/80 mb-2">{teacher.bio}</p>

                {/* Rating & Stats */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white">{teacher.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">
                      {teacher.totalStudents} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">
                      {teacher.totalClasses} classes
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onFollow(teacher.id)}
                  className={`px-4 py-2 border transition-colors ${
                    isFollowing
                      ? "bg-white/20 text-white border-white/30"
                      : "text-white border-white/20 hover:border-white/50"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 inline mr-2 ${
                      isFollowing ? "fill-current" : ""
                    }`}
                  />
                  {isFollowing ? "FOLLOWING" : "FOLLOW"}
                </button>
                <button
                  onClick={() => onMessage(teacher.id)}
                  className="px-4 py-2 border text-white border-white/20 hover:border-white/50"
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  MESSAGE
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {teacher.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Professional Background */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                PROFESSIONAL_BACKGROUND
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {teacher.professionalBackground}
              </p>
            </div>

            {/* Expertise */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                EXPERTISE
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {teacher.expertise}
              </p>
            </div>

            {/* Social Links */}
            {(teacher.linkedinUrl ||
              teacher.youtubeUrl ||
              teacher.instagramUrl) && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                  SOCIAL_LINKS
                </h3>
                <div className="space-y-2">
                  {teacher.linkedinUrl && (
                    <a
                      href={teacher.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-white/80 hover:text-white text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {teacher.youtubeUrl && (
                    <a
                      href={teacher.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-white/80 hover:text-white text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>YouTube Channel</span>
                    </a>
                  )}
                  {teacher.instagramUrl && (
                    <a
                      href={teacher.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-white/80 hover:text-white text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Instagram Profile</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Approval Status */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                STATUS
              </h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    teacher.isApproved ? "bg-white" : "bg-yellow-400"
                  }`}
                />
                <span
                  className={`text-sm ${
                    teacher.isApproved ? "text-white" : "text-yellow-400"
                  }`}
                >
                  {teacher.isApproved
                    ? "APPROVED_INSTRUCTOR"
                    : "PENDING_APPROVAL"}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                STATISTICS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Total Students:</span>
                  <span className="text-white font-mono">
                    {teacher.totalStudents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Classes Taught:</span>
                  <span className="text-white font-mono">
                    {teacher.totalClasses}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Average Rating:</span>
                  <span className="text-white font-mono">
                    {teacher.rating}/5.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Member Since:</span>
                  <span className="text-white font-mono">
                    {teacher.createdAt.getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">
                QUICK_ACTIONS
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-white/10 border border-white/20 text-white py-2 px-4 hover:bg-white/20 transition-colors text-sm">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  VIEW_UPCOMING_CLASSES
                </button>
                <button className="w-full bg-white/10 border border-white/20 text-white py-2 px-4 hover:bg-white/20 transition-colors text-sm">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  BROWSE_PAST_SESSIONS
                </button>
                <button className="w-full bg-white/10 border border-white/20 text-white py-2 px-4 hover:bg-white/20 transition-colors text-sm">
                  <Star className="w-4 h-4 inline mr-2" />
                  VIEW_REVIEWS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
