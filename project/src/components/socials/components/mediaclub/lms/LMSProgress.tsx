import React from 'react';
import { Award, Target, Clock } from 'lucide-react';
import type { Course } from '../../../types/lms';

interface LMSProgressProps {
  courses: Course[];
}

export const LMSProgress = ({ courses }: LMSProgressProps) => {
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.completed).length;
  const averageProgress = courses.reduce((acc, c) => acc + c.progress, 0) / totalCourses;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#1a0f0f]/90 academia-border rounded-lg p-6">
        <Award className="w-8 h-8 text-[#B8864D] mb-4" />
        <div className="text-2xl text-[#B8864D] academia-text mb-1">
          {completedCourses}/{totalCourses}
        </div>
        <p className="text-[#B8864D]/60 academia-text">Courses Completed</p>
      </div>
      
      <div className="bg-[#1a0f0f]/90 academia-border rounded-lg p-6">
        <Target className="w-8 h-8 text-[#B8864D] mb-4" />
        <div className="text-2xl text-[#B8864D] academia-text mb-1">
          {Math.round(averageProgress)}%
        </div>
        <p className="text-[#B8864D]/60 academia-text">Overall Progress</p>
      </div>
      
      <div className="bg-[#1a0f0f]/90 academia-border rounded-lg p-6">
        <Clock className="w-8 h-8 text-[#B8864D] mb-4" />
        <div className="text-2xl text-[#B8864D] academia-text mb-1">
          {courses.reduce((acc, c) => acc + c.hoursSpent, 0)}h
        </div>
        <p className="text-[#B8864D]/60 academia-text">Total Learning Hours</p>
      </div>
    </div>
  );
};