import React, { useState } from 'react';
import { Star, Users, DollarSign, Calendar, Clock, BookOpen, TrendingUp, Award, Filter } from 'lucide-react';
import { Teacher, Class } from '../types';

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
  onViewTeacher
}) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'classes' | 'trending'>('featured');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white subtle-glow mb-2">
          EDTECH_MARKETPLACE.<span className="text-green-400">EXE</span>
        </h1>
        <p className="text-white/60">
          DISCOVER <span className="text-green-400">EXPERT</span> TEACHERS AND CUTTING-EDGE COURSES
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="black-glass border border-white/20 flex">
          {[
            { id: 'featured', label: 'FEATURED_TEACHERS', icon: Award },
            { id: 'classes', label: 'POPULAR_CLASSES', icon: BookOpen },
            { id: 'trending', label: 'TRENDING_TOPICS', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-400/20 text-green-400 border-r border-green-400/30'
                  : 'text-white/80 hover:text-white border-r border-white/10 last:border-r-0'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Teachers */}
      {activeTab === 'featured' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="black-glass white-glow p-4 cursor-pointer hover:white-glow-strong transition-all"
              onClick={() => onViewTeacher(teacher.id)}
            >
              {/* Teacher Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  {teacher.profilePhoto ? (
                    <img 
                      src={teacher.profilePhoto} 
                      alt={teacher.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 text-white/60" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{teacher.name}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white/80 text-sm">{teacher.rating.toFixed(1)}</span>
                    <span className="text-white/60 text-sm">({teacher.totalStudents} students)</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-white/70 text-sm mb-4 line-clamp-3">{teacher.bio}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {teacher.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-400/20 text-green-400 px-2 py-1 text-xs border border-green-400/30"
                  >
                    {tag}
                  </span>
                ))}
                {teacher.tags.length > 3 && (
                  <span className="text-white/60 text-xs px-2 py-1">
                    +{teacher.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-white font-bold">{teacher.totalClasses}</div>
                  <div className="text-white/60 text-xs">CLASSES</div>
                </div>
                <div>
                  <div className="text-white font-bold">{teacher.totalStudents}</div>
                  <div className="text-white/60 text-xs">STUDENTS</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularClasses.map((classItem) => (
            <div key={classItem.id} className="black-glass white-glow p-4">
              {/* Class Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{classItem.title}</h3>
                  <p className="text-green-400 text-sm">{classItem.topic}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${classItem.price}</div>
                  <div className="text-white/60 text-xs">/{classItem.priceType}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{classItem.description}</p>

              {/* Class Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-white/80">
                    {new Date(classItem.dateTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-white/80">
                    {new Date(classItem.dateTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-white/80">
                    {classItem.enrolledStudents.length}/{classItem.maxStudents || 'Unlimited'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 capitalize">{classItem.difficulty}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {classItem.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-400/20 text-green-400 px-2 py-1 text-xs border border-green-400/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Topics Covered */}
              <div className="mb-4">
                <h4 className="text-white/80 text-sm font-bold mb-2">Topics Covered:</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  {classItem.topicsCovered.slice(0, 3).map((topic, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
                      {topic}
                    </li>
                  ))}
                  {classItem.topicsCovered.length > 3 && (
                    <li className="text-white/60 text-xs">
                      +{classItem.topicsCovered.length - 3} more topics
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEnroll(classItem.id)}
                  className="flex-1 bg-green-400/20 text-green-400 py-2 px-4 border border-green-400/30 hover:bg-green-400/30 transition-colors text-sm"
                >
                  [ENROLL_NOW]
                </button>
                <button
                  onClick={() => onViewTeacher(classItem.teacherId)}
                  className="bg-white/10 text-white py-2 px-4 border border-white/20 hover:bg-white/20 transition-colors text-sm"
                >
                  [VIEW_TEACHER]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trending Topics */}
      {activeTab === 'trending' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingTopics.map((topic, index) => (
            <div key={topic} className="black-glass white-glow p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-bold">#{index + 1}</span>
              </div>
              <h3 className="text-white font-bold mb-2">{topic}</h3>
              <div className="text-white/60 text-sm">
                {Math.floor(Math.random() * 500) + 100} classes available
              </div>
              <button className="mt-3 w-full bg-green-400/20 text-green-400 py-2 px-4 border border-green-400/30 hover:bg-green-400/30 transition-colors text-sm">
                [EXPLORE_TOPIC]
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;