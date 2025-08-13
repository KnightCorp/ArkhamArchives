import React from 'react';
import { Book } from 'lucide-react';
import { LMSCourse } from './LMSCourse';
import { LMSProgress } from './LMSProgress';
import type { Course } from '../../../types/lms';

interface LMSSectionProps {
  courses: Course[];
}

export const LMSSection = ({ courses }: LMSSectionProps) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <Book className="w-6 h-6 text-[#B8864D]" />
      <h2 className="text-2xl academia-text academia-gold">Your Learning Journey</h2>
    </div>
    
    <LMSProgress courses={courses} />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <LMSCourse key={course.id} course={course} />
      ))}
    </div>
  </div>
);