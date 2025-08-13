import React from "react";
import { Clock, BookOpen, Award } from "lucide-react";
import type { Course } from "../../types/lms";

interface LMSCourseProps {
  course: Course;
}

export const LMSCourse = ({ course }: LMSCourseProps) => (
  <div className="bg-[#1a0f0f]/90 academia-border rounded-lg overflow-hidden">
    <div className="relative aspect-video">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center space-x-4 text-[#B8864D]/80 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {course.lessons} lessons
          </div>
        </div>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl text-[#B8864D] academia-text mb-2">
        {course.title}
      </h3>
      <p className="text-[#B8864D]/80 academia-text mb-4">
        {course.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-[#B8864D]/60">
          <Award className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {course.completed ? "Completed" : `${course.progress}% Complete`}
          </span>
        </div>
        <button className="px-4 py-2 bg-[#8B0000]/20 text-[#B8864D] border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/30 transition-colors academia-text">
          {course.completed ? "Review Course" : "Continue Learning"}
        </button>
      </div>
    </div>
  </div>
);
