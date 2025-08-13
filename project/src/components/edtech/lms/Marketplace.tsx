import React from "react";
import {
  Star,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";
import { Teacher, Class } from "../../../types";

interface MarketplaceProps {
  featuredTeachers: Teacher[];
  popularClasses: Class[];
  trendingTopics: string[];
  onEnroll: (classId: string) => void;
  onViewTeacher: (teacherId: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  featuredTeachers,
  popularClasses,
  trendingTopics,
  onEnroll,
  onViewTeacher,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-white border-white/30";
      case "intermediate":
        return "text-yellow-400 border-yellow-400/30";
      case "advanced":
        return "text-red-400 border-red-400/30";
      default:
        return "text-white/60 border-white/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="py-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          EDTECH_MARKETPLACE.EXE
        </h2>
        <p className="text-white/60 text-sm">
          DISCOVER EXPERT INSTRUCTORS AND PREMIUM CLASSES
        </p>
      </div>

      {/* Trending Topics */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-white" />
          <h3 className="text-white font-bold">TRENDING_TOPICS</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 text-white border border-white/30 text-sm hover:bg-white/20 transition-colors cursor-pointer"
            >
              #{topic.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Teachers */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-bold">FEATURED_INSTRUCTORS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-black/50 border border-white/20 p-4 hover:border-white/50 transition-colors cursor-pointer"
              onClick={() => onViewTeacher(teacher.id)}
            >
              {/* Teacher Header */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center">
                  {teacher.profilePhoto ? (
                    <img
                      src={teacher.profilePhoto}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 text-white/60" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">
                    {teacher.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white/80">{teacher.rating}</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/60">
                      {teacher.totalStudents} students
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-white/70 text-sm mb-3 line-clamp-2">
                {teacher.bio}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {teacher.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 text-white/70 text-xs border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
                {teacher.tags.length > 3 && (
                  <span className="px-2 py-1 text-white/50 text-xs">
                    +{teacher.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs text-white/60">
                <span>{teacher.totalClasses} classes</span>
                <span>Joined {teacher.createdAt.getFullYear()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Classes */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-bold">POPULAR_CLASSES</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {popularClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-black/50 border border-white/20 p-6 hover:border-white/50 transition-colors"
            >
              {/* Class Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">
                    {classItem.title}
                  </h4>
                  <p className="text-white/70 text-sm mb-2">
                    {classItem.topic}
                  </p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span
                      className={`px-2 py-1 border ${getDifficultyColor(
                        classItem.difficulty
                      )}`}
                    >
                      {classItem.difficulty.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 border ${
                        classItem.isLive
                          ? "text-red-400 border-red-400/30"
                          : "text-blue-400 border-blue-400/30"
                      }`}
                    >
                      {classItem.isLive ? "LIVE" : "RECORDED"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">
                    ${classItem.price}
                  </div>
                  <div className="text-white/60 text-xs">
                    /{classItem.priceType}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 text-sm mb-4 line-clamp-2">
                {classItem.description}
              </p>

              {/* Topics Covered */}
              <div className="mb-4">
                <h5 className="text-white/80 text-xs font-bold mb-2">
                  TOPICS COVERED:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {classItem.topicsCovered.slice(0, 4).map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 text-white/70 text-xs border border-white/10"
                    >
                      {topic}
                    </span>
                  ))}
                  {classItem.topicsCovered.length > 4 && (
                    <span className="px-2 py-1 text-white/50 text-xs">
                      +{classItem.topicsCovered.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Class Info */}
              <div className="flex items-center justify-between mb-4 pt-3 border-t border-white/10">
                <div className="flex items-center space-x-4 text-xs text-white/60">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(classItem.dateTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{classItem.enrolledStudents.length} enrolled</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => onEnroll(classItem.id)}
                  className="flex-1 bg-white/20 text-white border border-white/30 py-2 px-4 hover:bg-white/30 transition-colors text-sm font-bold"
                >
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  ENROLL NOW
                </button>
                <button
                  onClick={() => onViewTeacher(classItem.teacherId)}
                  className="bg-white/10 text-white border border-white/20 py-2 px-4 hover:bg-white/20 transition-colors text-sm"
                >
                  VIEW TEACHER
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 border border-white/20 p-6 text-center">
        <h3 className="text-white font-bold text-lg mb-2">
          BECOME AN INSTRUCTOR
        </h3>
        <p className="text-white/70 mb-4">
          Share your expertise with thousands of students worldwide
        </p>
        <button className="bg-white/20 text-white border border-white/30 py-2 px-6 hover:bg-white/30 transition-colors font-bold">
          START TEACHING TODAY
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
